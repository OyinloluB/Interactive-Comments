import { google } from "googleapis";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY as string;
const DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

if (!PERSPECTIVE_API_KEY) {
  throw new Error("PERSPECTIVE_API_KEY is missing in environment variables.");
}

/**
 * initializes Google Perspective API client
 */
const initClient = async () => {
  try {
    return google.discoverAPI(DISCOVERY_URL);
  } catch (error) {
    console.error("Failed to initialize Perspective API client:", error);
    throw new Error("Perspective API initialization failed.");
  }
};

/**
 * analyzes a comment's sentiment using Perspective API.
 * @param {string} commentText - The comment text to analyze.
 * @returns {Promise<number>} - Returns toxicity score (0 to 1).
 */
export const analyzeComment = async (commentText: string): Promise<number> => {
  try {
    const client: any = await initClient();

    const analyzeRequest = {
      comment: { text: commentText },
      requestedAttributes: { TOXICITY: {} },
      languages: ["en"],
    };

    // call Perspective API
    const response = await client.comments.analyze({
      key: PERSPECTIVE_API_KEY,
      resource: analyzeRequest,
    });

    return response.data.attributeScores.TOXICITY.summaryScore.value;
  } catch (error) {
    console.error("Error analyzing comment sentiment:", error);
    throw new Error("Sentiment analysis failed.");
  }
};
