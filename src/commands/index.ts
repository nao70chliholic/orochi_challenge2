import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

// コマンドファイルの読み込み
import * as mypoint from './mypoint';
import * as ranking from './ranking';

const commands = [
  mypoint.data.toJSON(),
  ranking.data.toJSON(),
];

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('❌ 環境変数（DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID）を設定してください。');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // 指定したサーバー（Guild）にコマンドを登録
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
