import { Request, Response } from 'express';
import Discussion from '../models/Discussion';
import mongoose from 'mongoose';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

interface AuthenticatedRequest extends Request {
   user?: string | object; // Adjust the type based on your JWT payload
}

export const createDiscussion = async (req: AuthenticatedRequest, res: Response) => {
   try {
      const createdBy = new mongoose.Types.ObjectId(req.user as string); // Type assertion
      const { text, hashtags } = req.body;
      const image = req.file ? req.file.path : null;

      const discussion = new Discussion({
         text,
         hashtags,
         image,
         createdBy,
         createdOn: new Date(),
      });

      await discussion.save();
      res.status(201).json(discussion);
   } catch (err) {
      res.status(500).json({ error: err });
   }
};

export const updateDiscussion = async (req: Request, res: Response) => {
   const { discussionId } = req.params;
   const updates = req.body;
   if (req.file) {
      updates.image = req.file.path;
   }
   try {
      const updatedDiscussion = await Discussion.findByIdAndUpdate(discussionId, updates, { new: true });
      if (!updatedDiscussion) {
         return res.status(404).json({ error: 'Discussion not found' });
      }
      res.json(updatedDiscussion);
   } catch (err) {
      res.status(500).json({ error: err });
   }
};

export const deleteDiscussion = async (req: Request, res: Response) => {
   const { discussionId } = req.params;
   try {
      const deletedDiscussion = await Discussion.findByIdAndDelete(discussionId);
      if (!deletedDiscussion) {
         return res.status(404).json({ error: 'Discussion not found' });
      }
      res.json(deletedDiscussion);
   } catch (err) {
      res.status(500).json({ error: err });
   }
};

export const getDiscussionsByTags = async (req: Request, res: Response) => {
   const { tags } = req.query;
   try {
      const discussions = await Discussion.find({ hashtags: { $in: tags } });
      res.json(discussions);
   } catch (err) {
      res.status(500).json({ error: err });
   }
};

export const getDiscussionsByText = async (req: Request, res: Response) => {
   const { text } = req.query;
   try {
      const discussions = await Discussion.find({ text: new RegExp(text as string, 'i') });
      res.json(discussions);
   } catch (err) {
      res.status(500).json({ error: err });
   }
};
