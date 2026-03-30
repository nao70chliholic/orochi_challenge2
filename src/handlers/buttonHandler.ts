import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import { prisma } from '../db';
import { getStartOfTodayJST } from '../utils/date';

export const handleButton = async (interaction: ButtonInteraction) => {
  const customId = interaction.customId;

  // ボタンから推測される投稿種別を取得
  let postType = '';
  let postTypeName = '';
  if (customId === 'btn_challenge') {
    postType = 'challenge';
    postTypeName = 'チャレンジ宣言';
  } else if (customId === 'btn_done') {
    postType = 'done';
    postTypeName = 'できたこと報告';
  } else if (customId === 'btn_pun') {
    postType = 'pun';
    postTypeName = 'ダジャレ';
  }

  // 既に今日の投稿を行っているかチェック
  if (postType) {
    const startOfToday = getStartOfTodayJST();
    const existingPost = await prisma.dailyPost.findFirst({
      where: {
        discord_user_id: interaction.user.id,
        post_type: postType,
        posted_at: {
          gte: startOfToday,
        },
      },
    });

    if (existingPost) {
      await interaction.reply({
        content: `本日すでに「${postTypeName}」を投稿しています！また明日報告してくださいね✨`,
        ephemeral: true,
      });
      return;
    }
  }

  // ボタンの種類に応じたモーダルを生成
  if (customId === 'btn_challenge') {
    const modal = new ModalBuilder()
      .setCustomId('modal_challenge')
      .setTitle('チャレンジ宣言');

    const contentInput = new TextInputBuilder()
      .setCustomId('content')
      .setLabel('今日やること')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('例: 案件Aの進捗を30%進める！');

    const commentInput = new TextInputBuilder()
      .setCustomId('comment')
      .setLabel('一言コメント（任意）')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setPlaceholder('意気込みなどをどうぞ！');

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(commentInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);

  } else if (customId === 'btn_done') {
    const modal = new ModalBuilder()
      .setCustomId('modal_done')
      .setTitle('できたこと報告');

    const contentInput = new TextInputBuilder()
      .setCustomId('content')
      .setLabel('できたこと')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('例: 案件Aの進捗を30%進められました！');

    const commentInput = new TextInputBuilder()
      .setCustomId('comment')
      .setLabel('一言コメント（任意）')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setPlaceholder('感想などをどうぞ！');

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(commentInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);

  } else if (customId === 'btn_pun') {
    const modal = new ModalBuilder()
      .setCustomId('modal_pun')
      .setTitle('ダジャレをいう');

    const contentInput = new TextInputBuilder()
      .setCustomId('content')
      .setLabel('ダジャレ本文')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('例: トイレにいっといれ');

    const commentInput = new TextInputBuilder()
      .setCustomId('comment')
      .setLabel('補足コメント（任意）')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setPlaceholder('渾身の一撃です');

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(commentInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  }
};
