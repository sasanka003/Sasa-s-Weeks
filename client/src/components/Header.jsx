import { Button, Navbar, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export default function Header() {
  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='text-xl font-bold'>
        <span className='px-2 py-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white'>
          Sasa's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
      </Button>
      <div className="flex gap-2">
      <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
          <FaMoon />
      </Button>
        <Link to='/signin'>
            <Button gradientDuoTone='purpleToBlue'>
                Sign In
            </Button>
        </Link>
      </div>
      
    </Navbar>
  );
}