import React, { useState } from 'react';
import { FileText, Send, Building2, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
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

    React.useEffect(() => {
        const savedRequests = JSON.parse(localStorage.getItem('letter_requests') || '[]');
        const myRequest = savedRequests.find(r => r.studentId === user?.id);
        if (myRequest) {
            setCurrentRequest(myRequest);
            setSubmitted(true);
        }
    }, [user?.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRequest = {
            id: Date.now(),
            studentId: user?.id,
            studentName: user?.name,
            ...formData,
            status: 'pending',
            dateSubmitted: new Date().toLocaleDateString()
        };

        const savedRequests = JSON.parse(localStorage.getItem('letter_requests') || '[]');
        localStorage.setItem('letter_requests', JSON.stringify([...savedRequests, newRequest]));

        setCurrentRequest(newRequest);
        setSubmitted(true);
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
                        const savedRequests = JSON.parse(localStorage.getItem('letter_requests') || '[]');
                        const filtered = savedRequests.filter(r => r.studentId !== user?.id);
                        localStorage.setItem('letter_requests', JSON.stringify(filtered));
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
                                <label><FileText size={16} /> Reason for Request</label>
                                <select
                                    required
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                >
                                    <option value="">Select a reason...</option>
                                    <option value="new_placement">New Internship Placement</option>
                                    <option value="extension">Internship Extension</option>
                                    <option value="visa">Visa Application / Support</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group-dash">
                                <label><Calendar size={16} /> Preferred Internship Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group-dash">
                                <label><MessageSquare size={16} /> Additional Notes (Optional)</label>
                                <textarea
                                    placeholder="Any specific details you'd like to include..."
                                    rows={4}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
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
