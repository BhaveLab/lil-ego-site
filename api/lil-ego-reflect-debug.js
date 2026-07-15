// TEMPORARY DIAGNOSTIC ROUTE — delete once /api/lil-ego-reflect is confirmed working.
// GET (or any method). Never returns the API key itself — only whether it's
// present and how long it is. Makes one real, minimal test call to Anthropic
// with the exact model /api/lil-ego-reflect uses, and returns the raw
// upstream status/body, so a failure's exact cause (missing key, invalid
// model, quota, etc.) is visible without needing direct curl access to this
// deployment.

const ANTHROPIC_MODEL = 'claude-sonnet-5';

module.exports = async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const diagnostics = {
    anthropicApiKeyPresent: Boolean(apiKey),
    anthropicApiKeyLength: apiKey ? apiKey.length : 0,
    model: ANTHROPIC_MODEL
  };

  if (!apiKey) {
    res.status(200).json({
      diagnostics,
      upstream: null,
      note: 'ANTHROPIC_API_KEY is not set in this deployment\'s environment.'
    });
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
        max_tokens: 20,
        messages: [{ role: 'user', content: 'Reply with exactly: diagnostic-ok' }]
      })
    });

    const bodyText = await upstream.text();
    let bodyParsed;
    try {
      bodyParsed = JSON.parse(bodyText);
    } catch (e) {
      bodyParsed = bodyText;
    }

    res.status(200).json({
      diagnostics,
      upstreamStatus: upstream.status,
      upstreamOk: upstream.ok,
      upstreamBody: bodyParsed
    });
  } catch (err) {
    res.status(200).json({
      diagnostics,
      note: 'fetch to api.anthropic.com threw before getting a response',
      errorMessage: err.message
    });
  }
};
