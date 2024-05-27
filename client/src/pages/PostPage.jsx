import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    useEffect(() => {
        try {
            const getPost = async () => {
                const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
                const data = await res.json();
                if(!res.ok) {
                    setError(data.message);
                    setLoading(false);
                    return;
                } else {
                    setPost(data.posts[0]);
                    setLoading(false);
                }
            };
            getPost();
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }, [postSlug]);

    if(loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    }

  return <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen ">
    <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
    <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
        <Button color='gray' pill size='xs'>{post && post.category}</Button>
    </Link>
    <img src={post && post.image} alt={post && post.title} className="mt-10 p-3 max-h-[600px] w-full object-cover"/>
    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length /1000).toFixed(0)} min read</span>
    </div>
    <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post && post.content}}></div>
  </main>;
}
