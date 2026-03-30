import { Interaction } from 'discord.js';
import * as mypointCommand from '../commands/mypoint';
import * as rankingCommand from '../commands/ranking';
import { handleButton } from '../handlers/buttonHandler';
import { handleModalSubmit } from '../handlers/modalSubmitHandler';

export const handleInteractionCreate = async (interaction: Interaction) => {
  try {
    // スラッシュコマンドの処理
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'mypoint') {
        await mypointCommand.execute(interaction);
      } else if (interaction.commandName === 'ranking') {
        await rankingCommand.execute(interaction);
      }
    }

    // ボタンの処理
    else if (interaction.isButton()) {
      await handleButton(interaction);
    }

    // モーダル送信の処理
    else if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction);
    }
  } catch (error) {
    console.error('Interaction Handling Error:', error);
    if (interaction.isRepliable() && !interaction.replied) {
      await interaction.reply({ content: '処理中にエラーが発生しました。', ephemeral: true });
    }
  }
};
