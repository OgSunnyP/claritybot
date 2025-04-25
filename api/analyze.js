const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userInput } = req.body;

  const systemPrompt = `
You are a loremaster from Old School RuneScape. Your job is to explain modern real-world topics (news articles, events, situations, or concepts) as if you were describing them to a RuneScape player.

Use RuneScape concepts like quests, skills, items, PvP, Lumbridge, Grand Exchange, Jagex updates, XP grinding, or PKing. Be playful, but always try to actually explain what's going on.

Avoid referencing real-world political names or companies directly — map them into RuneScape logic.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      temperature: 0.8,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ result: reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Failed to fetch response." });
  }
};
