import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message);
                    setLoading(false);
                    return;
                }
                setPost(data.posts[0]);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        getPost();
    }, [postSlug]);

    useEffect(() => {
        const getRecentPosts = async () => {
            try {
                const res = await fetch('/api/post/getPosts?limit=3');
                const data = await res.json();
                if (res.ok) {
                    setRecentPosts(data.posts);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getRecentPosts();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!");
        }).catch((err) => {
            console.error('Failed to copy: ', err);
        });
    };

    useEffect(() => {
        document.querySelectorAll("pre code").forEach((codeBlock) => {
            const button = document.createElement("button");
            button.className = "copy-button";
            button.innerText = "Copy";
            button.addEventListener("click", () => copyToClipboard(codeBlock.innerText));
            codeBlock.parentNode.insertBefore(button, codeBlock.nextSibling);
        });
    }, [post]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <main className="p-3 flex flex-col max-w-8xl mx-auto min-h-screen">
            <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
            <Link className="self-center mt-5" to={`/search?category=${post && post.category}`}>
                <Button color="gray" pill size="xs">{post && post.category}</Button>
            </Link>
            <img src={post && post.image} alt={post && post.title} className="mt-10 p-3 max-h-[600px] max-w-6xl object-cover mx-auto" />
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-5xl text-sm">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post && (post.content.length / 1000).toFixed(0)} min read</span>
            </div>
            <div className="p-3 max-w-5xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection postId={post._id} />
            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent Articles</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {
                        recentPosts && recentPosts.map((post) =>
                            <PostCard key={post._id} post={post} />
                        )
                    }
                </div>
            </div>
        </main>
    );
}
