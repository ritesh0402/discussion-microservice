import { Request, Response } from 'express';
import cloudinary from '../cloudinaryConfig';
import Discussion from '../models/Discussion';
import mongoose from 'mongoose';
import multer from 'multer';
import streamifier from 'streamifier';
import { UploadApiResponse } from 'cloudinary';

const upload = multer({ dest: 'uploads/' });

interface AuthenticatedRequest extends Request {
   user?: string | object; // Adjust the type based on your JWT payload
}

export const createDiscussion = async (req: AuthenticatedRequest, res: Response) => {
   try {
      const createdBy = new mongoose.Types.ObjectId(req.user as string); // Type assertion
      const { text, hashtags } = req.body;
      let image = '';

      if (req.file) {
         const bufferStream = streamifier.createReadStream(req.file.buffer); // Convert Buffer to ReadableStream
         const uploadedImage = await uploadToCloudinary(bufferStream);
         image = uploadedImage.secure_url;
      }


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

   // Check if req.file exists to decide whether to update 'image' field
   if (req.file) {
      try {
         const bufferStream = streamifier.createReadStream(req.file.buffer); // Convert Buffer to ReadableStream
         const uploadedImage = await uploadToCloudinary(bufferStream);
         updates.image = uploadedImage.secure_url;

         // No need to delete the temporary file uploaded by multer on Vercel
      } catch (err) {
         return res.status(500).json({ error: err });
      }
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

async function uploadToCloudinary(stream: NodeJS.ReadableStream): Promise<UploadApiResponse> {
   return new Promise((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream({
         folder: 'discussions', // Optional folder in Cloudinary
      }, (error: any, result?: UploadApiResponse) => { // Specify result as optional
         if (error) {
            reject(error);
         } else {
            if (result) {
               resolve(result);
            } else {
               reject(new Error('Upload result is undefined'));
            }
         }
      });

      stream.pipe(cloudStream);
   });
}

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
