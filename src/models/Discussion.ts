import mongoose, { Document, Schema } from 'mongoose';

interface IDiscussion extends Document {
   text: string;
   image?: string;
   hashtags: string[];
   createdBy: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const DiscussionSchema: Schema = new Schema({
   text: { type: String, required: true },
   image: { type: String },
   hashtags: { type: [String], required: true },
   createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
