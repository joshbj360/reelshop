// POST /api/ai/generate-listing
// Accepts a base64 product image and returns AI-generated listing data + social captions

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.anthropicApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'AI service not configured',
    })
  }

  const body = await readBody(event)
  const { imageBase64, mimeType, optionalHint } = body

  if (!imageBase64 || !mimeType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'imageBase64 and mimeType are required',
    })
  }

  const systemPrompt = `You are an expert e-commerce copywriter and social media strategist for an African fashion & lifestyle marketplace.
Your job is to analyze a product image and generate compelling, platform-optimized listing content.
Always respond with a valid JSON object only — no markdown, no explanation, just raw JSON.`

  const userPrompt = `Analyze this product image and generate a complete listing package.${optionalHint ? ` Context: ${optionalHint}` : ''}

Return ONLY this JSON structure:
{
  "title": "SEO-optimized product title (5-10 words, no brand names)",
  "description": "Detailed product description for marketplace listing (80-150 words). Mention material, style, occasion, and key features.",
  "suggestedPrice": <number in USD, realistic retail price>,
  "socialCaptions": {
    "instagram": "Visual, energetic Instagram caption. Use 5-8 emojis throughout. Include a strong hook in line 1. End with 20-25 trending hashtags on a new line. Max 300 words.",
    "facebook": "Conversational Facebook post. Lead with a question or bold statement. Mention the price (use ₦ and say 'DM to order'). Include a 'Shop Now' call-to-action. 2-3 short paragraphs. No hashtags.",
    "pinterest": "Keyword-rich Pinterest pin description. No emojis. Focus on search terms like style aesthetics, occasions, materials, and trends. 2-3 sentences. End with 5-8 keyword phrases separated by commas."
  }
}`

  try {
    const response: any = await $fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: {
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mimeType,
                    data: imageBase64,
                  },
                },
                { type: 'text', text: userPrompt },
              ],
            },
          ],
        },
      },
    )

    const rawText: string = response.content?.[0]?.text || ''

    // Strip any accidental markdown code fences
    const jsonText = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
    const data = JSON.parse(jsonText)

    return { success: true, data }
  } catch (err: any) {
    console.error('[POST /api/ai/generate-listing]', err?.message || err)
    throw createError({
      statusCode: 500,
      statusMessage: 'AI generation failed',
    })
  }
})
