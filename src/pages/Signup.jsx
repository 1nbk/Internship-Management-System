import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, User, Briefcase, GraduationCap, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="auth-page">
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
                    <motion.h1 variants={itemVariants}>Create Account</motion.h1>
                    <motion.p variants={itemVariants}>Join the Internship Management System</motion.p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="auth-error-message"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div className="role-selector" variants={itemVariants}>
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
                </motion.div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <motion.div className="form-group" variants={itemVariants}>
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
                    </motion.div>

                    <motion.div className="form-group" variants={itemVariants}>
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

                    <motion.div className="form-group" variants={itemVariants}>
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

                    <motion.div variants={itemVariants}>
                        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                        </Button>
                    </motion.div>
                </form>

                <motion.div 
                    className="auth-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Already have an account? <Link to="/login">Sign in</Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;
