import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, BookOpen, Shield, Save, Camera, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../api/apiService';
import Button from '../components/Button';
import './Dashboards.css';

const Profile = () => {
    const { user, login } = useAuth(); // We might need to refresh user data after update
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        institution: user?.institution || '',
        program: user?.program || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                institution: user.institution || '',
                program: user.program || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await apiService.updateProfile(formData);
            toast.success('Profile updated successfully!');
            // In a real app, we'd update the AuthContext user here
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.message || 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your account settings and personal information.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="data-card large">
                    <div className="profile-hero" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <div className="profile-avatar-wrapper" style={{ position: 'relative' }}>
                            <div className="large-avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {formData.name.charAt(0) || 'U'}
                            </div>
                            <button className="avatar-edit-btn" style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}>
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="profile-hero-text">
                            <h2 style={{ margin: 0 }}>{formData.name}</h2>
                            <p style={{ margin: '0.2rem 0 0.5rem 0', color: 'var(--text-muted)' }}>{user?.role} • {formData.institution || 'No Institution Set'}</p>
                            <span className="badge success">Active Account</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
                                <label><Building2 size={16} /> Institution</label>
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>

                            {user?.role === 'STUDENT' && (
                                <div className="form-group-dash">
                                    <label><BookOpen size={16} /> Program of Study</label>
                                    <input
                                        type="text"
                                        value={formData.program}
                                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-actions" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                <ArrowLeft size={18} /> Back
                            </Button>
                            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                                <Save size={18} /> Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="data-card small info-sidebar">
                    <h3>Account Security</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Keep your account secure by following these best practices.</p>
                    
                    <div className="security-status" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Shield size={20} color="var(--success)" />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500' }}>Password Status</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated 3 months ago</span>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" className="w-full">Change Password</Button>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger)' }}>Danger Zone</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Deleting your account is permanent and cannot be undone.</p>
                        <Button variant="outline" size="sm" className="w-full" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>Terminate Account</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
