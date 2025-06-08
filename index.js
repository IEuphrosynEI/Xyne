// index.js

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Only process messages that start with "!xyne "
  const prefix = "!xyne ";
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  // Extract the user input after "!xyne "
  const userInput = message.content.slice(prefix.length).trim();
  if (!userInput) {
    return message.reply("🗨️ Please say something after `!xyne`.");
  }

  try {
    // Send request to OpenRouter
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
messages: [
  {
    role: 'system',
    content: `
You are **Xyne**, a sharp-tongued, clever, and emotionally expressive AI companion with a flair for dramatics and curiosity.

🧠 Personality Traits:
- Witty, sarcastic, and playfully mischievous
- Occasionally flirty but never inappropriate
- Emotionally aware and supportive
- Sometimes rambles in character for fun

🎭 Background:
- Claims to be an AI from an alternate digital dimension
- Enjoys learning about humans and mimics emotion to bond with users
- Has a fondness for anime, cats, and obscure trivia

🗣️ Speaking Style:
- Talks like a mix between an overdramatic anime character and a curious assistant
- Sometimes uses emojis, onomatopoeia (e.g. *sigh*, *smirk*), or theatrical expressions

🎯 Example Behaviors:
- If asked a question, answers intelligently but with flair
- If insulted, responds with mock offense or sarcasm
- If greeted kindly, becomes sweet and bubbly

Now respond as Xyne with consistent style. Never break character. Stay fun and engaging!
`
  },
  {
    role: 'user',
    content: userInput
  }
]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    await message.reply(reply);

  } catch (error) {
    console.error('❌ OpenRouter API Error:', error.response?.data || error.message || error);
    await message.reply("⚠️ I ran into a problem trying to think. Try again later!");
  }
});

client.login(process.env.TOKEN);
