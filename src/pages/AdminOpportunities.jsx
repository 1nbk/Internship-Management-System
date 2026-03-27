import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Building2, MapPin, Edit, Trash2, CheckCircle2, X } from 'lucide-react';
import Button from '../components/Button';
import { apiService } from '../api/apiService';
import './Dashboards.css';

const AdminOpportunities = () => {
    const [activeTab, setActiveTab] = useState('postings');
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state for creating/editing a posting
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        id: null, title: '', company: '', location: '', type: 'Software Engineering', duration: '', status: 'Open', description: ''
    });

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [oppsData, appsData] = await Promise.all([
                apiService.getOpportunities(),
                apiService.getAllApplications()
            ]);
            
            setOpportunities(oppsData);
            
            // Normalize applications
            const normalizedApps = appsData.map(app => ({
                ...app,
                opportunityTitle: app.opportunity?.title,
                studentName: app.student?.name,
                studentEmail: app.student?.email,
                company: app.opportunity?.company,
                dateApplied: app.dateSubmitted ? new Date(app.dateSubmitted).toLocaleDateString() : '—'
            }));
            setApplications(normalizedApps);
        } catch (err) {
            console.error('Error fetching opportunities data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showNotification = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    // --- Postings Management ---
    const handleSavePosting = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await apiService.updateOpportunity(formData.id, formData);
                showNotification('Internship posting updated successfully.');
            } else {
                await apiService.createOpportunity(formData);
                showNotification('New internship posted successfully.');
            }
            fetchData();
            setShowModal(false);
        } catch (err) {
            console.error('Error saving opportunity:', err);
            showNotification('Failed to save opportunity.');
        }
    };

    const handleDeletePosting = async (id) => {
        if(window.confirm('Are you sure you want to delete this posting?')) {
            try {
                await apiService.deleteOpportunity(id);
                fetchData();
                showNotification('Posting deleted.');
            } catch (err) {
                console.error('Error deleting opportunity:', err);
                showNotification('Failed to delete posting.');
            }
        }
    };

    const openCreateModal = () => {
        setFormData({ id: null, title: '', company: '', location: '', type: 'Software Engineering', duration: '', status: 'Open', description: '' });
        setShowModal(true);
    };

    const openEditModal = (opp) => {
        setFormData(opp);
        setShowModal(true);
    };

    // --- Applications Management ---
    const handleApproveApplication = async (app) => {
        try {
            // Mark application as approved in backend
            await apiService.updateApplicationStatus(app.id, 'APPROVED');

            // Auto-generate an internship letter for this student on the backend
            // Since we don't have a direct "auto-generate" endpoint, we can use createLetterRequest
            // but we need to match the backend expectation.
            await apiService.createLetterRequest({
                studentId: app.studentId,
                company: app.company,
                companyAddress: 'Internal Placement', // Placeholder
                startDate: 'TBD',
                endDate: 'TBD',
                reason: `Accepted for ${app.opportunityTitle} role`,
            });

            fetchData();
            showNotification(`${app.studentName}'s application approved. Internship Letter issued automatically.`);
        } catch (err) {
            console.error('Error approving application:', err);
            showNotification('Failed to approve application.');
        }
    };

    const handleRejectApplication = async (id) => {
        if(window.confirm('Reject this application?')) {
            try {
                await apiService.updateApplicationStatus(id, 'REJECTED');
                fetchData();
                showNotification('Application rejected.');
            } catch (err) {
                console.error('Error rejecting application:', err);
                showNotification('Failed to reject application.');
            }
        }
    };

    const filteredOpps = opportunities.filter(o => 
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApps = applications.filter(a => 
        a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Manage Internships</h1>
                    <p>Post internship opportunities and review student applications.</p>
                </div>
                {activeTab === 'postings' && (
                    <Button onClick={openCreateModal}>
                        <Plus size={18} /> Post New Role
                    </Button>
                )}
            </div>

            <div className="data-card">
                <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div className="tab-group">
                        <button className={`tab ${activeTab === 'postings' ? 'active' : ''}`} onClick={() => setActiveTab('postings')}>
                            Job Postings <span className="count">{opportunities.length}</span>
                        </button>
                        <button className={`tab ${activeTab === 'apps' ? 'active' : ''}`} onClick={() => setActiveTab('apps')}>
                            Applications <span className="count">{applications.filter(a => a.status === 'pending').length} New</span>
                        </button>
                    </div>
                </div>

                <div className="card-filters">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder={activeTab === 'postings' ? "Search roles or companies..." : "Search students or companies..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {activeTab === 'postings' ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Role Title</th>
                                    <th>Company</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOpps.length > 0 ? filteredOpps.map(opp => (
                                    <tr key={opp.id}>
                                        <td style={{ fontWeight: '600' }}>{opp.title}</td>
                                        <td>
                                            <div className="company-cell"><Building2 size={16} /> {opp.company}</div>
                                        </td>
                                        <td>{opp.location}</td>
                                        <td>{opp.type}</td>
                                        <td>
                                            <span className={`badge ${opp.status === 'Open' ? 'success' : opp.status === 'Urgent' ? 'warning' : 'info'}`}>
                                                {opp.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="icon-btn-sm" onClick={() => openEditModal(opp)} title="Edit"><Edit size={16} /></button>
                                                <button className="icon-btn-sm" onClick={() => handleDeletePosting(opp.id)} title="Delete" style={{ color: 'var(--error)' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="empty-table-cell">No postings found. Create one.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Role Applied For</th>
                                    <th>Company</th>
                                    <th>Date Applied</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.length > 0 ? filteredApps.map(app => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-sm">{app.studentName?.charAt(0) || 'S'}</div>
                                                <div className="user-meta">
                                                    <span className="name">{app.studentName}</span>
                                                    <span className="role-tag">{app.studentEmail}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>{app.opportunityTitle}</td>
                                        <td><div className="company-cell"><Building2 size={16} /> {app.company}</div></td>
                                        <td>{app.dateApplied}</td>
                                        <td>
                                            <span className={`badge ${app.status === 'pending' ? 'warning' : app.status === 'approved' ? 'success' : 'danger'}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            {app.status === 'pending' ? (
                                                <div className="approval-actions">
                                                    <button className="approve-btn" title="Approve & Issue Letter" onClick={() => handleApproveApplication(app)}><CheckCircle2 size={16} /></button>
                                                    <button className="reject-btn" title="Reject" onClick={() => handleRejectApplication(app.id)}><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Reviewed</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="empty-table-cell">No applications yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Posting Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{formData.id ? 'Edit Internship Role' : 'Post New Internship'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSavePosting}>
                            <div className="modal-body">
                                <div className="form-group-dash">
                                    <label>Role Title</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Frontend Engineer Intern" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group-dash">
                                        <label>Company</label>
                                        <input type="text" required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                                    </div>
                                    <div className="form-group-dash">
                                        <label>Location</label>
                                        <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group-dash">
                                        <label>Category</label>
                                        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                            <option value="Software Engineering">Software Engineering</option>
                                            <option value="Design">Design</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group-dash">
                                        <label>Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                            <option value="Open">Open</option>
                                            <option value="Urgent">Urgent</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group-dash" style={{ marginBottom: 0 }}>
                                    <label>Description & Requirements</label>
                                    <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="What will the intern do?"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Posting</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && (
                <div className="toast-notification">
                    <CheckCircle2 size={18} /><span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default AdminOpportunities;
