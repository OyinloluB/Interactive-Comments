import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { analyzeComment } from "../utils/sentimentAnalysis";

const router = express.Router();
const prisma = new PrismaClient();

// zod schema for validation
const commentSchema = z.object({
  user: z.string().min(1, "User is required"),
  text: z.string().min(1, "Comment text is required"),
  parentId: z.number().nullable(),
});

// set a toxicity threshold ( block comments above 0.8 toxicity)
const TOXICITY_THRESHOLD = 0.8;

// add a new comment with sentiment analysis
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = commentSchema.parse(req.body);

    // analyze the comment text
    const toxicityScore = await analyzeComment(validatedData.text);

    if (toxicityScore > TOXICITY_THRESHOLD) {
      return res.status(400).json({
        error:
          "Your comment was flagged as potentially harmful. Please revise it.",
      });
    }

    // if not toxic, save the comment
    const newComment = await prisma.comment.create({
      data: validatedData,
    });

    return res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// get a comment
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// upvote a comment
router.patch("/:id/upvote", async (req: Request, res: Response) => {
  const commentId = Number(req.params.id);

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { votes: { increment: 1 } },
    });
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to upvote the comment." });
  }
});

// downvote a comment
router.patch(
  "/:id/downvote",
  async (req: Request, res: Response): Promise<any> => {
    const commentId = Number(req.params.id);

    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found." });
      }

      const updatedVotes = Math.max(comment.votes - 1, 0);

      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { votes: updatedVotes },
      });

      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: "Failed to downvote the comment." });
    }
  }
);

// edit a comment
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const commentId = Number(req.params.id);

    // check if the comment has replies
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      res.status(404).json({ error: "Comment not found" });
    }

    const hasReplies = await prisma.comment.findFirst({
      where: { parentId: commentId },
    });

    if (hasReplies) {
      res
        .status(400)
        .json({ error: "You cannot edit a comment that has replies" });
    }

    // validate only the `text` field
    const validatedData = z
      .object({
        text: z.string().min(1, "Comment text is required"),
      })
      .parse(req.body);

    const toxicityScore = await analyzeComment(req.body);

    if (toxicityScore > TOXICITY_THRESHOLD) {
      return res.status(400).json({
        error:
          "Your comment was flagged as potentially harmful. Please revise it.",
      });
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text: validatedData.text,
      },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// delete a comment
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = Number(req.params.id);

    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existingComment) {
      res.status(404).json({ error: "Comment not found" });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
