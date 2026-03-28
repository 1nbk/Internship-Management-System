import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, TrendingUp, Clock, Send, FileText, BookOpen, ArrowRight, Award, Briefcase, FolderOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api/apiService';
import './Dashboards.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [letterRequests, setLetterRequests] = useState([]);
    const [hasStarted, setHasStarted] = useState(false);

    const [loading, setLoading] = useState(true);
    const [myLogs, setMyLogs] = useState([]);
    
    const fetchData = async () => {
        try {
            setLoading(true);
            const [lettersData, logsData] = await Promise.all([
                apiService.getMyLetterRequests(),
                apiService.getMyLogs()
            ]);
            
            // Normalize statuses to lowercase for UI consistency
            const normalizedLetters = lettersData.map(r => ({
                ...r,
                status: r.status?.toLowerCase(),
                dateSubmitted: r.dateSubmitted ? new Date(r.dateSubmitted).toLocaleDateString() : ''
            }));
            
            setLetterRequests(normalizedLetters);
            setHasStarted(user?.internshipStarted || false);
        } catch (err) {
            console.error('Error fetching student dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchData();
            apiService.getMyLogs().then(setMyLogs).catch(console.error);
        }
    }, [user?.id]);

    const handleStartInternship = async () => {
        try {
            await apiService.updateProfile({ internshipStarted: true });
            
            // Update local user state if necessary, or just rely on re-fetch/context
            const updatedUser = { ...user, internshipStarted: true };
            localStorage.setItem('ims_user', JSON.stringify(updatedUser)); // Auth context relies on this
            setHasStarted(true);
        } catch (err) {
            console.error('Error starting internship:', err);
        }
    };

    const activeInternship = letterRequests.sort((a,b) => b.id - a.id).find(r => r.status === 'issued' || r.status === 'approved') || letterRequests[0];

    let weeksCompleted = 0;
    let totalWeeks = 12;
    let daysRemaining = '--';
    let progressPercentage = 0;

    if (activeInternship && activeInternship.startDate && activeInternship.endDate) {
        const start = new Date(activeInternship.startDate);
        const end = new Date(activeInternship.endDate);
        const now = new Date();

        if (end > start) {
            const totalMs = end - start;
            const elapsedMs = Math.max(0, now - start);
            
            totalWeeks = Math.max(1, Math.ceil(totalMs / (1000 * 60 * 60 * 24 * 7)));

            if (now < start) {
                weeksCompleted = 0;
                progressPercentage = 0;
                daysRemaining = Math.ceil((start - now) / (1000 * 60 * 60 * 24)) + ' (until start)';
            } else if (now >= end) {
                weeksCompleted = totalWeeks;
                progressPercentage = 100;
                daysRemaining = '0';
            } else {
                weeksCompleted = Math.floor(elapsedMs / (1000 * 60 * 60 * 24 * 7));
                progressPercentage = Math.round((elapsedMs / totalMs) * 100);
                daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24)).toString();
            }
        }
    }

    const approvedReports = myLogs.filter(log => log.status?.toLowerCase() === 'approved').length;

    const stats = [
        { label: 'Weeks Completed', value: `${weeksCompleted}/${totalWeeks}`, icon: <Calendar size={24} />, color: 'blue' },
        { label: 'Reports Approved', value: String(approvedReports), icon: <CheckCircle2 size={24} />, color: 'green' },
        { label: 'Submission Streak', value: `${myLogs.length > 0 ? myLogs.length : 0} weeks`, icon: <TrendingUp size={24} />, color: 'purple' },
        { label: 'Days Remaining', value: daysRemaining, icon: <Clock size={24} />, color: 'orange' },
    ];

    const quickActions = [
        { label: 'Weekly Logbook', desc: 'Submit your weekly entry', icon: <BookOpen size={22} />, path: '/dashboard/logbook', accent: '#3b82f6' },
        { label: 'Request Letter', desc: 'Apply for internship letter', icon: <Send size={22} />, path: '/dashboard/letter-request', accent: '#8b5cf6' },
        { label: 'Find Internships', desc: 'Browse opportunities', icon: <Briefcase size={22} />, path: '/dashboard/opportunities', accent: '#10b981' },
        { label: 'Documents', desc: 'Manage your files', icon: <FolderOpen size={22} />, path: '/dashboard/documents', accent: '#f59e0b' },
    ];

    const issuedLetter = letterRequests.find(r => r.status === 'issued');

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

            {/* Issued Letters Banner */}
            {issuedLetter && (
                <div className="alert-success fade-in" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--success)', color: '#fff', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={22} />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--success)', marginBottom: '0.3rem', fontSize: '1.05rem' }}>Your Internship Letter is Ready!</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>The admin has approved your request for <strong>{issuedLetter.company}</strong>.</p>
                        </div>
                    </div>
                    {hasStarted ? (
                        <button className="btn" style={{ background: 'transparent', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.6rem 1.25rem', borderRadius: '2rem', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate('/dashboard/documents')}>
                            <FileText size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                            View Document
                        </button>
                    ) : (
                        <button className="btn" style={{ background: 'var(--success)', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '2rem', cursor: 'pointer', fontWeight: '500', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }} onClick={handleStartInternship}>
                            <Briefcase size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                            Start Internship
                        </button>
                    )}
                </div>
            )}

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
                                    strokeDasharray="402.12" strokeDashoffset={402.12 - (402.12 * progressPercentage) / 100} strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                            </svg>
                            <div className="progress-ring-text">
                                <span className="percent" style={{ color: '#3b82f6' }}>{progressPercentage}%</span>
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
                            {myLogs.length > 0 && myLogs.some(l => l.skills && l.skills.length > 0) ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    {[...new Set(myLogs.flatMap(l => l.skills || []))].slice(0, 8).map((skill, i) => (
                                        <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.3rem 0.6rem', borderRadius: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-simple w-full">
                                    <p>Start your first logbook to track skills.</p>
                                </div>
                            )}
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
