import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

const App = () => {
  const [userID, setUserID] = React.useState(null);
  const [username, setUsername] = React.useState(null);

  const handleLoginSuccess = (userData) => {
    console.log('User data received:', userData)
    setUserID(userData.data.user_id);
    setUsername(userData.data.username);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/register' element={<Register onRegisterSuccess={handleLoginSuccess} />} />
        <Route 
          path="/home" 
          element={userID && username ? <Home userID={userID} username={username}/> : <p>Loading...</p>}
        />
      </Routes>
    </Router>
  );
};

export default App;
