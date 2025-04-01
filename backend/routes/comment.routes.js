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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const sentimentAnalysis_1 = require("../utils/sentimentAnalysis");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// zod schema for validation
const commentSchema = zod_1.z.object({
    user: zod_1.z.string().min(1, "User is required"),
    text: zod_1.z.string().min(1, "Comment text is required"),
    parentId: zod_1.z.number().nullable(),
});
// set a toxicity threshold ( block comments above 0.8 toxicity)
const TOXICITY_THRESHOLD = 0.8;
// add a new comment with sentiment analysis
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = commentSchema.parse(req.body);
        // analyze the comment text
        const toxicityScore = yield (0, sentimentAnalysis_1.analyzeComment)(validatedData.text);
        if (toxicityScore > TOXICITY_THRESHOLD) {
            return res.status(400).json({
                error: "Your comment was flagged as potentially harmful. Please revise it.",
            });
        }
        // if not toxic, save the comment
        const newComment = yield prisma.comment.create({
            data: validatedData,
        });
        return res.status(201).json(newComment);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}));
// get a comment
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield prisma.comment.findMany({
            orderBy: { createdAt: "asc" },
        });
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// upvote a comment
router.patch("/:id/upvote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = Number(req.params.id);
    try {
        const updatedComment = yield prisma.comment.update({
            where: { id: commentId },
            data: { votes: { increment: 1 } },
        });
        res.json(updatedComment);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to upvote the comment." });
    }
}));
// downvote a comment
router.patch("/:id/downvote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = Number(req.params.id);
    try {
        const comment = yield prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found." });
        }
        const updatedVotes = Math.max(comment.votes - 1, 0);
        const updatedComment = yield prisma.comment.update({
            where: { id: commentId },
            data: { votes: updatedVotes },
        });
        res.json(updatedComment);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to downvote the comment." });
    }
}));
// edit a comment
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = Number(req.params.id);
        // check if the comment has replies
        const existingComment = yield prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment) {
            res.status(404).json({ error: "Comment not found" });
        }
        const hasReplies = yield prisma.comment.findFirst({
            where: { parentId: commentId },
        });
        if (hasReplies) {
            res
                .status(400)
                .json({ error: "You cannot edit a comment that has replies" });
        }
        // validate only the `text` field
        const validatedData = zod_1.z
            .object({
            text: zod_1.z.string().min(1, "Comment text is required"),
        })
            .parse(req.body);
        const toxicityScore = yield (0, sentimentAnalysis_1.analyzeComment)(validatedData.text);
        if (toxicityScore > TOXICITY_THRESHOLD) {
            return res.status(400).json({
                error: "Your comment was flagged as potentially harmful. Please revise it.",
            });
        }
        const updatedComment = yield prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                text: validatedData.text,
            },
        });
        res.status(200).json(updatedComment);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.errors });
        }
        else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}));
// delete a comment
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = Number(req.params.id);
        const existingComment = yield prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });
        if (!existingComment) {
            res.status(404).json({ error: "Comment not found" });
        }
        yield prisma.comment.delete({
            where: {
                id: commentId,
            },
        });
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
