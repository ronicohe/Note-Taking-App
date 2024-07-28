import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {auth} from '../config/firebaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';
import '../styles/Login.css';
import {Link} from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-body">
            <div className="login-container">
                <h2 className="login-headline">Login to Note Taking App!</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    {error && <p className="login-error-message">{error}</p>}
                </form>
                <p className="toggle-link">
                    Need an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
