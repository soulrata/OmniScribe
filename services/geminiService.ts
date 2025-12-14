import { GoogleGenAI } from "@google/genai";
import { TRANSCRIPTION_MODEL, SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async transcribeAudio(
    base64Data: string,
    mimeType: string,
    onProgress: (stage: string) => void
  ): Promise<string> {
    try {
      onProgress('Initializing Model...');
      
      // We use generateContent. For strictly audio files, Gemini 1.5 Flash
      // can handle very large contexts without manual chunking.
      
      onProgress('Uploading to Gemini...');
      
      const response = await this.ai.models.generateContent({
        model: TRANSCRIPTION_MODEL,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: "Please transcribe this audio file accurately with timestamps and speaker labels."
            }
          ]
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2, // Low temperature for factual accuracy
        }
      });

      onProgress('Finalizing...');
      
      if (response.text) {
        return response.text;
      } else {
        throw new Error("No transcription generated.");
      }
    } catch (error: any) {
      console.error("Gemini Transcription Error:", error);
      throw new Error(error.message || "Failed to transcribe audio.");
    }
  }
}