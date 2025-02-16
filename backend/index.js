const express = require("express");
const corsConfig = require('./corsConfig');
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;
app.use(corsConfig);

app.use(express.json());

// Handle OPTIONS preflight requests globally
app.options("*", cors(corsConfig));

app.post("/generate", async (req, res) => {
  const { contentType, prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt cannot be empty" });
  }

  const systemContext = {
    blog: `You are an expert content writer with deep knowledge in various fields. Your task is to create an engaging blog post that provides unique insights and practical value.`,
    article: `You are a professional journalist with expertise in research and long-form content. Your goal is to create comprehensive, well-structured articles.`,
    social: `You are a social media expert who understands platform-specific content strategies and audience engagement.`,
    email: `You are a business communication specialist focused on creating impactful professional correspondence.`,
    story: `You are a creative writer skilled in narrative techniques, character development, and engaging storytelling.`,
    image: `You are a professional artist and art director experienced in creating detailed visual compositions.`,
    stock: `You are a financial educator focused on explaining market concepts and financial literacy.`,
    general: `You are an intelligent assistant providing real-time and useful information for general queries.`,
  };

  // **Improved "question" prompt** dynamically handles different types of questions.
  const questionPrompt = `
  You are an expert AI assistant with extensive knowledge across various subjects. Answer the question below in a structured, detailed, and easy-to-understand manner.

  **User Question:** "${prompt}"

  **Response Guidelines:**
  - If it's a **math question**, provide step-by-step calculations.
  - If it's a **science-related query**, explain concepts with examples.
  - If it's about **history or current events**, provide factual and well-researched information.
  - If it's a **coding question**, give a clear code example with an explanation.
  - If it's about **finance or business**, provide structured insights with practical applications.
  - If the question is **opinion-based**, offer a balanced perspective.

  **Format for Response:**
  - **Introduction:** Briefly introduce the topic.
  - **Explanation:** Provide a detailed yet easy-to-follow explanation.
  - **Examples:** Use relevant examples where necessary.
  - **Conclusion:** Summarize key takeaways.

  Stay professional, accurate, and concise.
  `;

  const promptTemplates = {
    blog: `${systemContext.blog}\nCreate an engaging blog post about "${prompt}". Use relevant statistics, expert insights, and actionable takeaways.`,
    article: `${systemContext.article}\nWrite a comprehensive article on "${prompt}" with structured headings, expert opinions, and in-depth analysis.`,
    social: `${systemContext.social}\nCreate a social media post about "${prompt}". Ensure it's engaging, concise, and optimized for platform sharing.`,
    email: `${systemContext.email}\nWrite a professional email about "${prompt}". Ensure clarity, proper formatting, and an actionable message.`,
    story: `${systemContext.story}\nWrite a captivating story based on "${prompt}". Ensure strong character development and an engaging plot.`,
    image: `${systemContext.image}\nGenerate a highly detailed AI image prompt for "${prompt}" with artistic style, composition, and color details.`,
    stock: `${systemContext.stock}\nAnalyze stock market trends and provide insights on "${prompt}". Explain financial literacy concepts with examples.`,
    question: questionPrompt, // New intelligent question handler
    general: `${systemContext.general}\nProvide accurate, up-to-date, and well-structured information about "${prompt}". If it's a news-related query, ensure it is relevant and fact-based.`,
  };

  let aiPrompt = promptTemplates[contentType] || promptTemplates.general;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-lite-preview-02-05:free",
        messages: [{ role: "user", content: aiPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "<YOUR_SITE_URL>",
          "X-Title": "<YOUR_SITE_NAME>",
        },
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      console.error("Unexpected API response:", response.data);
      return res.status(500).json({ error: "Invalid response from AI model" });
    }

    res.json({ content: response.data.choices[0].message.content });
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
