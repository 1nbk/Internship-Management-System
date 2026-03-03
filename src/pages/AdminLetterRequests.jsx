import React, { useState } from 'react';
import { FileText, User, Building2, Calendar, Mail, CheckCircle2, MoreVertical, Search, ExternalLink, X, Send } from 'lucide-react';
import Button from '../components/Button';
import './Dashboards.css';

const AdminLetterRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requests, setRequests] = useState([
        { id: 1, student: 'Alice Johnson', company: 'TechNova Solutions', supervisor: 'Dr. Robert Smith', date: '2024-03-01', status: 'pending', reason: 'New Placement', notes: 'Please send as soon as possible.' },
        { id: 2, student: 'Michael Chen', company: 'GreenEnergy Corp', supervisor: 'Sarah Wilson', date: '2024-03-02', status: 'pending', reason: 'Extension', notes: 'Need this for my visa renewal.' },
        { id: 3, student: 'Emma Davis', company: 'Global Finance', supervisor: 'James Miller', date: '2024-02-28', status: 'finished', reason: 'New Placement', notes: '' },
    ]);

    const handleApprove = (id) => {
        setRequests(requests.map(req =>
            req.id === id ? { ...req, status: 'finished' } : req
        ));
        setSelectedRequest(null);
        // Mock notification logic
        alert('Letter approved and sent to student! Supervisor notified.');
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'badge warning';
            case 'finished': return 'badge success';
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
                                <th>Requested On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar-sm">{r.student.charAt(0)}</div>
                                            <span>{r.student}</span>
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
                                                disabled={r.status === 'finished'}
                                            >
                                                <ExternalLink size={16} />
                                                <span>Review</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                            <Button onClick={() => handleApprove(selectedRequest.id)}>
                                Approve & Send Letter <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLetterRequests;
