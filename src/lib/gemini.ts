import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../data/constants";

const GEMINI_MODEL = "gemini-2.0-flash";

function getApiKey(): string | null {
  const key = (process.env.API_KEY as string) || (process.env.GEMINI_API_KEY as string);
  if (!key || key.trim() === "" || key === "your_gemini_api_key_here") return null;
  return key.trim();
}

export function isGeminiConfigured(): boolean {
  return getApiKey() !== null;
}

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chatSession: Chat | null = null;

  private getAiInstance(): GoogleGenAI {
    const key = getApiKey();
    if (!key) throw new Error("MISSING_API_KEY");
    return new GoogleGenAI({ apiKey: key });
  }

  private initChat() {
    this.ai = this.getAiInstance();
    this.chatSession = this.ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }

  private ensureChat() {
    if (!this.chatSession) this.initChat();
  }

  resetSession() {
    this.chatSession = null;
    this.ai = null;
  }

  async sendMessage(message: string): Promise<string> {
    if (!isGeminiConfigured()) {
      return "⚠️ AI is offline — no Gemini API key configured. Add GEMINI_API_KEY to your .env.local and restart the dev server.";
    }
    try {
      this.ensureChat();
      const response = await this.chatSession!.sendMessage({ message });
      return response.text || "I'm sorry, I couldn't process that.";
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const msg = String(error?.message || error);
      if (msg.includes("API_KEY_INVALID") || msg.includes("API key") || msg.includes("MISSING_API_KEY")) {
        this.resetSession();
        return "🔑 Invalid Gemini API key. Please check your GEMINI_API_KEY in .env.local and restart the server.";
      }
      if (msg.includes("quota") || msg.includes("rate")) {
        return "⏳ Rate limit reached — please try again in a moment.";
      }
      this.resetSession();
      return "There was an error communicating with the AI. Please try again.";
    }
  }

  async *sendMessageStream(message: string) {
    if (!isGeminiConfigured()) {
      yield "⚠️ AI is offline — no Gemini API key configured. Create a .env.local file with GEMINI_API_KEY and restart.";
      return;
    }
    try {
      this.ensureChat();
      const response = await this.chatSession!.sendMessageStream({ message });
      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        if (c.text) yield c.text;
      }
    } catch (error: any) {
      console.error("Streaming Error:", error);
      const msg = String(error?.message || error);
      if (msg.includes("MISSING_API_KEY") || msg.includes("API_KEY_INVALID") || msg.includes("API key")) {
        this.resetSession();
        yield "🔑 Invalid or missing Gemini API key. Check .env.local → GEMINI_API_KEY.";
        return;
      }
      if (msg.includes("quota") || msg.includes("429")) {
        yield "⏳ Quota exceeded — please wait and try again.";
        return;
      }
      this.resetSession();
      yield "Error connecting to AI. Please try again.";
    }
  }
}

export const geminiService = new GeminiService();
