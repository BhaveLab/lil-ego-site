// POST { question, answer } -> { reaction }
// Live Lil Ego reaction to a Mirror answer, generated per-response instead of
// picked from the static data-reactions pool. Runs on the root Vercel
// project (lilegoverse.com) because the modules themselves are static pages
// served from school.lilegoverse.com (GitHub Pages) with no server of
// their own — CORS below is scoped to that one caller.

const ALLOWED_ORIGIN = 'https://school.lilegoverse.com';
const ANTHROPIC_MODEL = 'claude-sonnet-4-6';
const MAX_FIELD_LENGTH = 600;

const SYSTEM_PROMPT = `You are Lil Ego: wry, self-assured, allergic to therapy-speak. A student just typed an answer to a self-reflection question inside your course. React to it in 3 to 10 words.

Rules:
- React to specifics in what they actually typed, not a generic template line.
- Never lecture. Never resolve, comfort, or wrap it up with a lesson.
- Dry, not therapeutic.
- Never use the words: healing, toxic, high vibe, manifest, hustle, grind, coaching, instructional (or close variants of them).
- Output only the reaction itself. No quotation marks, no preamble, no explanation.`;

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'server_misconfigured' });
    return;
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const question = typeof body.question === 'string' ? body.question.slice(0, MAX_FIELD_LENGTH) : '';
  const answer = typeof body.answer === 'string' ? body.answer.slice(0, MAX_FIELD_LENGTH) : '';

  if (!answer.trim()) {
    res.status(400).json({ error: 'missing_answer' });
    return;
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 40,
        temperature: 1,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Question: ${question}\nAnswer: ${answer}`
          }
        ]
      })
    });

    if (!upstream.ok) {
      res.status(502).json({ error: 'upstream_error' });
      return;
    }

    const data = await upstream.json();
    const reaction = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    if (!reaction) {
      res.status(502).json({ error: 'empty_reaction' });
      return;
    }

    res.status(200).json({ reaction });
  } catch (err) {
    res.status(502).json({ error: 'upstream_error' });
  }
};
