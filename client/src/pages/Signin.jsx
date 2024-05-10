import { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure  } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Signin() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading, error:errorMessage }= useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleChange = (e) => {
    // console.log(e.target.value);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields!'));
    }
    if(formData.password.length < 6) {
      return dispatch(signInFailure('Password must be at least 6 characters!'));
    }

    try {
      dispatch(signInStart());
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if(data.success === false) {
        return dispatch(signInFailure(data.Message));
      }
      if(response.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.Message));
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
        <Link to='/' className='text-4xl font-bold dark:text-white'>
          <span className='px-2 py-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white'>
            Sasa's
          </span>
          Blog
        </Link>
        <p className='text-sm mt-5'>
          This is a demo project. You can sign in with your email and password
          or with Google.
        </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Your password' />
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : (
                  'Sign In'
                )
              }
            </Button>
          </form>
          <div className='flex gap-2 textsm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/signup' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

