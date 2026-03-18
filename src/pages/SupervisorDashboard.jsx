import React, { useState, useEffect } from 'react';
import { Users, FileText, Clock, AlertCircle, ArrowRight, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Dashboards.css';

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const [myInterns, setMyInterns] = useState([]);
    const [allReports, setAllReports] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('ims_users') || '[]');
        const interns = users.filter(u => u.role === 'student' && u.supervisorId == user?.id);
        setMyInterns(interns);

        const logs = JSON.parse(localStorage.getItem('ims_logbooks') || '[]');
        const myLogs = logs.filter(log => log.supervisorId == user?.id).sort((a,b) => b.id - a.id);
        setAllReports(myLogs);
    }, [user?.id]);

    const pendingReports = allReports.filter(r => r.status === 'pending');
    const approvedReports = allReports.filter(r => r.status === 'approved');

    const stats = [
        { label: 'Active Interns', value: String(myInterns.length), icon: <Users size={24} />, color: 'blue' },
        { label: 'Pending Reports', value: String(pendingReports.length), icon: <Clock size={24} />, color: 'orange' },
        { label: 'Total Approved', value: String(approvedReports.length), icon: <FileText size={24} />, color: 'green' },
        { label: 'Urgent Reviews', value: String(pendingReports.filter(r => (new Date() - new Date(r.date)) > 3 * 24*60*60*1000).length), icon: <AlertCircle size={24} />, color: 'red' },
    ];

    const openReview = (report) => {
        setSelectedReport(report);
        setFeedback(report.feedback || '');
        setShowReviewModal(true);
    };

    const handleReviewSubmit = (e, status) => {
        e.preventDefault();
        const updatedReport = { ...selectedReport, status, feedback };
        
        const logs = JSON.parse(localStorage.getItem('ims_logbooks') || '[]');
        const updatedLogs = logs.map(l => l.id === selectedReport.id ? updatedReport : l);
        localStorage.setItem('ims_logbooks', JSON.stringify(updatedLogs));
        
        setAllReports(updatedLogs.filter(log => log.supervisorId == user?.id).sort((a,b) => b.id - a.id));
        setShowReviewModal(false);
        setSelectedReport(null);
        setFeedback('');
    };

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h1>Supervisor Overview</h1>
                    <p>Welcome back, {user?.name}. Monitor your assigned students and grade logbooks.</p>
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
                        <h3>Pending Reports</h3>
                        <span className="badge warning" style={{ padding: '0.2rem 0.6rem' }}>{pendingReports.length} to review</span>
                    </div>
                    <div className="reports-list">
                        {pendingReports.length > 0 ? (
                            pendingReports.map((r) => (
                                <div key={r.id} className="report-item" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="report-main" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div className="avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {r.studentName?.charAt(0) || 'S'}
                                        </div>
                                        <div className="report-details">
                                            <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-main)' }}>Week {r.week} Report - {r.studentName}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Submitted: {r.date} • {r.program}</p>
                                        </div>
                                    </div>
                                    <div className="report-actions">
                                        <Button variant="outline" size="sm" onClick={() => openReview(r)}>
                                            <MessageSquare size={16} /> Review
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple" style={{ padding: '3rem 1rem' }}>
                                <div className="icon-wrapper-mb" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                    <Clock size={32} />
                                </div>
                                <p>You're all caught up! No reports pending review.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="data-card small">
                    <div className="card-header">
                        <h3>My Interns</h3>
                    </div>
                    <div className="interns-compact">
                        {myInterns.length > 0 ? (
                            myInterns.map((intern) => (
                                <div key={intern.id} className="intern-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', borderBottom: '1px solid var(--border)' }}>
                                    <div className="mini-avatar" style={{ width: '32px', height: '32px', background: 'var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {intern.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="intern-name" style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-main)' }}>{intern.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{intern.program}</div>
                                    </div>
                                    <div className="intern-status" style={{ width: '8px', height: '8px', borderRadius: '50%', background: intern.internshipStarted ? 'var(--success)' : 'var(--warning)' }}></div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple">
                                <p>No interns currently assigned to you.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedReport && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Review Week {selectedReport.week} Report</h3>
                            <button className="close-btn" onClick={() => setShowReviewModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tasks Performed</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{selectedReport.content}</p>
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Skills Acquired</h4>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {selectedReport.skills?.map((skill, i) => (
                                        <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.6rem', borderRadius: '1rem' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Supervisor Feedback</label>
                                <textarea 
                                    rows="4" 
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide constructive feedback..."
                                />
                            </div>
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={(e) => handleReviewSubmit(e, 'rejected')}>
                                <XCircle size={16} /> Needs Revision
                            </Button>
                            <Button style={{ background: 'var(--success)' }} onClick={(e) => handleReviewSubmit(e, 'approved')}>
                                Approve Report <CheckCircle size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisorDashboard;
