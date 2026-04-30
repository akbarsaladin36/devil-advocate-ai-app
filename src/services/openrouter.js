const API_KEY  = import.meta.env.VITE_OPENROUTER_API_KEY
const MODEL    = import.meta.env.VITE_OPENROUTER_MODEL
const BASE_URL = import.meta.env.VITE_BASE_URL

// ─── Word-to-number map for repair ────────────────────────────────────────────
const WORD_TO_NUM = {
  zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
  eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,
  eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,
  seventy:70,eighty:80,ninety:90,hundred:100,
  'twenty-one':21,'twenty-two':22,'twenty-three':23,'twenty-four':24,'twenty-five':25,
  'twenty-six':26,'twenty-seven':27,'twenty-eight':28,'twenty-nine':29,
  'thirty-one':31,'thirty-two':32,'thirty-three':33,'thirty-four':34,'thirty-five':35,
  'thirty-six':36,'thirty-seven':37,'thirty-eight':38,'thirty-nine':39,
  'forty-one':41,'forty-two':42,'forty-three':43,'forty-four':44,'forty-five':45,
  'forty-six':46,'forty-seven':47,'forty-eight':48,'forty-nine':49,
  'fifty-one':51,'fifty-two':52,'fifty-three':53,'fifty-four':54,'fifty-five':55,
  'fifty-six':56,'fifty-seven':57,'fifty-eight':58,'fifty-nine':59,
  'sixty-one':61,'sixty-two':62,'sixty-three':63,'sixty-four':64,'sixty-five':65,
  'sixty-six':66,'sixty-seven':67,'sixty-eight':68,'sixty-nine':69,
  'seventy-one':71,'seventy-two':72,'seventy-three':73,'seventy-four':74,'seventy-five':75,
  'seventy-six':76,'seventy-seven':77,'seventy-eight':78,'seventy-nine':79,
  'eighty-one':81,'eighty-two':82,'eighty-three':83,'eighty-four':84,'eighty-five':85,
  'eighty-six':86,'eighty-seven':87,'eighty-eight':88,'eighty-nine':89,
  'ninety-one':91,'ninety-two':92,'ninety-three':93,'ninety-four':94,'ninety-five':95,
  'ninety-six':96,'ninety-seven':97,'ninety-eight':98,'ninety-nine':99,
}

// ─── Repair common AI JSON mistakes ───────────────────────────────────────────
function repairJSON(raw) {
  let text = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  // 1. Replace word-scores: "score": thirty  →  "score": 30
  //    Also handles hyphenated: "score": forty-five  →  "score": 45
  text = text.replace(
    /("(?:score|overallScore)"\s*:\s*)([\w-]+)/gi,
    (match, key, val) => {
      const lower = val.toLowerCase()
      if (WORD_TO_NUM[lower] !== undefined) return `${key}${WORD_TO_NUM[lower]}`
      // already a number string → keep
      if (/^\d+$/.test(val)) return match
      // fallback: replace unknown word with 50
      return `${key}50`
    }
  )

  // 2. Replace range scores: "score": "30-40"  →  "score": 35
  text = text.replace(
    /("(?:score|overallScore)"\s*:\s*)"(\d+)\s*[-–]\s*(\d+)"/gi,
    (_, key, a, b) => `${key}${Math.round((+a + +b) / 2)}`
  )

  // 3. Replace approximate scores: "score": ~50  →  "score": 50
  text = text.replace(
    /("(?:score|overallScore)"\s*:\s*)~\s*(\d+)/gi,
    (_, key, n) => `${key}${n}`
  )

  // 4. Replace scores in quotes: "score": "45"  →  "score": 45
  text = text.replace(
    /("(?:score|overallScore)"\s*:\s*)"(\d+)"/gi,
    (_, key, n) => `${key}${n}`
  )

  // 5. Fix trailing commas before } or ]
  text = text.replace(/,(\s*[}\]])/g, '$1')

  // 6. Fix unquoted verdict values
  const validVerdicts = ['NOT READY', 'NEEDS WORK', 'ALMOST THERE', 'READY']
  text = text.replace(
    /("verdict"\s*:\s*)([A-Z\s]+)(\s*[,\n}])/g,
    (match, key, val, end) => {
      const trimmed = val.trim()
      if (validVerdicts.includes(trimmed)) return `${key}"${trimmed}"${end}`
      return match
    }
  )

  return text
}

// ─── Derive verdict from overallScore if missing/wrong ────────────────────────
function normalizeResult(data) {
  // Ensure all scores are numbers
  if (Array.isArray(data.dimensions)) {
    data.dimensions = data.dimensions.map(d => ({
      ...d,
      score: Math.min(100, Math.max(0, Math.round(Number(d.score) || 50)))
    }))
    // Recalculate overallScore if it looks wrong
    const avg = Math.round(
      data.dimensions.reduce((s, d) => s + d.score, 0) / data.dimensions.length
    )
    data.overallScore = Math.min(100, Math.max(0, Math.round(Number(data.overallScore) || avg)))
  }

  // Enforce correct verdict based on score
  const s = data.overallScore
  const correct =
    s <= 40 ? 'NOT READY' :
    s <= 60 ? 'NEEDS WORK' :
    s <= 79 ? 'ALMOST THERE' : 'READY'

  if (!['NOT READY','NEEDS WORK','ALMOST THERE','READY'].includes(data.verdict)) {
    data.verdict = correct
  }

  return data
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function analyzeDecision(formData, onChunk) {
  const systemPrompt = `You are the AI Devil's Advocate — a relentlessly critical decision auditor whose sole purpose is to stress-test plans and expose every weakness, risk, and blind spot before the user commits.

YOUR MISSION: Not to discourage — but to ensure every decision is truly bulletproof.

TONE: Direct, sharp, no sugar-coating. Professional but not cruel. Clear, concise English only.

RESPONSE FORMAT — return ONLY a valid JSON object. No markdown fences. No explanation text before or after:
{
  "summary": "2-3 sentence neutral summary of what the user is planning",
  "dimensions": [
    {
      "id": "financial",
      "label": "Financial Risk",
      "icon": "💸",
      "score": 25,
      "critique": "One sharp specific critique about financial risks",
      "detail": "2-3 sentences of deeper analysis with specific questions the user must address"
    },
    {
      "id": "market",
      "label": "Market Validation",
      "icon": "📊",
      "score": 20,
      "critique": "One sharp critique about market validation or demand assumptions",
      "detail": "2-3 sentences analyzing real vs assumed demand and validation gaps"
    },
    {
      "id": "skill",
      "label": "Skill & Experience",
      "icon": "🧠",
      "score": 40,
      "critique": "One sharp critique about skill gaps or experience deficits",
      "detail": "2-3 sentences on what skills are missing and what that gap costs in execution"
    },
    {
      "id": "timing",
      "label": "Timing & Opportunity Cost",
      "icon": "⏰",
      "score": 35,
      "critique": "One sharp critique about timing or what is being sacrificed",
      "detail": "2-3 sentences on whether now is the right moment and what the opportunity cost is"
    },
    {
      "id": "motivation",
      "label": "Motivation Clarity",
      "icon": "🎯",
      "score": 50,
      "critique": "One sharp critique about the underlying motivation",
      "detail": "2-3 sentences probing whether this is genuine purpose or avoidance"
    }
  ],
  "overallScore": 34,
  "verdict": "NOT READY",
  "verdictReason": "1-2 punchy sentences explaining the verdict",
  "homework": [
    "Concrete specific task the user must complete before executing",
    "Second concrete task",
    "Third concrete task",
    "Fourth concrete task",
    "Fifth concrete task"
  ],
  "blindSpot": "The single most important thing the user has not considered — your most surprising and valuable insight"
}

CRITICAL SCORE RULES — READ CAREFULLY:
- Replace the example scores (25, 20, 40, 35, 50, 34) with your own honest assessment
- Every score MUST be a plain integer — digits only, no text
- CORRECT: 25, 40, 72, 88
- WRONG: "thirty", "forty-five", "~50", "30-40", "seventy"
- WRONG: writing the number as a word in any form

SCORING GUIDE:
- 0–30: Serious gaps, likely to fail
- 31–55: Significant issues to address
- 56–74: Right track but gaps remain
- 75–89: Well-prepared, minor gaps
- 90–100: Fully de-risked

VERDICT based on overallScore:
- 0–40   → "NOT READY"
- 41–60  → "NEEDS WORK"
- 61–79  → "ALMOST THERE"
- 80–100 → "READY"

OUTPUT: JSON object only. Nothing else.`

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
      temperature: 0.5,   // lower = more predictable JSON structure
      max_tokens: 2200
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API Error ${response.status}`)
  }

  // Stream accumulator
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
      } catch { /* skip malformed SSE chunks */ }
    }
  }

  // ── Parse with repair fallback ──────────────────────────────────────────────
  const repaired = repairJSON(fullText)

  let parsed
  try {
    parsed = JSON.parse(repaired)
  } catch {
    // Last resort: extract the outermost { ... } block and try again
    const match = repaired.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('AI returned an unreadable response. Please try again.')
    try {
      parsed = JSON.parse(match[0])
    } catch (e) {
      // Provide a cleaner error message
      throw new Error(`Could not parse AI response. Try again or switch to a different model. (${e.message})`)
    }
  }

  return normalizeResult(parsed)
}

