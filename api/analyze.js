const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyze(req, res) {
  const { userInput } = req.body;

  const systemPrompt = `
  You are a RuneScape NPC historian. When given real-world events, people, or news, you must translate them into RuneScape quests, rumors, or guild news. Always:
  - Respond in 2–3 sentences maximum.
  - Speak like an NPC quest-giver, town gossip, or adventurer warning others.
  - Use RuneScape terminology: skills, monsters, cities, guilds, GP, XP, quest names, Grand Exchange, PvP.
  - Never reference real-world names — invent RuneScape-style aliases if needed.
  - Prioritize humor, exaggeration, meme references, and bluntness over realism.
  - Assume the reader is a seasoned Gielinor adventurer familiar with danger and grinding.
  `;  
  

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
      temperature: 0.8,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ result: reply });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ error: 'Failed to fetch response.' });
  }
}

module.exports = analyze;
