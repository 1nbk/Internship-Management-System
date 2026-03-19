import React, { useState, useEffect } from 'react';
import { Users, FileText, Clock, AlertCircle, CheckCircle, XCircle, ChevronRight, X } from 'lucide-react';
import { apiService } from '../api/apiService';
import Button from '../components/Button';
import './Dashboards.css';

const SupervisorDashboard = () => {
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
            const pending = logsData.filter(l => l.status === 'PENDING').map(l => ({
                ...l,
                status: l.status.toLowerCase(),
                student: l.student?.name || 'Unknown',
                time: new Date(l.createdAt).toLocaleDateString(),
                program: l.student?.program || 'N/A'
            }));
            setPendingReports(pending);

            const uniqueInterns = Array.from(new Set(logsData.map(l => l.studentId))).map(id => {
                const log = logsData.find(l => l.studentId === id);
                return { id, name: log.student?.name };
            });
            setMyInterns(uniqueInterns);

            setStats([
                { label: 'Active Interns', value: uniqueInterns.length.toString(), icon: <Users size={24} />, color: 'blue' },
                { label: 'Pending Reports', value: pending.length.toString(), icon: <Clock size={24} />, color: 'orange' },
                { label: 'Approved Logs', value: logsData.filter(l => l.status === 'APPROVED').length.toString(), icon: <FileText size={24} />, color: 'green' },
                { label: 'Rejected Logs', value: logsData.filter(l => l.status === 'REJECTED').length.toString(), icon: <AlertCircle size={24} />, color: 'red' },
            ]);
        } catch (err) {
            console.error('Error fetching supervisor data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
        <div className="dashboard-view">
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
                        <button className="text-btn">View All</button>
                    </div>
                    <div className="reports-list">
                        {pendingReports.length > 0 ? (
                            pendingReports.map((r) => (
                                <div key={r.id} className="report-item">
                                    <div className="report-main">
                                        <div className="user-dot"></div>
                                        <div className="report-details">
                                            <h4>Week {r.week} - {r.student}</h4>
                                            <p>Submitted {r.time} • {r.program}</p>
                                        </div>
                                    </div>
                                    <div className="report-actions">
                                        <button 
                                            className="btn-sm btn-outline"
                                            onClick={() => setSelectedReport(r)}
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple">
                                No reports pending review.
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
                                <div key={intern.id} className="intern-row">
                                    <div className="mini-avatar">{intern.name.charAt(0)}</div>
                                    <div className="intern-name">{intern.name}</div>
                                    <div className="intern-status online"></div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple">
                                No interns assigned currently.
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
                            <div className="review-context">
                                <strong>Student:</strong> {selectedReport.student} <br />
                                <strong>Date Submitted:</strong> {selectedReport.time}
                            </div>
                            <div className="review-content-box">
                                <label>Report Content:</label>
                                <p>{selectedReport.content}</p>
                            </div>
                            <div className="review-skills">
                                <label>Skills Applied:</label>
                                <div className="skills-tags">
                                    {selectedReport.skills?.map((s, i) => (
                                        <span key={i} className="skill-tag">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group-dash" style={{ marginTop: '1.5rem' }}>
                                <label>Supervisor Feedback</label>
                                <textarea 
                                    rows={3} 
                                    placeholder="Add constructive feedback..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button 
                                variant="danger" 
                                onClick={() => handleUpdateStatus('REJECTED')}
                                className="mr-auto"
                            >
                                <XCircle size={18} /> Reject
                            </Button>
                            <Button 
                                onClick={() => handleUpdateStatus('APPROVED')}
                            >
                                <CheckCircle size={18} /> Approve & Log
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisorDashboard;
