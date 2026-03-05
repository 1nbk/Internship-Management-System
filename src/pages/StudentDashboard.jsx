import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, TrendingUp, Clock, Send, FileText, Layout, BookOpen, ChevronRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboards.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { label: 'Weeks Completed', value: '0/12', icon: <Calendar size={24} />, color: 'blue' },
        { label: 'Reports Approved', value: '0', icon: <CheckCircle2 size={24} />, color: 'green' },
        { label: 'Submission Streak', value: '0 weeks', icon: <TrendingUp size={24} />, color: 'purple' },
        { label: 'Days Remaining', value: '--', icon: <Clock size={24} />, color: 'orange' },
    ]);

    const quickActions = [
        { label: 'Logbook', icon: <BookOpen size={20} />, path: '/dashboard/logbook' },
        { label: 'Request Letter', icon: <Send size={20} />, path: '/dashboard/student/letters' },
        { label: 'Documents', icon: <FileText size={20} />, path: '/dashboard/documents' },
    ];

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>My Internship Portal</h1>
                    <p>Welcome back! Here's an overview of your progress and tasks.</p>
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
                <div className="data-card large">
                    <div className="card-header">
                        <h3>Semester Progress</h3>
                    </div>

                    <div className="premium-progress-ring">
                        <svg width="140" height="140" viewBox="0 0 140 140">
                            <circle cx="70" cy="70" r="64" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle cx="70" cy="70" r="64" fill="none" stroke="var(--primary)" strokeWidth="8"
                                strokeDasharray="402.12" strokeDashoffset="402.12" strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                            />
                        </svg>
                        <div className="progress-ring-text">
                            <span className="percent">0%</span>
                            <span className="label">Total</span>
                        </div>
                    </div>

                    <div className="timeline-list">
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

                <div className="data-card small">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, i) => (
                            <div key={i} className="quick-action-card" onClick={() => navigate(action.path)}>
                                <div className="action-icon">
                                    {action.icon}
                                </div>
                                <span>{action.label}</span>
                            </div>
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
