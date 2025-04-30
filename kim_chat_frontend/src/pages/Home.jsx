import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Signup from './Signup';
import Login from './Login';

function Home() {
    const [currentPage, setCurrentPage] = useState('home'); // State to track the current page

    const renderPage = () => {
        switch (currentPage) {
            case 'signup':
                return <Signup />;
            case 'login':
                return <Login />;
            default:
                return (
                    <div className="flex flex-wrap justify-center gap-6 overflow-hidden">
                        <button
                            className="bg-purple-300 p-6 rounded-lg shadow-lg w-80 text-center"
                            onClick={() => setCurrentPage('signup')}
                        >
                            Signup
                        </button>
                        <button
                            className="bg-purple-300 p-6 rounded-lg shadow-lg w-80 text-center"
                            onClick={() => setCurrentPage('login')}
                        >
                            Login
                        </button>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="bg-white-200 min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center bg-black-100 bg-opacity-50">
                    {renderPage()}
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Home;