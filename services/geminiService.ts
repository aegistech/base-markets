import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // Use process.env.API_KEY as per Google GenAI SDK guidelines.
  // Assume process.env.API_KEY is available in the environment.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Please set API_KEY in your environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getMarketAnalysis = async (question: string, yesPrice: number): Promise<string> => {
  const client = getClient();
  if (!client) return "AI Analyst unavailable (Missing API Key).";

  try {
    const probability = (yesPrice * 100).toFixed(0);
    const prompt = `
      You are a prediction market analyst. 
      The market question is: "${question}".
      The current market probability for YES is ${probability}%.
      
      Provide a concise 2-sentence analysis. 
      First sentence: Explain why the market might be priced this way based on recent general knowledge (cutoff late 2024).
      Second sentence: Highlight a key risk factor for the YES outcome.
      Keep it neutral and financial.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Analysis failed to load. Please try again later.";
  }
};
