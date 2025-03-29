import React from 'react';
import './App.css';
import BoardGamesList from './components/BoardGamesList';

function App() {
    return (
        <div className="App">
            <header className="App-header">BoardMate</header>
            <BoardGamesList />
        </div>
    );
}

export default App;