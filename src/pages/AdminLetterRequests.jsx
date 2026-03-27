import React, { useState } from 'react';
import { FileText, User, Building2, Calendar, Mail, CheckCircle2, MoreVertical, Search, ExternalLink, X, Send } from 'lucide-react';
import Button from '../components/Button';
import { apiService } from '../api/apiService';
import './Dashboards.css';

const AdminLetterRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requests, setRequests] = useState([]);
    const [toast, setToast] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await apiService.getLetterRequests();
            // Normalize status to lowercase for consistency with UI styles
            const normalized = data.map(r => ({
                ...r,
                status: r.status?.toLowerCase() || 'pending',
                date: r.dateSubmitted ? new Date(r.dateSubmitted).toLocaleDateString() : '—',
                studentName: r.student?.name || 'Unknown'
            }));
            setRequests(normalized);
        } catch (err) {
            console.error('Error fetching letter requests:', err);
            setError('Failed to load requests.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (req) => {
        try {
            // Backend expects uppercase status based on Prisma Enum
            await apiService.updateLetterStatus(req.id, 'ISSUED');
            
            // Re-fetch to get updated list
            fetchRequests();
            
            setSelectedRequest(null);
            setToast(`Letter approved! A confirmation has been sent to ${req.email || 'the student\'s email'}.`);
            setTimeout(() => setToast(null), 4000);
        } catch (err) {
            console.error('Error approving letter:', err);
            setToast('Failed to approve letter.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'badge warning';
            case 'reviewing': return 'badge info';
            case 'approved':
            case 'issued': return 'badge success';
            default: return 'badge';
        }
    };

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Internship Letter Requests</h1>
                    <p>Review and manage official internship letter requests from students.</p>
                </div>
                <div className="stats-mini-row">
                    <div className="mini-stat">
                        <span className="label">Total Pending</span>
                        <span className="value text-orange-500">{requests.filter(r => r.status === 'pending').length}</span>
                    </div>
                </div>
            </div>

            <div className="data-card">
                <div className="card-filters">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search students, companies, or supervisors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="placement-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Reason</th>
                                <th>Target Company</th>
                                <th>Email</th>
                                <th>Requested On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((r) => (
                                    <tr key={r.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-sm">{r.studentName?.charAt(0) || 'S'}</div>
                                                <span>{r.studentName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td>{r.reason}</td>
                                        <td>
                                            <div className="company-cell">
                                                <Building2 size={16} />
                                                <span>{r.company}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="email-cell">
                                                <Mail size={16} />
                                                <span>{r.email || '—'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <Calendar size={16} />
                                                <span>{r.date}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getStatusStyle(r.status)}>
                                                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="btn-icon-text"
                                                    onClick={() => setSelectedRequest(r)}
                                                    disabled={r.status === 'issued'}
                                                >
                                                    <ExternalLink size={16} />
                                                    <span>Review</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="empty-table-cell">
                                        <div className="empty-state-simple">
                                            No pending letter requests.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Detail Modal */}
            {selectedRequest && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Request Summary</h3>
                            <button className="close-btn" onClick={() => setSelectedRequest(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <label>Student Details</label>
                                <div className="detail-value">
                                    <User size={16} /> {selectedRequest.student}
                                </div>
                            </div>
                            <div className="detail-section">
                                <label>Student Email</label>
                                <div className="detail-value">
                                    <Mail size={16} /> {selectedRequest.email || 'Not provided'}
                                </div>
                            </div>
                            <div className="detail-section">
                                <label>Target Company</label>
                                <div className="detail-value">
                                    <Building2 size={16} /> {selectedRequest.company}
                                </div>
                            </div>
                            <div className="detail-section">
                                <label>Reason for Letter</label>
                                <div className="detail-value">{selectedRequest.reason}</div>
                            </div>
                            <div className="detail-section">
                                <label>Supervisor to Notify</label>
                                <div className="detail-value">{selectedRequest.supervisor}</div>
                            </div>
                            {selectedRequest.notes && (
                                <div className="detail-section">
                                    <label>Additional Notes</label>
                                    <p className="detail-notes">{selectedRequest.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                            <Button onClick={() => handleApprove(selectedRequest)}>
                                Approve & Send Letter <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="toast-notification">
                    <CheckCircle2 size={18} />
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default AdminLetterRequests;
