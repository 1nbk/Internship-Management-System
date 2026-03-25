import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, User, Briefcase, GraduationCap, ShieldCheck, BookOpen, Building2, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import './Auth.css';

const Signup = () => {
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Academic fields (Student specific)
    const [institution, setInstitution] = useState('');
    const [program, setProgram] = useState('');

    const { signup } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    // Password validation rules
    const passwordChecks = useMemo(() => ({
        minLength: password.length >= 6,
        hasNumber: /\d/.test(password),
        hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
    }), [password]);

    const isPasswordValid = passwordChecks.minLength && passwordChecks.hasNumber && passwordChecks.hasSymbol;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error('Password must be at least 6 characters with a number and a symbol.');
            return;
        }

        setIsLoading(true);

        const userData = { 
            name, 
            email, 
            password, 
            role: role.toUpperCase(), // Backend expects uppercase role
            ...(role === 'student' ? { institution, program } : {})
        };

        const result = await signup(userData);

        setIsLoading(false);
        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } else {
            toast.error(result.error || 'Signup failed. Please try again.');
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

                <motion.div className="role-selector" variants={itemVariants}>
                    <p>Select your role:</p>
                    <div className="role-options">
                        <button
                            type="button"
                            className={`role-btn ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                            disabled={isLoading}
                        >
                            <GraduationCap size={20} />
                            <span>Student</span>
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'supervisor' ? 'active' : ''}`}
                            onClick={() => setRole('supervisor')}
                            disabled={isLoading}
                        >
                            <Briefcase size={20} />
                            <span>Supervisor</span>
                        </button>
                        <button
                            type="button"
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
                                placeholder="Enter your full name"
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
                                placeholder="Min. 6 chars, a number & a symbol"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {password.length > 0 && (
                            <div className="password-requirements">
                                <div className={`req-item ${passwordChecks.minLength ? 'met' : ''}`}>
                                    {passwordChecks.minLength ? <Check size={14} /> : <AlertCircle size={14} />}
                                    <span>At least 6 characters</span>
                                </div>
                                <div className={`req-item ${passwordChecks.hasNumber ? 'met' : ''}`}>
                                    {passwordChecks.hasNumber ? <Check size={14} /> : <AlertCircle size={14} />}
                                    <span>At least one number</span>
                                </div>
                                <div className={`req-item ${passwordChecks.hasSymbol ? 'met' : ''}`}>
                                    {passwordChecks.hasSymbol ? <Check size={14} /> : <AlertCircle size={14} />}
                                    <span>At least one symbol (!@#$...)</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {role === 'student' && (
                        <motion.div 
                            className="student-fields" 
                            variants={itemVariants}
                            style={{ 
                                marginTop: '0.5rem', 
                                paddingTop: '1.5rem', 
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.15rem'
                            }}
                        >
                            <div className="form-group">
                                <label>Institution Name</label>
                                <div className="input-wrapper">
                                    <Building2 className="input-icon" size={18} />
                                    <select
                                        value={institution}
                                        onChange={(e) => setInstitution(e.target.value)}
                                        required={role === 'student'}
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled hidden>Select your institution...</option>
                                        <option value="University of Ghana (UG)">University of Ghana (UG)</option>
                                        <option value="Kwame Nkrumah University of Science and Technology (KNUST)">Kwame Nkrumah University of Science and Technology (KNUST)</option>
                                        <option value="University of Cape Coast (UCC)">University of Cape Coast (UCC)</option>
                                        <option value="University of Education, Winneba (UEW)">University of Education, Winneba (UEW)</option>
                                        <option value="University for Development Studies (UDS)">University for Development Studies (UDS)</option>
                                        <option value="Accra Technical University (ATU)">Accra Technical University (ATU)</option>
                                        <option value="Ghana Communication Technology University (GCTU)">Ghana Communication Technology University (GCTU)</option>
                                        <option value="Ashesi University">Ashesi University</option>
                                        <option value="Academic City University College">Academic City University College</option>
                                        <option value="Ghana Institute of Management and Public Administration (GIMPA)">GIMPA</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Program of Study</label>
                                <div className="input-wrapper">
                                    <BookOpen className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. B.Sc. Computer Science"
                                        value={program}
                                        onChange={(e) => setProgram(e.target.value)}
                                        required={role === 'student'}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

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
