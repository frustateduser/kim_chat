import React from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function SignUp() {

    // updates value of input fields
    let [formData, setFormData] = React.useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    
    // get value of input fields
    let getValue = (e) => {
        let oldData = { ...formData }
        oldData[e.target.name] = e.target.value
        setFormData(oldData)
    }

    // reset form fields
    let resetForm = () => {
        setFormData({
            name: '',
            username: '',
            email: '',
            password: ''
        })
    }


    // submit form data
    let submitData = (e) => {

        e.preventDefault();     // prevent page from reloading
        axios.post(import.meta.env.VITE_REACT_APP_SIGNUP_API_URL, formData).then((res) => {  // post data to server
            console.log(res.data)
            toast.success('User registered successfully')
        }).then((res) => {
            resetForm();
        })


    }

    return (
        <form className="m-2 p-2 border border-gray-900/10 rounded-4xl shadow-md">
            <ToastContainer />  {/* toast container gives a message at top right corner*/}
            <div className="space-y-8">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Sign Up</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                        Welcome to KIM Chat! Please fill out the form below to create an account and start chatting with your friends and family.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">

                        <div className="sm:col-span-3">
                            <div className="mt-1">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder='Your Name'
                                    required={true}
                                    value={formData.name}
                                    onChange={getValue}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="username"
                                        required={true}
                                        value={formData.username}
                                        onChange={getValue}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                E-mail
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder='email'
                                    required={true}
                                    value={formData.email}
                                    onChange={getValue}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    placeholder='password'
                                    required={true}
                                    value={formData.password}
                                    onChange={getValue}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={resetForm}
                >
                    Clear
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={submitData}
                >
                    Sign Up
                </button>
            </div>
        </form>
    )
}
