import { set } from "mongoose";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


export default function Search() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    category: "uncategorized",
    sort: "desc",
});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    const categoryFromURL = urlParams.get("category");
    const sortFromURL = urlParams.get("sort");
    if(searchTermFromURL || categoryFromURL || sortFromURL) {
      setSidebarData(
        {
          ...sidebarData,
          searchTerm: searchTermFromURL,
          category: categoryFromURL,
          sort: sortFromURL
        }
      );
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/posts/getPosts?${searchQuery}`);
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
    }
    fetchPosts();
  }, [location.search]);
  console.log(sidebarData);
  return (
    <div>Search</div>
  )
}
