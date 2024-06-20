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
exports.getDiscussionsByText = exports.getDiscussionsByTags = exports.deleteDiscussion = exports.updateDiscussion = exports.createDiscussion = void 0;
const cloudinaryConfig_1 = __importDefault(require("../cloudinaryConfig"));
const Discussion_1 = __importDefault(require("../models/Discussion"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const createDiscussion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdBy = new mongoose_1.default.Types.ObjectId(req.user); // Type assertion
        const { text, hashtags } = req.body;
        let image = '';
        if (req.file) {
            const uploadedImage = yield cloudinaryConfig_1.default.uploader.upload(req.file.path, {
                folder: 'discussions',
            });
            image = uploadedImage.secure_url;
        }
        const discussion = new Discussion_1.default({
            text,
            hashtags,
            image,
            createdBy,
            createdOn: new Date(),
        });
        yield discussion.save();
        res.status(201).json(discussion);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.createDiscussion = createDiscussion;
const updateDiscussion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { discussionId } = req.params;
    const updates = req.body;
    // Check if req.file exists to decide whether to update 'image' field
    if (req.file) {
        try {
            const uploadedImage = yield cloudinaryConfig_1.default.uploader.upload(req.file.path, {
                folder: 'discussions', // Optional folder in Cloudinary
            });
            updates.image = uploadedImage.secure_url;
            // No need to delete the temporary file uploaded by multer on Vercel
        }
        catch (err) {
            return res.status(500).json({ error: err });
        }
    }
    try {
        const updatedDiscussion = yield Discussion_1.default.findByIdAndUpdate(discussionId, updates, { new: true });
        if (!updatedDiscussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        res.json(updatedDiscussion);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.updateDiscussion = updateDiscussion;
const deleteDiscussion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { discussionId } = req.params;
    try {
        const deletedDiscussion = yield Discussion_1.default.findByIdAndDelete(discussionId);
        if (!deletedDiscussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        res.json(deletedDiscussion);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.deleteDiscussion = deleteDiscussion;
const getDiscussionsByTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags } = req.query;
    try {
        const discussions = yield Discussion_1.default.find({ hashtags: { $in: tags } });
        res.json(discussions);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.getDiscussionsByTags = getDiscussionsByTags;
const getDiscussionsByText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.query;
    try {
        const discussions = yield Discussion_1.default.find({ text: new RegExp(text, 'i') });
        res.json(discussions);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.getDiscussionsByText = getDiscussionsByText;
