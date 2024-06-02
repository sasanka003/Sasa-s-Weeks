import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComment() {
  const { currentUser } = useSelector((state) => state.user);
  const [userComments, setUserComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if(res.ok) {
          setUserComments(data.comments);
          if(data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.type === 'admin') {
      fetchUserComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const srartIndex = userComments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${srartIndex}`);
      const data = await res.json();
      if(res.ok) {
        setUserComments((prev) => [...prev, ...data.comments]);
        if(data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/delete/${commentIdToDelete}`, {
        method: 'DELETE',
      });
        const data = await res.json();
        if(!res.ok) {
        console.log(data.message);
        } else {
        setUserComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        }
    } catch (error) {
        console.log(error.message);
    }
};
  
  return <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
    {(currentUser.type === 'editor' || currentUser.type === 'admin') && userComments.length > 0 ? (
      <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Commented date</Table.HeadCell>
            <Table.HeadCell>Comment</Table.HeadCell>
            <Table.HeadCell>postId</Table.HeadCell>
            <Table.HeadCell>userId</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {userComments.map((comment) => (
              <Table.Row className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                <Table.Cell>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {comment.comment}
                </Table.Cell>
                <Table.Cell>
                  {comment.postId}
                </Table.Cell>
                <Table.Cell>
                  {comment.userId}
                </Table.Cell>
                <Table.Cell>
                  <span onClick={
                    () => {
                      setCommentIdToDelete(comment._id);
                      setShowModal(true);
                    }
                  } className='font-medium text-red-500 hover:underline' >Delete</span>
                </Table.Cell>
              </Table.Row>

            ))}
          </Table.Body>
        </Table>
        {showMore && (
          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            Show more
          </button>
        )}
      </>
    ) : (
      <p>No comments found</p>
    )
    }
    <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  </div>
}
