import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getStorage } from "firebase/storage";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [image, setImage] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
  });
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    try {
      const getPost = async () => {
        const res = await fetch(`/api/post/getPosts?postId=${postId}`);
        const data = await res.json();
        if(!res.ok) {
          console.error(data.message);
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          setFormData(data.posts[0]);
          setPost(data.posts[0]);
          }
          };
          getPost();
          } catch (error) {
            console.error(error);
            }
            }, [postId]);
            console.log('below');
            console.log(formData);
            console.log(post);
          console.log('above');
  const handleImageUpload = async () => {
    try {
      if (!image) {
        return setImageUploadError("Please select an image");
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const imageName = new Date().getTime() + "-" + image.name;
      const storageRef = ref(storage, imageName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
        console.error(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            name="title"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            value={formData.category}
            id="category"
          >
            <option value="uncatagorized">Select a category</option>
            <option value="genai">GenAI</option>
            <option value="machine-learning">Machine Learning</option>
            <option value="data-science">Data Science</option>
            <option value="web-development">Web Development</option>
            <option value="fastapi">FastAPI</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dashed p-3 rounded-lg">
          <FileInput name="image" id="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleImageUpload}
            disabled={imageUploadProgress}
          >
            {
              imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
                </div>
              ) : (
                "Upload Image"
              )
            }
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="preview"
            className="w-full h-72 object-cover rounded-lg"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something ..."
          className="h-72 mb-12"
          required
          value={formData.content}
          onChange={(value) => setFormData((prevState) => ({
            ...prevState,
            content: value,
          }))}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}