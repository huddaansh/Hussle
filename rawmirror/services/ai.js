export const AI_PROVIDERS = {
  groq: { name: 'Groq (Free)', model: 'llama-3.3-70b-versatile', url: 'https://api.groq.com/openai/v1/chat/completions' },
  claude: { name: 'Claude', model: 'claude-sonnet-4-6', url: 'https://api.anthropic.com/v1/messages' },
  chatgpt: { name: 'ChatGPT', model: 'gpt-4o', url: 'https://api.openai.com/v1/chat/completions' },
  gemini: { name: 'Gemini', model: 'gemini-2.0-flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent' },
};

export const callAI = async (entry, pastEntries, screenTime, intention, settings) => {
  const provider = settings?.aiProvider || 'groq';
  const apiKey = settings?.apiKeys?.[provider];
  if (!apiKey) return null;

  const history = pastEntries.slice(-7).map(e =>
    `Date: ${e.date} | Score: ${e.score}/10 | Mood: ${e.mood || 'N/A'} | Entry: ${e.text?.substring(0, 200)}...`
  ).join('\n');

  const prompt = `You are a brutally honest personal accountability mentor. You do NOT motivate falsely. You do NOT sugarcoat. You call out failures directly. You remind people of their past promises. You make them feel the weight of wasted days. Truth only.

PAST 7 DAYS:
${history || 'No history yet.'}

${intention ? `YESTERDAY'S INTENTION: "${intention}"` : ''}

TODAY'S ENTRY:
${entry}

${screenTime ? `SCREEN TIME DATA PROVIDED:\n${screenTime}` : ''}

Respond in this EXACT JSON format (no markdown, no backticks, no extra text):
{
  "evaluation": "Your brutally honest evaluation of today (3-5 sentences). Call out failures. Compare to past. Reference broken intentions if any.",
  "wins": ["specific win 1", "specific win 2"],
  "misses": ["specific failure 1", "specific failure 2"],
  "bsCheck": "One cross-question to verify a claim they made OR VERIFIED if entry seems detailed and honest",
  "wordOfDay": "ONE word that defines this day",
  "honestyRating": 7,
  "tomorrowChallenge": "One specific thing they MUST do tomorrow - no excuses"
}`;

  try {
    let response, data, text;

    if (provider === 'groq' || provider === 'chatgpt') {
      const url = AI_PROVIDERS[provider].url;
      const model = AI_PROVIDERS[provider].model;
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.7 })
      });
      data = await response.json();
      text = data.choices?.[0]?.message?.content;
    } else if (provider === 'claude') {
      response = await fetch(AI_PROVIDERS.claude.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: AI_PROVIDERS.claude.model, max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
      });
      data = await response.json();
      text = data.content?.[0]?.text;
    } else if (provider === 'gemini') {
      response = await fetch(`${AI_PROVIDERS.gemini.url}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      data = await response.json();
      text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!text) {
      console.error('NO TEXT FROM AI. Response:', JSON.stringify(data));
      return null;
    }
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error('AI CALL FAILED:', e.message);
    return null;
  }
};
