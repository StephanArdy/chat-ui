import React, {useState} from 'react';
import './Login.scss';
import {login} from '../../api';
import {useNavigate} from 'react-router-dom';

const Login = ({onLoginSuccess}) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await login({identifier, password});
            onLoginSuccess(userData);
            navigate('/home')
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            console.error("Login error:", error);
        }
    };

    return(
        <div className='auth-container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                 type="text"
                 placeholder='Input your email or user ID'
                 value={identifier}
                 onChange={(e) =>  setIdentifier(e.target.value)}
                 required
                />
                <input 
                 type="password"
                 placeholder='Input your password'
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)}
                 required
                />
                {error && <p style={{color:'red'}}>{error}</p>}
                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default Login;