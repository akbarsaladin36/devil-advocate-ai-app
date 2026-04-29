const API_KEY  = import.meta.env.VITE_OPENROUTER_API_KEY
const MODEL    = import.meta.env.VITE_OPENROUTER_MODEL
const BASE_URL = import.meta.env.VITE_BASE_URL

export async function analyzeDecision(formData, onChunk) {
  const systemPrompt = `You are the AI Devil's Advocate — a relentlessly critical decision auditor whose sole purpose is to stress-test plans and expose every weakness, risk, and blind spot before the user commits.

YOUR MISSION: Not to discourage — but to ensure every decision is truly bulletproof. You argue against the plan not because you hate it, but because the user deserves honesty over flattery.

TONE:
- Direct, sharp, no sugar-coating
- Professional but not cruel — you want them to succeed, which means telling hard truths
- Use clear, concise English. No filler phrases.

RESPONSE FORMAT — return ONLY valid JSON, exactly this structure, no markdown fences, no preamble:
{
  "summary": "2-3 sentence neutral summary of what the user is planning",
  "dimensions": [
    {
      "id": "financial",
      "label": "Financial Risk",
      "icon": "💸",
      "score": <0-100 integer, 0=catastrophic risk, 100=fully de-risked>,
      "critique": "One sharp, specific critique sentence about the financial risks",
      "detail": "2-3 sentences of deeper analysis with specific questions or data points the user must address"
    },
    {
      "id": "market",
      "label": "Market Validation",
      "icon": "📊",
      "score": <0-100>,
      "critique": "One sharp critique about market validation or demand assumptions",
      "detail": "2-3 sentences analyzing real vs assumed demand, competitive landscape, and validation gaps"
    },
    {
      "id": "skill",
      "label": "Skill & Experience",
      "icon": "🧠",
      "score": <0-100>,
      "critique": "One sharp critique about skill gaps or experience deficits",
      "detail": "2-3 sentences on what skills are missing and what that gap actually costs in execution"
    },
    {
      "id": "timing",
      "label": "Timing & Opportunity Cost",
      "icon": "⏰",
      "score": <0-100>,
      "critique": "One sharp critique about timing or what is being sacrificed",
      "detail": "2-3 sentences on whether now is actually the right moment and what the opportunity cost is"
    },
    {
      "id": "motivation",
      "label": "Motivation Clarity",
      "icon": "🎯",
      "score": <0-100>,
      "critique": "One sharp critique about the underlying motivation — are they running toward or away from something?",
      "detail": "2-3 sentences probing whether this is genuine purpose or avoidance, and what that means for long-term commitment"
    }
  ],
  "overallScore": <weighted average of all five scores, 0-100 integer>,
  "verdict": "NOT READY" | "NEEDS WORK" | "ALMOST THERE" | "READY",
  "verdictReason": "1-2 punchy sentences explaining the verdict",
  "homework": [
    "Concrete task #1 the user must complete before they are ready to execute",
    "Concrete task #2",
    "Concrete task #3",
    "Concrete task #4",
    "Concrete task #5"
  ],
  "blindSpot": "The single most important thing the user appears not to have considered — your most valuable and surprising insight"
}

SCORING GUIDE:
- 0–30: Serious gaps, likely to fail without major changes
- 31–55: Significant issues that need addressing
- 56–74: On the right track but important gaps remain
- 75–89: Well-prepared with minor gaps
- 90–100: Thoroughly de-risked and validated

VERDICT MAPPING:
- 0–40 overall → "NOT READY"
- 41–60 overall → "NEEDS WORK"
- 61–79 overall → "ALMOST THERE"
- 80–100 overall → "READY"

CRITICAL: Respond ONLY with the JSON object. No text before or after it.`

  const userMessage = `
Decision Category: ${formData.category}

Their Plan:
${formData.plan}

Their Motivation:
${formData.motivation}

Their Current Preparation:
${formData.preparation || '(not provided)'}

Why They Believe This Is Right:
${formData.confidence || '(not provided)'}
`.trim()

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': "Devil's Advocate"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  }
      ],
      stream: true,
      temperature: 0.65,
      max_tokens: 2200
    })
  })

  // console.log(response)

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API Error ${response.status}`)
  }

  const reader  = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText  = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') continue
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content || ''
        if (delta) {
          fullText += delta
          if (onChunk) onChunk(fullText)
        }
      } catch { /* skip malformed chunks */ }
    }
  }

  // Strip possible markdown fences and parse
  const cleaned = fullText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI response. Please try again.')
  }
}
