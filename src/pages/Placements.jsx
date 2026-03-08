import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, MoreVertical, Building2, User, Calendar, CheckCircle2, Clock, AlertCircle, X, Shield, FileText } from 'lucide-react';
import Button from '../components/Button';
import './Dashboards.css';

const SEED_PLACEMENTS = [
    { id: 1, student: 'Alice Student', company: 'TechNova Solutions', supervisor: 'Dr. Sarah Smith', startDate: '2026-02-15', status: 'active', department: 'CS', feedback: 'Excellent progress on the frontend module. Shows strong initiative.' },
    { id: 2, student: 'Bob Kamau', company: 'DataSync Labs', supervisor: 'Prof. James Bond', startDate: '2026-01-20', status: 'active', department: 'IT', feedback: 'Good analytical skills. Needs to improve time management.' },
    { id: 3, student: 'Claire Wanjiku', company: 'Green Energy Corp', supervisor: 'Dr. Sarah Smith', startDate: '2026-03-01', status: 'pending', department: 'ENG', feedback: 'Awaiting initial supervisor review.' },
    { id: 4, student: 'David Omondi', company: 'FinTech Global', supervisor: 'Prof. James Bond', startDate: '2025-09-10', status: 'completed', department: 'CS', feedback: 'Successfully completed all deliverables. Recommend for full-time hiring.' },
    { id: 5, student: 'Eve Nyambura', company: 'CloudBase Inc.', supervisor: 'Dr. Sarah Smith', startDate: '2026-02-28', status: 'active', department: 'CS', feedback: 'Adapting well to Agile workflows. Strong team player.' },
];

const Placements = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [placements, setPlacements] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('ims_placements') || '[]');
        if (saved.length === 0) {
            localStorage.setItem('ims_placements', JSON.stringify(SEED_PLACEMENTS));
            setPlacements(SEED_PLACEMENTS);
        } else {
            setPlacements(saved);
        }
    }, []);

    const handleUpdateStatus = (id, newStatus) => {
        const updated = placements.map(p => p.id === id ? { ...p, status: newStatus } : p);
        setPlacements(updated);
        localStorage.setItem('ims_placements', JSON.stringify(updated));
        if (selectedPlacement && selectedPlacement.id === id) {
            setSelectedPlacement({ ...selectedPlacement, status: newStatus });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return 'badge success';
            case 'pending': return 'badge warning';
            case 'completed': return 'badge info';
            default: return 'badge';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <Clock size={14} />;
            case 'pending': return <AlertCircle size={14} />;
            case 'completed': return <CheckCircle2 size={14} />;
            default: return null;
        }
    };

    const filteredPlacements = placements.filter(p =>
        p.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = placements.filter(p => p.status === 'active').length;
    const pendingCount = placements.filter(p => p.status === 'pending').length;
    const completedCount = placements.filter(p => p.status === 'completed').length;

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Placement Management</h1>
                    <p>Track and oversee all active student internships globally.</p>
                </div>
                <div className="placement-header-stats">
                    <div className="ph-stat"><span className="ph-val" style={{ color: '#10b981' }}>{activeCount}</span><span className="ph-label">Active</span></div>
                    <div className="ph-stat"><span className="ph-val" style={{ color: '#f59e0b' }}>{pendingCount}</span><span className="ph-label">Pending</span></div>
                    <div className="ph-stat"><span className="ph-val" style={{ color: '#3b82f6' }}>{completedCount}</span><span className="ph-label">Done</span></div>
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
                                <th>Placement Entity</th>
                                <th>Assigned Supervisor</th>
                                <th>Duration / Start</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlacements.length > 0 ? (
                                filteredPlacements.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-sm">{p.student.charAt(0)}</div>
                                                <span>{p.student}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="company-cell">
                                                <Building2 size={16} />
                                                <span>{p.company}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="supervisor-cell">
                                                <User size={16} />
                                                <span>{p.supervisor}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <Calendar size={16} />
                                                <span>{p.startDate}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getStatusStyle(p.status)}>
                                                {getStatusIcon(p.status)}
                                                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="icon-btn-sm"
                                                    title="View Details"
                                                    onClick={() => setSelectedPlacement(p)}
                                                >
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button className="icon-btn-sm">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-table-cell">
                                        <div className="empty-state-simple">
                                            No placements found.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Placement Detail Modal */}
            {selectedPlacement && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header">
                            <h3>Placement Details</h3>
                            <button className="close-btn" onClick={() => setSelectedPlacement(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="placement-details-grid">
                                <div className="detail-main">
                                    <div className="info-section">
                                        <label>Student Information</label>
                                        <div className="info-card">
                                            <div className="avatar-lg">{selectedPlacement.student.charAt(0)}</div>
                                            <div className="info-meta">
                                                <h4>{selectedPlacement.student}</h4>
                                                <span>{selectedPlacement.department}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-section">
                                        <label>Latest Supervisor Feedback</label>
                                        <p className="feedback-text">"{selectedPlacement.feedback}"</p>
                                    </div>
                                </div>

                                <div className="detail-sidebar">
                                    <div className="detail-item">
                                        <Building2 size={18} />
                                        <div>
                                            <label>Company</label>
                                            <span>{selectedPlacement.company}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <User size={18} />
                                        <div>
                                            <label>Supervisor</label>
                                            <span>{selectedPlacement.supervisor}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <Calendar size={18} />
                                        <div>
                                            <label>Start Date</label>
                                            <span>{selectedPlacement.startDate}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <Shield size={18} />
                                        <div>
                                            <label>Current Status</label>
                                            <span className={getStatusStyle(selectedPlacement.status)}>
                                                {selectedPlacement.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="footer-actions-left">
                                <select
                                    className="status-select"
                                    value={selectedPlacement.status}
                                    onChange={(e) => handleUpdateStatus(selectedPlacement.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <Button onClick={() => setSelectedPlacement(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Placements;
