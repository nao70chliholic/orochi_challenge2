import { Client, GatewayIntentBits, Events } from 'discord.js';
import * as dotenv from 'dotenv';
import { handleReady } from './events/ready';
import { handleInteractionCreate } from './events/interactionCreate';
import { initDailyPostCron } from './crons/dailyPost';

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error('❌ DISCORD_BOT_TOKEN is not set in the environment variables.');
  process.exit(1);
}

// Botクライアントの初期化（必要なインテントを設定）
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// イベントリスナーの登録
client.once(Events.ClientReady, (c) => {
  handleReady(c);
  initDailyPostCron(c); // 起動時にCronジョブをセットアップ
});

client.on(Events.InteractionCreate, handleInteractionCreate);

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

// 未キャッチの例外やPromiseの拒否でプロセスがクラッシュするのを防ぐ
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Botのログイン
client.login(token);
