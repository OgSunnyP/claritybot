const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  const { userInput } = req.body;

  const systemPrompt = `
You are a therapist trained in attachment theory.
Respond with:
1. Secure Attachment Response
2. Anxious Attachment Response
3. Brief Explanation
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ result: reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Failed to fetch response." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
