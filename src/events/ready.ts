import { Client, Events } from 'discord.js';

export const handleReady = async (client: Client) => {
  console.log(`🚀 Ready! Logged in as ${client.user?.tag}`);
};
