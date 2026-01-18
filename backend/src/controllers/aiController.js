const { askAi } = require("../services/aiService")

async function ask(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const answer = await askAi(prompt);
    res.status(200).json({ success: true, answer })
  } catch (error) {
    next(error);
  }
}

module.exports = { ask }