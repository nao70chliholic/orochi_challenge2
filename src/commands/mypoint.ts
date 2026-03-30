import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../db';

export const data = new SlashCommandBuilder()
  .setName('mypoint')
  .setDescription('自分の累計ポイントを表示します');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { discord_user_id: userId },
    });

    const points = user ? user.total_points : 0;
    const displayName = user ? user.display_name : interaction.user.username;

    await interaction.reply({
      content: `${displayName}さんの現在の累計ポイントは **${points}pt** です！✨`,
      ephemeral: false, // Everyone can see
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    await interaction.reply({
      content: 'エラーが発生しました。時間を置いて再度お試しください。',
      ephemeral: true,
    });
  }
};
