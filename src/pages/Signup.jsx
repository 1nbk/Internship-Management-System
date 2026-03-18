import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, User, Briefcase, GraduationCap, ShieldCheck, BookOpen, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Auth.css';

const Signup = () => {
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Academic fields (Student specific)
    const [institution, setInstitution] = useState('');
    const [program, setProgram] = useState('');

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let userData = { name, email, role };
        
        if (role === 'student') {
            userData = {
                ...userData,
                institution,
                program
            };
        }
        
        signup(userData);
        navigate('/dashboard');
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

                <div className="role-selector">
                    <p>Select your role:</p>
                    <div className="role-options">
                        <button
                            className={`role-btn ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            <GraduationCap size={20} />
                            <span>Student</span>
                        </button>
                        <button
                            className={`role-btn ${role === 'supervisor' ? 'active' : ''}`}
                            onClick={() => setRole('supervisor')}
                        >
                            <Briefcase size={20} />
                            <span>Supervisor</span>
                        </button>
                        <button
                            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                            onClick={() => setRole('admin')}
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
                            />
                        </div>
                    </div>

                    {role === 'student' && (
                        <div className="student-fields fade-in" style={{ marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Institution Name</label>
                                <div className="input-wrapper">
                                    <Building2 className="input-icon" size={18} />
                                    <select
                                        value={institution}
                                        onChange={(e) => setInstitution(e.target.value)}
                                        required={role === 'student'}
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
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <Button type="submit" size="lg" className="w-full">
                        Create Account
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
