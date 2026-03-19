import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        const result = await login(email, password);
        
        setIsLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <Layout size={32} />
                        <span>IMS Portal</span>
                    </Link>
                    <h1>Welcome Back</h1>
                    <p>Login to your account to continue</p>
                </div>

                {error && (
                    <div className="auth-error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="auth-options">
                        <label className="checkbox-label">
                            <input type="checkbox" disabled={isLoading} /> Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
                    </Button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
