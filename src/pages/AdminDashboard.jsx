import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, FileCheck, ArrowRight, Shield, Briefcase, TrendingUp, Activity, Bell, FileText, Settings, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboards.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [letterRequests, setLetterRequests] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const savedLetters = JSON.parse(localStorage.getItem('letter_requests') || '[]');
        const savedUsers = JSON.parse(localStorage.getItem('ims_users') || '[]');
        const savedPosts = JSON.parse(localStorage.getItem('internship_posts') || '[]');
        setLetterRequests(savedLetters);
        setUsersList(savedUsers);
        setPosts(savedPosts);
    }, []);

    const totalStudents = usersList.filter(u => u.role === 'student').length;
    const activeSupervisors = usersList.filter(u => u.role === 'supervisor' && u.status === 'active').length;
    const pendingLetters = letterRequests.filter(r => r.status === 'pending').length;
    
    // Placement Rate Calculation
    const assignedStudents = usersList.filter(u => u.role === 'student' && u.supervisorName).length;
    const placementRate = totalStudents > 0 ? Math.round((assignedStudents / totalStudents) * 100) : 0;
    
    // Alert logic
    const awaitingSupervisor = usersList.filter(u => u.role === 'student' && u.internshipStarted && !u.supervisorName).length;

    const stats = [
        { label: 'Total Students', value: String(totalStudents), icon: <Users size={24} />, color: 'blue' },
        { label: 'Active Supervisors', value: String(activeSupervisors), icon: <UserCheck size={24} />, color: 'purple' },
        { label: 'Pending Letters', value: String(pendingLetters), icon: <Clock size={24} />, color: 'orange' },
        { label: 'Active Placements', value: String(assignedStudents), icon: <Briefcase size={24} />, color: 'green' },
    ];

    const quickActions = [
        { label: 'User Management', desc: 'Manage access & roles', icon: <Users size={22} />, path: '/dashboard/users', accent: '#3b82f6' },
        { label: 'Review Letters', desc: 'Approve pending requests', icon: <FileText size={22} />, path: '/dashboard/admin/letters', accent: '#8b5cf6' },
        { label: 'Post Internship', desc: 'Add new opportunities', icon: <Briefcase size={22} />, path: '/dashboard/opportunities', accent: '#10b981' },
        { label: 'System Reports', desc: 'Generate system analytics', icon: <TrendingUp size={22} />, path: '/dashboard/reports', accent: '#f59e0b' },
    ];

    return (
        <div className="dashboard-view fade-in">
            {/* Welcome Banner */}
            <div className="student-welcome-banner" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div className="welcome-text">
                    <h1 style={{ color: 'var(--text-main)' }}>Admin Command Center ⚡</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name || 'Administrator'}. Monitor system health and pending approvals.</p>
                </div>
                <div className="welcome-accent" style={{ opacity: 0.8 }}>
                    <Shield size={80} strokeWidth={1} color="#3b82f6" />
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div className={`stat-icon ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Placement Rate + Alert Queue */}
                <div className="data-card large">
                    <div className="card-header">
                        <h3>System Health & Placements</h3>
                    </div>

                    <div className="student-progress-section">
                        <div className="premium-progress-ring">
                            <svg width="140" height="140" viewBox="0 0 140 140">
                                <circle cx="70" cy="70" r="64" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                <circle cx="70" cy="70" r="64" fill="none" stroke="#10b981" strokeWidth="8"
                                    strokeDasharray="402.12" strokeDashoffset={402.12 - (402.12 * placementRate) / 100} strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                            </svg>
                            <div className="progress-ring-text">
                                <span className="percent" style={{ color: '#10b981' }}>{placementRate}%</span>
                                <span className="label">Placed</span>
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="student-recent-section">
                            <h4>Needs Attention</h4>
                            {pendingLetters > 0 || awaitingSupervisor > 0 ? (
                                <div className="student-requests-list">
                                    {pendingLetters > 0 && (
                                        <div className="student-request-item" style={{ borderLeft: '3px solid var(--warning)' }}>
                                            <div className="request-item-info">
                                                <span className="request-company" style={{ color: 'var(--warning-dark)'}}>Pending Letters</span>
                                                <span className="request-date">{pendingLetters} students are waiting for their internship letter to be approved.</span>
                                            </div>
                                            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => navigate('/dashboard/admin/letters')}>Review</button>
                                        </div>
                                    )}
                                    {awaitingSupervisor > 0 && (
                                        <div className="student-request-item" style={{ borderLeft: '3px solid var(--primary)' }}>
                                            <div className="request-item-info">
                                                <span className="request-company" style={{ color: 'var(--primary-dark)'}}>Unassigned Students</span>
                                                <span className="request-date">{awaitingSupervisor} students have started but need a supervisor assigned.</span>
                                            </div>
                                            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => navigate('/dashboard/users')}>Assign</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="empty-state-simple" style={{ padding: '2rem 1rem' }}>
                                    <div className="icon-wrapper-mb" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                        <Activity size={32} />
                                    </div>
                                    <p>System is healthy. No urgent actions required.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="timeline-list" style={{ marginTop: '1.5rem' }}>
                        <div className="card-header-sub">
                            <h4>Recent Placements</h4>
                            <button className="text-btn" onClick={() => navigate('/dashboard/users')}>
                                View All <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="table-responsive" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                            {letterRequests.filter(r => r.status === 'issued').length > 0 ? (
                                <table className="placement-table" style={{ background: 'var(--bg-main)' }}>
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Company</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {letterRequests.filter(r => r.status === 'issued').slice(0, 3).map((r) => (
                                            <tr key={r.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="avatar-sm">{r.studentName?.charAt(0) || 'S'}</div>
                                                        <span>{r.studentName || 'Student'}</span>
                                                    </div>
                                                </td>
                                                <td><Briefcase size={14} style={{ display: 'inline', marginRight: '5px', color:'var(--text-muted)'}}/>{r.company}</td>
                                                <td><span className="badge success">Active</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state-simple" style={{ background: 'var(--bg-main)' }}>
                                    <p>No active placements recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="data-card small">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="admin-quick-actions">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                className="admin-action-card"
                                onClick={() => navigate(action.path)}
                            >
                                <div className="action-icon-wrap" style={{ background: `${action.accent}15`, color: action.accent }}>
                                    {action.icon}
                                </div>
                                <div className="action-text">
                                    <span className="action-label">{action.label}</span>
                                    <span className="action-desc">{action.desc}</span>
                                </div>
                                <ArrowRight size={16} className="action-arrow" />
                            </button>
                        ))}
                    </div>

                    <div className="mt-1">
                        <div className="card-header-sub mt-1">
                            <h3>Live System Activity</h3>
                        </div>
                        <div className="skills-list-premium" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '50%' }}>
                                    <Bell size={14} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500' }}>New Letter Requests</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students have submitted requests</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple)', padding: '0.4rem', borderRadius: '50%' }}>
                                    <Users size={14} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500' }}>User Sync Completed</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 new student profiles loaded</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
