import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: 'http://www.subbculture.com/wp-content/uploads/2016/04/dummy-post-horisontal-thegem-blog-default.jpg'
        },
        category: {
            type: String,
            default: "uncategorized"
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        }
    }, { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;

