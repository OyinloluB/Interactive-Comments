import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

// zod schema for validation
const commentSchema = z.object({
  user: z.string().min(1, "User is required"),
  text: z.string().min(1, "Comment text is required"),
  parentId: z.number().optional(),
});

// add a new comment
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = commentSchema.parse(req.body);

    const newComment = await prisma.comment.create({
      data: validatedData,
    });

    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get a comment
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        parentId: null,
      },
      include: {
        replies: {
          include: {
            replies: true,
          },
        },
      },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// edit a comment
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = Number(req.params.id);

    // check if the comment has replies
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { replies: true },
    });

    if (!existingComment) {
      res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment && existingComment.replies.length > 0) {
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
