import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating content:', error)
    throw new Error('Failed to generate AI content')
  }
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/```\n?([\s\S]*?)\n?```/)
    const jsonText = jsonMatch ? jsonMatch[1] : text
    
    return JSON.parse(jsonText.trim())
  } catch (error) {
    console.error('Error generating JSON:', error)
    throw new Error('Failed to generate AI JSON content')
  }
}
