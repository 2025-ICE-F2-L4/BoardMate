import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import BoardGamesList from './components/BoardGamesList';
import GameDetails from './components/GameDetailsView';
import AdminPanel from './components/AdminPanel';
import Profile from './components/Profile';
import Login from './components/Login';
import Navbar from './components/Navbar';

function AppWrapper() {
    const location = useLocation();
    const isAlt = location.pathname === "/login" || location.pathname === "/profile";

    return (
        <div className={`App ${isAlt ? "alt-background" : "main-background"}`}>
            <Navbar />
            <Routes>
                <Route path="/" element={<BoardGamesList />} />
                <Route path="/gameDetails" element={<GameDetails />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
}


// // import React from 'react';
// // import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// // import './App.css';
// // import BoardGamesList from './components/BoardGamesList';
// // import GameDetails from './components/GameDetailsView';
// // import AdminPanel from './components/AdminPanel';

// // function App() {
// //     return (
// //         <BrowserRouter>
// //             <div className="App">
// //                 <header className="App-header">
// //                     BoardMate
// //                     <div className="nav-links">
// //                         <Link to="/" className="nav-link">Home</Link>
// //                         <Link to="/admin" className="nav-link">Admin</Link>
// //                     </div>
// //                 </header>
// //                 <Routes>
// //                     <Route path="/" element={<BoardGamesList />} />
// //                     <Route path="/gameDetails" element={<GameDetails />} />
// //                     <Route path="/admin" element={<AdminPanel />} />
// //                 </Routes>
// //             </div>
// //         </BrowserRouter>
// //     );
// // }

// // export default App;

