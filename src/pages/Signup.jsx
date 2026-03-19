import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, User, Briefcase, GraduationCap, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Auth.css';

const Signup = () => {
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await signup({ 
            name, 
            email, 
            password, 
            role: role.toUpperCase() // Backend expects uppercase role
        });

        setIsLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Signup failed. Please try again.');
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
                    <h1>Create Account</h1>
                    <p>Join the Internship Management System</p>
                </div>

                {error && (
                    <div className="auth-error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="role-selector">
                    <p>Select your role:</p>
                    <div className="role-options">
                        <button
                            className={`role-btn ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                            disabled={isLoading}
                        >
                            <GraduationCap size={20} />
                            <span>Student</span>
                        </button>
                        <button
                            className={`role-btn ${role === 'supervisor' ? 'active' : ''}`}
                            onClick={() => setRole('supervisor')}
                            disabled={isLoading}
                        >
                            <Briefcase size={20} />
                            <span>Supervisor</span>
                        </button>
                        <button
                            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                            onClick={() => setRole('admin')}
                            disabled={isLoading}
                        >
                            <ShieldCheck size={20} />
                            <span>Admin</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

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

                    <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                    </Button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
