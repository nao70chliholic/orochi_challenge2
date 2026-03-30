import cron from 'node-cron';
import { Client, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const initDailyPostCron = (client: Client) => {
  const channelId = process.env.TARGET_CHANNEL_ID;
  const timezone = process.env.TIMEZONE || 'Asia/Tokyo';

  if (!channelId) {
    console.error('❌ TARGET_CHANNEL_IDが設定されていないため、定時投稿を無効化します。');
    return;
  }

  // 毎日 7:30 に実行される設定。
  // "30 7 * * *" 分・時・日・月・曜日
  cron.schedule('30 7 * * *', async () => {
    try {
      const channel = await client.channels.fetch(channelId);

      if (channel && channel.isTextBased()) {
        const textChannel = channel as TextChannel;

        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('btn_challenge')
              .setLabel('チャレンジ宣言')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('🔥'),
            new ButtonBuilder()
              .setCustomId('btn_done')
              .setLabel('できたこと報告')
              .setStyle(ButtonStyle.Success)
              .setEmoji('🎉'),
            new ButtonBuilder()
              .setCustomId('btn_pun')
              .setLabel('ダジャレをいう')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('🤣')
          );

        await textChannel.send({
          content: 'おはようございます！今日の行動を記録しよう✨\n下のボタンから選んで入力してください📝',
          components: [row]
        });

        console.log(`✅ [${new Date().toLocaleString('ja-JP', { timeZone: timezone })}] 定期投稿を実行しました。`);
      } else {
        console.error('❌ 指定されたチャンネルが見つからないか、テキストチャンネルではありません。');
      }
    } catch (error) {
      console.error('定時投稿エラー:', error);
    }
  }, {
    timezone: timezone
  });

  console.log('✅ Cronジョブ（毎朝7:30の投稿）をスケジュールしました。');
};
