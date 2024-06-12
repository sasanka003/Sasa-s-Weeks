import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Select, TextInput } from "flowbite-react";
import PostCard from "../components/PostCard";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    category: "",
    sort: "desc",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm") || "";
    const categoryFromURL = urlParams.get("category") || "";
    const sortFromURL = urlParams.get("sort") || "desc";

    setSidebarData({
      searchTerm: searchTermFromURL,
      category: categoryFromURL,
      sort: sortFromURL,
    });

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getPosts?${searchQuery}`);
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setPosts(data.posts);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        } else {
          setLoading(false);
          setError(data.message);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (sidebarData.searchTerm) searchParams.set("searchTerm", sidebarData.searchTerm);
    if (sidebarData.category) searchParams.set("category", sidebarData.category);
    searchParams.set("sort", sidebarData.sort);
    const searchQuery = searchParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams(location.search);
    const startIndex = posts.length;
    const limit = 9;
    urlParams.set("startIndex", startIndex);
    urlParams.set("limit", limit);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getPosts?${searchQuery}`);
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">Search Term:</label>
              <TextInput
                type="text"
                placeholder="Search..."
                id="searchTerm"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Category:</label>
              <Select id="category" value={sidebarData.category} onChange={handleChange}>
                <option value="">Uncategorized</option>
                <option value="genai">GenAI</option>
                <option value="machine-learning">Machine Learning</option>
                <option value="data-science">Data Science</option>
                <option value="web-development">Web Development</option>
                <option value="fastapi">FastAPI</option>
              </Select>
            </div>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Apply Filters
            </Button>
          </form>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Search Results:</h1>
          <div className="p-7 flex flex-wrap gap-4">
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading && posts.length === 0 && <p className="text-xl text-gray-500">No posts found</p>}
            {!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
            {showMore && (
              <button onClick={handleShowMore} className="w-full p-7 text-teal-500 text-lg hover:underline">
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
