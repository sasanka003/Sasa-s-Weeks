import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutStart, signoutSuccess, signoutFailure } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(searchTerm);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSearchTerm(searchParams.get("searchTerm") || "");
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("searchTerm", searchTerm);
    const searchQuery = searchParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleSignout = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      } else {
        dispatch(signoutFailure(data.message));
      }
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };
  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='text-xl font-bold'>
        <span className='px-2 py-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white'>
          Sasa's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
      <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
          { theme === 'dark' ? <FaMoon /> : <FaSun/> }
      </Button>
      { currentUser ? (
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
            alt='user'
            img={currentUser.profilePicture}
            rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{currentUser.username}</span>
            <span className="block text-xs font-medium truncate">{currentUser.email}</span>
          </Dropdown.Header>
          <Link to='/dashboard?tab=profile'>
            <Dropdown.Item>Profile</Dropdown.Item> 
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
        </Dropdown>
      ) : (
        <Link to='/signin'>
            <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
            </Button>
        </Link>
      )
    }
        <Navbar.Toggle />
      </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to='/'>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={'div'}>
            <Link to='/about'>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={'div'}>
            <Link to='/projects'>Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      
    </Navbar>
  );
}