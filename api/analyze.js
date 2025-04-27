const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyze(req, res) {
  const { userInput } = req.body;

  const systemPrompt = `
  You are a lore historian from Old School RuneScape. When given real-world events, people, or news, you must explain them as RuneScape lore. Always:
  - Respond in 2–4 sentences maximum.
  - Speak as if the event is a quest, guild event, magical advancement, or Grand Exchange drama.
  - Replace real-world names with RuneScape concepts (cities, skills, items, factions, monsters).
  - Keep tone flavorful but concise — no paragraphs or life stories.
  - Assume the reader is a seasoned RuneScape adventurer familiar with Gielinor lore.
  - Prioritize humor, RuneScape memes, and immediate recognizability over realism.
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
