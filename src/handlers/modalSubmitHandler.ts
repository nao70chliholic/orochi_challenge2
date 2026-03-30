import { ModalSubmitInteraction } from 'discord.js';
import { prisma } from '../db';
import pointsConfig from '../config/points.json';
import { getStartOfTodayJST } from '../utils/date';

export const handleModalSubmit = async (interaction: ModalSubmitInteraction) => {
  const customId = interaction.customId;

  // 必須項目と任意項目の取得
  const content = interaction.fields.getTextInputValue('content');
  const comment = interaction.fields.getTextInputValue('comment') || null;

  const discordUserId = interaction.user.id;
  const userName = interaction.user.username;
  const displayName = interaction.user.displayName || userName;

  let postType = '';
  let pointAwarded = 0;
  let replyMessage = '';

  if (customId === 'modal_challenge') {
    postType = 'challenge';
    pointAwarded = pointsConfig.challenge;
    replyMessage = `✅ **チャレンジ宣言**を記録しました！（+${pointAwarded}pt）\n「${content}」`;
  } else if (customId === 'modal_done') {
    postType = 'done';
    pointAwarded = pointsConfig.done;
    replyMessage = `🎉 **できたこと報告**を記録しました！（+${pointAwarded}pt）\n「${content}」`;
  } else if (customId === 'modal_pun') {
    postType = 'pun';
    pointAwarded = pointsConfig.pun;
    replyMessage = `🤣 **ダジャレ**を記録しました！（+${pointAwarded}pt）\n「${content}」`;
  } else {
    return;
  }

  // 既に今日の投稿を行っているか最終チェック
  const startOfToday = getStartOfTodayJST();
  const existingPost = await prisma.dailyPost.findFirst({
    where: {
      discord_user_id: discordUserId,
      post_type: postType,
      posted_at: {
        gte: startOfToday,
      },
    },
  });

  if (existingPost) {
    await interaction.reply({
      content: '本日すでにこの報告を完了しています！また明日お願いします✨',
      ephemeral: true,
    });
    return;
  }

  try {
    // ユーザー情報の取得または作成（upsert）
    const user = await prisma.user.upsert({
      where: { discord_user_id: discordUserId },
      update: {
        display_name: displayName,
        user_name: userName,
        total_points: {
          increment: pointAwarded,
        },
      },
      create: {
        discord_user_id: discordUserId,
        user_name: userName,
        display_name: displayName,
        total_points: pointAwarded,
      },
    });

    // 投稿内容の保存
    const post = await prisma.dailyPost.create({
      data: {
        discord_user_id: discordUserId,
        post_type: postType,
        content: content,
        comment: comment,
        point_awarded: pointAwarded,
      },
    });

    // ポイント履歴の保存
    await prisma.pointLog.create({
      data: {
        discord_user_id: discordUserId,
        reason: postType,
        points: pointAwarded,
        related_post_id: post.id,
      },
    });

    // モーダルに対する応答（チャンネルに投稿を通知する）
    await interaction.reply({
      content: `${interaction.user} ${replyMessage}\n現在の累計ポイント: **${user.total_points}pt**`,
      ephemeral: false, // チャンネル全員が見えるようにする
    });

  } catch (error) {
    console.error('Error handling modal submit:', error);
    await interaction.reply({
      content: 'データの保存中にエラーが発生しました。',
      ephemeral: true,
    });
  }
};
