import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);

export interface SymptomAnalysisInput {
  symptoms: string;
  photoDataUri?: string;
}

export interface SymptomAnalysisOutput {
  isSerious: boolean;
  explanation: string;
  suggestImmediateAction: boolean;
}

export async function analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> {
  // Use Gemini 2.5 Flash which is the latest model optimized for performance and cost
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    }
  });

  const prompt = `As a medical expert, analyze these symptoms concisely and determine if they indicate a potentially serious condition requiring immediate attention.

Symptoms: ${input.symptoms}

First, determine:
1. If the condition is potentially serious (true/false)
2. If immediate medical attention is recommended (true/false)

Then, provide a brief explanation in this format:

# Likely Cause
[One clear sentence about the most likely cause]

# What You Should Do
- [One specific action recommendation]
- [Any immediate steps to take at home, if applicable]

# When to Seek Help
- [1-2 specific warning signs that would require medical attention]

Keep the explanation very concise and action-oriented. Use simple, clear language.

Your response should be split into two parts:
1. A JSON object with just the boolean flags:
{
  "isSerious": boolean,
  "suggestImmediateAction": boolean
}

2. The markdown formatted explanation as plain text.

Separate these with three dashes (---) on a new line.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Split the response into JSON and markdown parts
    const [jsonPart, markdownPart] = text.split('---').map(part => part.trim());
    const { isSerious, suggestImmediateAction } = JSON.parse(jsonPart);
    
    return {
      isSerious,
      explanation: markdownPart,
      suggestImmediateAction
    };
  } catch (e) {
    // Fallback parsing if the format is not as expected
    const isSerious = text.toLowerCase().includes('serious') || text.toLowerCase().includes('severe');
    const suggestImmediateAction = text.toLowerCase().includes('immediate') || text.toLowerCase().includes('emergency');
    
    return {
      isSerious,
      explanation: text,
      suggestImmediateAction
    };
  }
} 