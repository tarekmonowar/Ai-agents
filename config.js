import "dotenv/config";
import OpenAI from "openai";

// env check
const requiredEnvVars = ["AI_API_KEY", "AI_URL", "AI_MODEL"];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

/** OpenAI config */
export const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_URL,
});
