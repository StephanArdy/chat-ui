import React, {useState} from "react";
import './Register.scss';
import { register } from "../../api";
import {useNavigate} from 'react-router-dom';

const Register = ({onRegisterSuccess}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user_id, setUserID] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await register({email, password, user_id, username});
            onRegisterSuccess(data);
            navigate('/home');
        } catch(error){
            setError('Registration failed. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                 type="email" 
                 placeholder="Input your email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                />
                <input 
                 type="password"
                 placeholder="Input your password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                />
                <input
                 type="text" 
                 placeholder="User ID will be used to add friends"
                 value={user_id}
                 onChange={(e) => setUserID(e.target.value)}
                 required
                />
                <input
                 type="text"
                 placeholder="This will be your username"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 required
                />
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;