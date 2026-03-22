import React, { useState, useEffect } from 'react';
import { Users, FileText, Clock, AlertCircle, CheckCircle, XCircle, ChevronRight, X, MessageSquare } from 'lucide-react';
import { apiService } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Dashboards.css';

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const [pendingReports, setPendingReports] = useState([]);
    const [myInterns, setMyInterns] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [feedback, setFeedback] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const logsData = await apiService.getInternsLogs();
            
            // Map logs to UI format
            const reports = logsData.map(l => ({
                ...l,
                id: l.id,
                week: l.week || '?',
                studentName: l.student?.name || 'Unknown',
                program: l.student?.program || 'N/A',
                date: new Date(l.createdAt).toLocaleDateString(),
                status: (l.status || 'PENDING').toLowerCase(),
                content: l.content || '',
                skills: l.skills || []
            }));

            const pending = reports.filter(r => r.status === 'pending');
            setPendingReports(pending);

            // Get unique interns
            const internsMap = {};
            reports.forEach(r => {
                if (r.studentId && !internsMap[r.studentId]) {
                    internsMap[r.studentId] = {
                        id: r.studentId,
                        name: r.studentName,
                        program: r.program
                    };
                }
            });
            setMyInterns(Object.values(internsMap));

            setStats([
                { label: 'Active Interns', value: Object.keys(internsMap).length.toString(), icon: <Users size={24} />, color: 'blue' },
                { label: 'Pending Reports', value: pending.length.toString(), icon: <Clock size={24} />, color: 'orange' },
                { label: 'Approved Logs', value: reports.filter(r => r.status === 'approved').length.toString(), icon: <FileText size={24} />, color: 'green' },
                { label: 'Rejected Logs', value: reports.filter(r => r.status === 'rejected' || r.status === 'revision').length.toString(), icon: <AlertCircle size={24} />, color: 'red' },
            ]);
        } catch (err) {
            console.error('Error fetching supervisor data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleUpdateStatus = async (status) => {
        try {
            await apiService.updateLogStatus(selectedReport.id, status, feedback);
            setSelectedReport(null);
            setFeedback('');
            fetchData();
        } catch (err) {
            console.error('Error updating log status:', err);
        }
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
                                <div key={r.id} className="report-item">
                                    <div className="report-main">
                                        <div className="avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {r.studentName?.charAt(0) || 'S'}
                                        </div>
                                        <div className="report-details">
                                            <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-main)' }}>Week {r.week} Report - {r.studentName}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Submitted: {r.date} • {r.program}</p>
                                        </div>
                                    </div>
                                    <div className="report-actions">
                                        <Button variant="outline" size="sm" onClick={() => {
                                            setSelectedReport(r);
                                            setFeedback(r.feedback || '');
                                        }}>
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
                                    <div className="intern-status online"></div>
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
            {selectedReport && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Review Week {selectedReport.week} Report</h3>
                            <button className="close-btn" onClick={() => setSelectedReport(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tasks Performed</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{selectedReport.content}</p>
                            </div>
                            
                            {selectedReport.skills && selectedReport.skills.length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Skills Acquired</h4>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        {selectedReport.skills.map((skill, i) => (
                                            <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.6rem', borderRadius: '1rem' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                            <Button variant="outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleUpdateStatus('REJECTED')}>
                                <XCircle size={16} /> Needs Revision
                            </Button>
                            <Button style={{ background: 'var(--success)' }} onClick={() => handleUpdateStatus('APPROVED')}>
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
