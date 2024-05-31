import { Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector(state => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    try {
      const getComments = async () => {
        const res = await fetch(`/api/comment/getComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      };
      getComments();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(comment.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment, postId, userId: currentUser._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentError(null);
        setComment('');
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
      console.log(error);
    }
  };
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt={currentUser.username} />
          <Link className='text-xs text-cyan-600 hover:underline' to={`/dashboard?tab=profile`}>@{currentUser.username}</Link>
        </div>

      ) : (
        <div className='text-sm text-teal-500 flex gap-1'>
          You must sign in to comment.
          <Link className='text-blue-500 hover:underline' to={'/signin'}>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <Textarea
            placeholder='Write a comment...'
            rows='3'
            maxLength='200'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-sm'>{200 - comment.length}</p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
              Comment
            </Button>
          </div>
          {commentError && 
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          }
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-gray-500 text-sm my-5'>No comments yet!</p>
      ) : (
        <>
        <div className='text-sm my-5 flex items-center gap-1'>
          <p>Comments:</p>
          <div className='border border-gray-400 py-1 px-2 rounded-sm'>
            <p className=''>{comments.length}</p>
          </div>
        </div>
        {
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment}/>
          ))
        }
        </>
        )}
    </div>
  )
}