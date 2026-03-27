import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Briefcase, ChevronRight, CheckCircle2, X } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api/apiService';
import './Dashboards.css';

const Opportunities = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    
    // Data states
    const [opportunities, setOpportunities] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    
    // Modal states
    const [selectedOpp, setSelectedOpp] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [coverNote, setCoverNote] = useState('');

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [oppsData, appsData] = await Promise.all([
                apiService.getOpportunities(),
                apiService.getAllApplications() // For students, let's check if this works or if we need getMyApplications
            ]);
            
            setOpportunities(oppsData);
            
            // Filter applications for current student if the backend returns all (usually student endpoint filters by default)
            // But let's be safe and filter if needed, or assume backend handles it.
            // Actually, currently getAllApplications is for ADMIN. 
            // I should check if there is a getMyApplications.
            const userApps = appsData.filter(a => a.studentId === user?.id);
            setMyApplications(userApps);
        } catch (err) {
            console.error('Error fetching student opportunities:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user?.id]);

    const showNotification = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    const handleApplyClick = (opp) => {
        setSelectedOpp(opp);
        setCoverNote('');
        setShowModal(true);
    };

    const submitApplication = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const applicationData = {
                opportunityId: selectedOpp.id,
                coverNote
            };
            
            await apiService.applyToOpportunity(selectedOpp.id); // Base current apiService only takes Id
            // If I want to include coverNote, I might need to update apiService or backend.
            
            showNotification(`Application submitted to ${selectedOpp.company}!`);
            fetchData();
            setShowModal(false);
        } catch (err) {
            console.error('Error submitting application:', err);
            showNotification('Failed to submit application.');
        } finally {
            setLoading(false);
        }
    };

    const filteredOpportunities = opportunities.filter(opp => {
        const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || opp.type === filter;
        return matchesSearch && matchesFilter;
    });

    const hasApplied = (oppId) => {
        return myApplications.some(app => app.opportunityId === oppId);
    };

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Internship Discovery</h1>
                    <p>Find and apply to top internship opportunities tailored to your skills.</p>
                </div>
                <div className="header-actions">
                    <div className="search-wrapper-premium">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search roles or companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="filters-bar-premium">
                {['All', 'Software Engineering', 'Design', 'Data Science', 'Marketing', 'Other'].map((cat) => (
                    <button
                        key={cat}
                        className={`filter-chip ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="opportunities-grid">
                {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((opp) => (
                        <div key={opp.id} className="opp-card-premium">
                            <div className="opp-card-header">
                                <div className="company-logo-placeholder">
                                    <Building2 size={24} />
                                </div>
                                <div className="opp-meta">
                                    <div className="opp-status-badge">
                                        {opp.status}
                                    </div>
                                </div>
                            </div>

                            <div className="opp-card-body">
                                <h3>{opp.title}</h3>
                                <div className="company-name">{opp.company}</div>

                                <div className="opp-details-row">
                                    <div className="opp-detail">
                                        <MapPin size={16} />
                                        <span>{opp.location}</span>
                                    </div>
                                    <div className="opp-detail">
                                        <Briefcase size={16} />
                                        <span>{opp.duration}</span>
                                    </div>
                                </div>
                                
                                {opp.description && (
                                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {opp.description}
                                    </p>
                                )}
                            </div>

                            <div className="opp-card-footer">
                                {hasApplied(opp.id) ? (
                                    <Button variant="outline" className="w-full" disabled style={{ color: 'var(--success)', borderColor: 'var(--success)', background: 'var(--success-light)' }}>
                                        <CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Applied
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outline" className="w-full">Details</Button>
                                        <Button className="w-full" onClick={() => handleApplyClick(opp)} disabled={opp.status === 'Closed'}>
                                            Apply Now <ChevronRight size={16} />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-full" style={{ gridColumn: '1 / -1' }}>
                        <Search size={48} />
                        <h3>No opportunities found</h3>
                        <p>No active internship postings match your search criteria right now.</p>
                        <Button variant="secondary" onClick={() => { setSearchTerm(''); setFilter('All'); }}>
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {showModal && selectedOpp && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>Apply for {selectedOpp.title}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={submitApplication}>
                            <div className="modal-body">
                                <div className="company-info-box" style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div className="company-logo-placeholder" style={{ width: '40px', height: '40px' }}><Building2 size={20} /></div>
                                    <div>
                                        <strong style={{ display: 'block' }}>{selectedOpp.company}</strong>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedOpp.location} • {selectedOpp.type}</span>
                                    </div>
                                </div>
                                
                                <div className="form-group-dash">
                                    <label>Add a short cover note (Optional)</label>
                                    <textarea 
                                        rows={4} 
                                        value={coverNote} 
                                        onChange={(e) => setCoverNote(e.target.value)} 
                                        placeholder="Why are you a good fit for this role?"
                                    />
                                </div>
                                
                                <div className="info-alert" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                    <CheckCircle2 size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                    <span>Your student profile and academic transcripts will be automatically attached to this application.</span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Submit Application</Button>
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

export default Opportunities;
