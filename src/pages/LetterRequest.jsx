import React, { useState } from 'react';
import { FileText, Send, Building2, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api/apiService';
import './Dashboards.css';

const LetterRequest = () => {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [formData, setFormData] = useState({
        reason: '',
        company: '',
        startDate: '',
        notes: ''
    });

    const fetchMyRequests = async () => {
        try {
            const data = await apiService.getMyLetterRequests();
            if (data && data.length > 0) {
                // For this UI, we just show the most recent one as "submitted"
                const mostRecent = data[0];
                setCurrentRequest({
                    ...mostRecent,
                    status: mostRecent.status.toLowerCase()
                });
                setSubmitted(true);
            }
        } catch (err) {
            console.error('Error fetching my requests:', err);
        }
    };

    React.useEffect(() => {
        if (user?.id) {
            fetchMyRequests();
        }
    }, [user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.createLetterRequest(formData);
            fetchMyRequests();
        } catch (err) {
            console.error('Error submitting request:', err);
            alert('Failed to submit request. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="dashboard-view fade-in">
                <div className="success-card">
                    <CheckCircle2 size={64} className="text-emerald-500" />
                    <h2>Request {currentRequest?.status === 'pending' ? 'Received' : 'Updated'}!</h2>
                    <p>Your internship letter request for <strong>{currentRequest?.company}</strong> is currently <strong>{currentRequest?.status}</strong>.</p>
                    <div className="status-timeline">
                        <div className={`timeline-step ${currentRequest?.status ? 'active' : ''}`}>
                            <span className="step-dot"></span>
                            <span className="step-label">Request Received</span>
                        </div>
                        <div className={`timeline-step ${['reviewing', 'approved', 'issued'].includes(currentRequest?.status) ? 'active' : ''}`}>
                            <span className="step-dot"></span>
                            <span className="step-label">Admin Review</span>
                        </div>
                        <div className={`timeline-step ${currentRequest?.status === 'issued' ? 'active' : ''}`}>
                            <span className="step-dot"></span>
                            <span className="step-label">Letter Issued</span>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => {
                        setSubmitted(false);
                        setCurrentRequest(null);
                    }}>Cancel & Start New</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Internship Letter Request</h1>
                    <p>Fill out this form to request an official internship letter for your placement.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="data-card large">
                    <form onSubmit={handleSubmit} className="request-form">
                        <div className="form-section">
                            <div className="form-group-dash">
                                <label><Building2 size={16} /> Target Organization / Company</label>
                                <input
                                    type="text"
                                    placeholder="e.g. TechNova Solutions"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>

                            <div className="form-group-dash">
                                <label><Building2 size={16} /> Company Physical Address</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 123 Tech Lane, Silicon Valley"
                                    required
                                    value={formData.companyAddress}
                                    onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                                />
                            </div>

                            <div className="form-row-dash" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group-dash">
                                    <label><Calendar size={16} /> Internship Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-dash">
                                    <label><Calendar size={16} /> Internship End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <Button type="submit" size="lg" className="w-full">
                                Submit Request <Send size={18} />
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="data-card small info-sidebar">
                    <h3>Important Notice</h3>
                    <ul className="info-list">
                        <li>Requests are typically processed within 3-5 business days.</li>
                        <li>Your supervisor will be automatically notified once you submit this request.</li>
                        <li>Ensure the company name is exactly as it should appear on the letter.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LetterRequest;
