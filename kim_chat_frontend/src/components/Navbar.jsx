

function Navbar() {
    
    return (
        <>
            <nav className="navbar border border-purple-500 bg-gradient-to-l from-purple-500 to-white-400 p-5 m-1 flex items-center">
                <div id="logo">
                    <img src="kim.svg" alt="logo" className="w-20 h-20 p-1 m-0.5" />
                </div>

                <div id="title" className="text-xl font-bold">
                <h1 className="text-xl text-purple-700">KIM Chat</h1>
                </div>
            </nav>
        </>
    );
}

export default Navbar;