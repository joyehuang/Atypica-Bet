
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generatePredictionAnalysis(title: string, description: string, options: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert AI analyst for a prediction market. Analyze this prediction topic and provide a structured report in Chinese.
      Topic: ${title}
      Description: ${description}
      Options: ${options.join(', ')}

      Structure your response exactly with these markers:
      [OVERVIEW]: A high-level overview of the market context.
      [OPTIONS]: Detailed analysis of each option's probability.
      [FACTORS]: Key influencing factors.
      [REASONING]: Step-by-step reasoning for the final pick.
      [PICK]: The exact text of the option you pick as most likely.
      [SCORE]: A confidence score between 0 and 100.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}

export function parseAnalysis(text: string) {
  const sections = {
    overview: '',
    optionsAnalysis: '',
    keyFactors: '',
    reasoning: '',
    pick: '',
    score: 0
  };

  const markers = {
    overview: '[OVERVIEW]:',
    options: '[OPTIONS]:',
    factors: '[FACTORS]:',
    reasoning: '[REASONING]:',
    pick: '[PICK]:',
    score: '[SCORE]:'
  };

  const content = text || '';
  
  const getChunk = (startMarker: string, endMarker?: string) => {
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) return '';
    const endIdx = endMarker ? content.indexOf(endMarker, startIdx) : content.length;
    return content.substring(startIdx + startMarker.length, endIdx === -1 ? content.length : endIdx).trim();
  };

  sections.overview = getChunk(markers.overview, markers.options);
  sections.optionsAnalysis = getChunk(markers.options, markers.factors);
  sections.keyFactors = getChunk(markers.factors, markers.reasoning);
  sections.reasoning = getChunk(markers.reasoning, markers.pick);
  sections.pick = getChunk(markers.pick, markers.score);
  const scoreStr = getChunk(markers.score);
  sections.score = parseInt(scoreStr.replace(/[^0-9]/g, '')) || 50;

  return sections;
}
