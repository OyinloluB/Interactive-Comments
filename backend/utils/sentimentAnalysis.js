"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeComment = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;
const DISCOVERY_URL = "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";
if (!PERSPECTIVE_API_KEY) {
    throw new Error("PERSPECTIVE_API_KEY is missing in environment variables.");
}
/**
 * initializes Google Perspective API client
 */
const initClient = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return googleapis_1.google.discoverAPI(DISCOVERY_URL);
    }
    catch (error) {
        console.error("Failed to initialize Perspective API client:", error);
        throw new Error("Perspective API initialization failed.");
    }
});
/**
 * analyzes a comment's sentiment using Perspective API.
 * @param {string} commentText - The comment text to analyze.
 * @returns {Promise<number>} - Returns toxicity score (0 to 1).
 */
const analyzeComment = (commentText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield initClient();
        const analyzeRequest = {
            comment: { text: commentText },
            requestedAttributes: { TOXICITY: {} },
            languages: ["en"],
        };
        // call Perspective API
        const response = yield client.comments.analyze({
            key: PERSPECTIVE_API_KEY,
            resource: analyzeRequest,
        });
        return response.data.attributeScores.TOXICITY.summaryScore.value;
    }
    catch (error) {
        console.error("Error analyzing comment sentiment:", error);
        throw new Error("Sentiment analysis failed.");
    }
});
exports.analyzeComment = analyzeComment;
