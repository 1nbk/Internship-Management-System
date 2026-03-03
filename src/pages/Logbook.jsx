import React, { useState } from 'react';
import { Send, Plus, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';
import './Logbook.css';

const Logbook = () => {
    const [activeWeek, setActiveWeek] = useState(7);

    const mockLogs = [
        { week: 6, status: 'approved', content: 'Completed the UI design for the new portal.', feedback: 'Great job on the consistent colors!' },
        { week: 5, status: 'approved', content: 'Researched internship management systems.', feedback: 'Insightful analysis.' },
    ];

    return (
        <div className="logbook-container">
            <div className="logbook-header">
                <h1>Weekly Logbook</h1>
                <p>Document your weekly tasks and skills learned.</p>
            </div>

            <div className="logbook-grid">
                <div className="logbook-form-card">
                    <div className="card-top">
                        <h3>Submit Week {activeWeek} Report</h3>
                        <span className="badge-pending">Pending Submission</span>
                    </div>

                    <form className="logbook-form">
                        <div className="form-group">
                            <label>Tasks Performed</label>
                            <textarea placeholder="Describe the tasks you completed this week..." rows={6}></textarea>
                        </div>

                        <div className="form-group">
                            <label>Skills Learned / Applied</label>
                            <div className="skills-input-wrapper">
                                <input type="text" placeholder="e.g. React hooks, Project planning..." />
                                <Button variant="secondary" size="sm"><Plus size={16} /></Button>
                            </div>
                        </div>

                        <Button size="lg" className="submit-btn">
                            Submit Report <Send size={18} />
                        </Button>
                    </form>
                </div>

                <div className="logbook-history">
                    <h3>Submission History</h3>
                    <div className="history-list">
                        {mockLogs.map((log) => (
                            <div key={log.week} className="history-item">
                                <div className="history-top">
                                    <span className="week-label">Week {log.week}</span>
                                    <span className={`status-badge ${log.status}`}>
                                        {log.status === 'approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {log.status}
                                    </span>
                                </div>
                                <p className="log-snippet">{log.content}</p>
                                {log.feedback && (
                                    <div className="feedback-box">
                                        <strong>Supervisor Feedback:</strong>
                                        <p>{log.feedback}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logbook;
