import React from "react";
import './Main.scss';
import {useNavigate} from 'react-router-dom';

const Main = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="main-container">
            <h1>Welcome to Chat App</h1>
            <button onClick={goToLogin}>Login</button>
            <button onClick={goToRegister}>Register</button>
        </div>
    );
};

export default Main;