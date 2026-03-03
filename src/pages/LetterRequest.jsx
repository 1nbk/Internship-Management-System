import React, { useState } from 'react';
import { FileText, Send, Building2, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import './Dashboards.css';

const LetterRequest = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        reason: '',
        company: '',
        startDate: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send data to the backend
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="dashboard-view fade-in">
                <div className="success-card">
                    <CheckCircle2 size={64} className="text-emerald-500" />
                    <h2>Request Submitted!</h2>
                    <p>Your internship letter request has been sent to the administration. We will review it and notify your supervisor shortly.</p>
                    <div className="status-timeline">
                        <div className="timeline-step active">
                            <span className="step-dot"></span>
                            <span className="step-label">Request Received</span>
                        </div>
                        <div className="timeline-step">
                            <span className="step-dot"></span>
                            <span className="step-label">Admin Review</span>
                        </div>
                        <div className="timeline-step">
                            <span className="step-dot"></span>
                            <span className="step-label">Letter Issued</span>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => setSubmitted(false)}>Request Another</Button>
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
