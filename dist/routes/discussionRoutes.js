"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const discussionController_1 = require("../controllers/discussionController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/', auth_1.default, upload.single('image'), discussionController_1.createDiscussion);
router.put('/:discussionId', auth_1.default, upload.single('image'), discussionController_1.updateDiscussion);
router.delete('/:discussionId', auth_1.default, discussionController_1.deleteDiscussion);
router.get('/tags', auth_1.default, discussionController_1.getDiscussionsByTags);
router.get('/text', auth_1.default, discussionController_1.getDiscussionsByText);
exports.default = router;
