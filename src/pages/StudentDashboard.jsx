import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, TrendingUp, Clock, Send, FileText, BookOpen, ArrowRight, Award, Briefcase, FolderOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboards.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [letterRequests, setLetterRequests] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('letter_requests') || '[]');
        const myRequests = saved.filter(r => r.studentId === user?.id);
        setLetterRequests(myRequests);
    }, [user?.id]);

    const stats = [
        { label: 'Weeks Completed', value: '0/12', icon: <Calendar size={24} />, color: 'blue' },
        { label: 'Reports Approved', value: '0', icon: <CheckCircle2 size={24} />, color: 'green' },
        { label: 'Submission Streak', value: '0 weeks', icon: <TrendingUp size={24} />, color: 'purple' },
        { label: 'Days Remaining', value: '--', icon: <Clock size={24} />, color: 'orange' },
    ];

    const quickActions = [
        { label: 'Weekly Logbook', desc: 'Submit your weekly entry', icon: <BookOpen size={22} />, path: '/dashboard/logbook', accent: '#3b82f6' },
        { label: 'Request Letter', desc: 'Apply for internship letter', icon: <Send size={22} />, path: '/dashboard/letter-request', accent: '#8b5cf6' },
        { label: 'Find Internships', desc: 'Browse opportunities', icon: <Briefcase size={22} />, path: '/dashboard/opportunities', accent: '#10b981' },
        { label: 'Documents', desc: 'Manage your files', icon: <FolderOpen size={22} />, path: '/dashboard/documents', accent: '#f59e0b' },
    ];

    return (
        <div className="dashboard-view fade-in">
            {/* Welcome Banner */}
            <div className="student-welcome-banner">
                <div className="welcome-text">
                    <h1>Welcome back, {user?.name || 'Student'} 👋</h1>
                    <p>Track your internship progress and stay on top of your tasks.</p>
                </div>
                <div className="welcome-accent">
                    <GraduationCap size={80} strokeWidth={1} />
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
                {/* Semester Progress + Recent Activity */}
                <div className="data-card large">
                    <div className="card-header">
                        <h3>Semester Progress</h3>
                    </div>

                    <div className="student-progress-section">
                        <div className="premium-progress-ring">
                            <svg width="140" height="140" viewBox="0 0 140 140">
                                <circle cx="70" cy="70" r="64" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                <circle cx="70" cy="70" r="64" fill="none" stroke="#3b82f6" strokeWidth="8"
                                    strokeDasharray="402.12" strokeDashoffset="402.12" strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                            </svg>
                            <div className="progress-ring-text">
                                <span className="percent" style={{ color: '#3b82f6' }}>0%</span>
                                <span className="label">Total</span>
                            </div>
                        </div>

                        {/* Recent Letter Requests */}
                        <div className="student-recent-section">
                            <h4>My Letter Requests</h4>
                            {letterRequests.length > 0 ? (
                                <div className="student-requests-list">
                                    {letterRequests.slice(0, 3).map((r) => (
                                        <div key={r.id} className="student-request-item">
                                            <div className="request-item-info">
                                                <span className="request-company">{r.company}</span>
                                                <span className="request-date">{r.dateSubmitted}</span>
                                            </div>
                                            <span className={`badge ${r.status === 'pending' ? 'warning' : r.status === 'issued' ? 'success' : 'info'}`}>
                                                {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-simple" style={{ padding: '2rem 1rem' }}>
                                    <div className="icon-wrapper-mb">
                                        <Award size={32} />
                                    </div>
                                    <p>No letter requests yet. Start by requesting one!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="timeline-list" style={{ marginTop: '1.5rem' }}>
                        <div className="card-header-sub">
                            <h4>Tasks for the Week</h4>
                        </div>
                        <div className="empty-state-simple">
                            <div className="icon-wrapper-mb">
                                <Award size={32} />
                            </div>
                            <p>You're all caught up! No urgent tasks pending.</p>
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
                            <h3>Core Skills Tracked</h3>
                        </div>
                        <div className="skills-list-premium">
                            <div className="empty-state-simple w-full">
                                <p>Start your first logbook to track skills.</p>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary w-full mt-1"
                            onClick={() => navigate('/dashboard/logbook')}
                        >
                            <BookOpen size={18} />
                            <span>Go to Logbook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
