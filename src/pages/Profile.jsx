import React, { useState, useEffect } from 'react';
import { 
    User, Mail, Building2, BookOpen, Shield, Save, Camera, ArrowLeft, 
    Phone, Linkedin, Github, Hash, Star, Plus, X, FileUp, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../api/apiService';
import Button from '../components/Button';
import './Dashboards.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        institution: user?.institution || '',
        program: user?.program || '',
        studentId: user?.studentId || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        linkedin: user?.linkedin || '',
        github: user?.github || '',
        year: user?.year || '',
        avatar: user?.avatar || '',
    });

    const [skills, setSkills] = useState(user?.skills || []);
    const [newSkill, setNewSkill] = useState('');
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                institution: user.institution || '',
                program: user.program || '',
                studentId: user.studentId || '',
                phone: user.phone || '',
                bio: user.bio || '',
                linkedin: user.linkedin || '',
                github: user.github || '',
                year: user.year || '',
                avatar: user.avatar || '',
            });
            setSkills(user.skills || []);
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result }));
                toast.success('Photo uploaded! Save changes to persist.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = { ...formData, skills };
            await apiService.updateProfile(payload);
            updateUser(payload);
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.message || 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your account settings, academic details, and professional presence.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="data-card large" style={{ padding: '0' }}>
                    {/* Hero Section */}
                    <div className="profile-hero-modern" style={{ 
                        display: 'flex', alignItems: 'center', gap: '2rem', 
                        padding: '2.5rem', 
                        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-main) 100%)', 
                        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', borderBottom: '1px solid var(--border)'
                    }}>
                        <div className="profile-avatar-wrapper" style={{ position: 'relative' }}>
                            <div className="large-avatar-glow" style={{ 
                                width: '110px', height: '110px', borderRadius: '50%', 
                                background: formData.avatar ? `url(${formData.avatar})` : 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                color: 'white', fontSize: '2.8rem', fontWeight: 'bold',
                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                                overflow: 'hidden'
                            }}>
                                {!formData.avatar && (formData.name.charAt(0) || 'U')}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                                onChange={handleAvatarChange} 
                            />
                            <button 
                                className="avatar-edit-btn-floating" 
                                title="Change Avatar" 
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="profile-hero-content" style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                                <h2 style={{ margin: 0 }}>{formData.name}</h2>
                                <span className={`badge ${user?.role === 'ADMIN' ? 'danger' : user?.role === 'SUPERVISOR' ? 'info' : 'success'}`} style={{ fontSize: '0.7rem' }}>
                                    {user?.role}
                                </span>
                            </div>
                            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{formData.institution || 'Institution not set'} • {formData.program || 'Program not set'}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer" className="social-link"><Linkedin size={18} /></a>}
                                {formData.github && <a href={formData.github} target="_blank" rel="noreferrer" className="social-link"><Github size={18} /></a>}
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{ padding: '0 2.5rem' }}>
                        <div className="tabs-container" style={{ margin: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
                            <div className="tabs">
                                <button type="button" className={`tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Basic Info</button>
                                {user?.role?.toUpperCase() === 'STUDENT' && <button type="button" className={`tab ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>Academic</button>}
                                <button type="button" className={`tab ${activeTab === 'professional' ? 'active' : ''}`} onClick={() => setActiveTab('professional')}>Professional</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="profile-form" style={{ paddingBottom: '2.5rem' }}>
                            {activeTab === 'basic' && (
                                <div className="tab-pane fade-in">
                                    <div className="form-grid-modern">
                                        <div className="form-group-dash">
                                            <label><User size={16} /> Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="form-group-dash">
                                            <label><Mail size={16} /> Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="form-group-dash">
                                            <label><Phone size={16} /> Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                placeholder="+233 XX XXX XXXX"
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="form-group-dash full-width">
                                            <label><Info size={16} /> Biography / About Me</label>
                                            <textarea
                                                rows="4"
                                                value={formData.bio}
                                                placeholder="Tell us a bit about yourself..."
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'academic' && (
                                <div className="tab-pane fade-in">
                                    <div className="form-grid-modern">
                                        <div className="form-group-dash">
                                            <label><Building2 size={16} /> Institution</label>
                                            <input
                                                type="text"
                                                value={formData.institution}
                                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="form-group-dash">
                                            <label><BookOpen size={16} /> Program of Study</label>
                                            <input
                                                type="text"
                                                value={formData.program}
                                                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="form-group-dash">
                                            <label><Hash size={16} /> Student ID Number</label>
                                            <input
                                                type="text"
                                                value={formData.studentId}
                                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="form-group-dash">
                                            <label><Star size={16} /> Year / Level</label>
                                            <select
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                disabled={isLoading}
                                                className="status-select"
                                                style={{ width: '100%', height: '42px' }}
                                            >
                                                <option value="">Select Level</option>
                                                <option value="100">Level 100</option>
                                                <option value="200">Level 200</option>
                                                <option value="300">Level 300</option>
                                                <option value="400">Level 400 (Final Year)</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'professional' && (
                                <div className="tab-pane fade-in">
                                    <div className="skills-section" style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', fontSize: '1rem' }}>
                                            <Star size={18} color="var(--primary)" /> Skills & Core Competencies
                                        </h4>
                                        <div className="skills-container-modern">
                                            {skills.map(skill => (
                                                <span key={skill} className="skill-tag">
                                                    {skill}
                                                    <button type="button" onClick={() => removeSkill(skill)}><X size={12} /></button>
                                                </span>
                                            ))}
                                            <div className="add-skill-field">
                                                <input 
                                                    type="text" 
                                                    value={newSkill} 
                                                    placeholder="Add a skill..." 
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                                                />
                                                <button type="button" onClick={addSkill}><Plus size={16} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-grid-modern mt-2">
                                        <div className="form-group-dash">
                                            <label><Linkedin size={16} /> LinkedIn Profile URL</label>
                                            <input
                                                type="url"
                                                value={formData.linkedin}
                                                placeholder="https://linkedin.com/in/username"
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="form-group-dash">
                                            <label><Github size={16} /> GitHub Profile URL</label>
                                            <input
                                                type="url"
                                                value={formData.github}
                                                placeholder="https://github.com/username"
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="resume-section" style={{ marginTop: '2rem' }}>
                                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>Curriculum Vitae (Resume)</h4>
                                        <div className="resume-upload-zone">
                                            <FileUp size={24} />
                                            <div className="upload-text">
                                                <span>Upload your latest resume (PDF)</span>
                                                <p>Maximum file size: 5MB</p>
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Button variant="secondary" size="sm" type="button">Select File</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-actions-sticky" style={{ background: 'white', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    <ArrowLeft size={18} /> Back
                                </Button>
                                <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                                    <Save size={18} /> Save Profile Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="data-card small info-sidebar" style={{ alignSelf: 'start' }}>
                    <div className="sidebar-section-modern" style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Profile Completion</h3>
                        <div className="completion-bar" style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px', margin: '1rem 0 0.5rem 0' }}>
                            <div className="completion-fill" style={{ width: '65%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>65% Complete</span>
                    </div>

                    <div className="sidebar-section-modern" style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Account Security</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>Manage your password and security settings.</p>
                        
                        <div className="security-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <Shield size={20} color="var(--success)" />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600' }}>Two-Factor Auth</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disabled</span>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" style={{ width: '100%' }}>Change Password</Button>
                    </div>

                    <div className="sidebar-section-modern danger" style={{ padding: '1.25rem', border: '1px solid #fee2e2', borderRadius: 'var(--radius-md)', background: '#fffafa' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger)', fontSize: '0.9rem' }}>Danger Zone</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Terminate your account and remove all data.</p>
                        <Button variant="outline" size="sm" style={{ width: '100%', color: 'var(--danger)', borderColor: '#fca5a5' }}>Terminate Account</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
