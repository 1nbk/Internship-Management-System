import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className="auth-page">
            {/* Background Decoration (already in CSS, but can add motion here too) */}
            <motion.div 
                className="auth-card"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <Layout size={32} />
                        <span>IMS Portal</span>
                    </Link>
                    <motion.h1 variants={itemVariants}>Welcome Back</motion.h1>
                    <motion.p variants={itemVariants}>Login to your account to continue</motion.p>
                </div>

                {error && (
                    <motion.div 
                        className="auth-error-message"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <motion.div className="form-group" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
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
                    </motion.div>

                    <motion.div className="form-group" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
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
                    </motion.div>

                    <motion.div className="auth-options" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                        <label className="checkbox-label">
                            <input type="checkbox" disabled={isLoading} /> Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
                        </Button>
                    </motion.div>
                </form>

                <motion.div 
                    className="auth-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Don't have an account? <Link to="/signup">Create one</Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
