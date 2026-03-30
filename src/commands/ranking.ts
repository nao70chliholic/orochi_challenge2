import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../db';

export const data = new SlashCommandBuilder()
  .setName('ranking')
  .setDescription('累計ポイントの上位10名を表示します');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: {
        total_points: 'desc',
      },
      take: 10,
    });

    if (topUsers.length === 0) {
      return await interaction.reply({
        content: 'まだ参加者がいません。',
        ephemeral: false,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 ポイントランキング トップ10 🏆')
      .setColor('#FFD700');

    let description = '';
    topUsers.forEach((user: { display_name: string, total_points: number }, index: number) => {
      // 1-3位はメダル、それ以降は数字
      let rankIcon = `${index + 1}位`;
      if (index === 0) rankIcon = '🥇';
      if (index === 1) rankIcon = '🥈';
      if (index === 2) rankIcon = '🥉';

      description += `${rankIcon} **${user.display_name}** - ${user.total_points} pt\n`;
    });

    embed.setDescription(description);

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    await interaction.reply({
      content: 'エラーが発生しました。時間を置いて再度お試しください。',
      ephemeral: true,
    });
  }
};
