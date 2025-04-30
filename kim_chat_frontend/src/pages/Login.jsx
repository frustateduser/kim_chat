import React from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {

  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  const getValue = (e) => {
    let oldData = { ...formData };
    oldData[e.target.name] = e.target.value;
    setFormData(oldData);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
    });
  };

  const Navigate = useNavigate(); // for navigation

  let submitData = (e) => {
    e.preventDefault();
    axios.post(import.meta.env.VITE_REACT_APP_LOGIN_API_URL, formData).then((res) => {
      console.log(res.data)
      localStorage.setItem('token', res.data.token); // Store the token in localStorage
      toast.success('User logged in successfully')
      Navigate('/chat', { replace: true })
    }).then((res) => {
      resetForm();
    })
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <ToastContainer />
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form method="POST" className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  required
                  autoComplete="username"
                  onChange={getValue}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-purple-600 hover:text-purple-400">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={getValue}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={submitData}
                className="flex w-full justify-center rounded-md bg-purple-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}



export default Login;