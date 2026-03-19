import React, { useState, useEffect } from 'react';
import { Send, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api/apiService';
import Button from '../components/Button';
import './Logbook.css';

const Logbook = () => {
    const { user } = useAuth();
    const [activeWeek, setActiveWeek] = useState(1);
    const [tasks, setTasks] = useState('');
    const [skills, setSkills] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await apiService.getMyLogs();
            const normalized = data.map(l => ({
                ...l,
                status: l.status.toLowerCase()
            }));
            setLogs(normalized);
            if (normalized.length > 0) {
                const maxWeek = Math.max(...normalized.map(l => l.week));
                setActiveWeek(maxWeek + 1);
            }
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
            await apiService.submitLogbook({
                week: activeWeek,
                content: tasks,
                skills: skillsArray
            });
            setTasks('');
            setSkills('');
            fetchLogs();
        } catch (err) {
            console.error('Error submitting logbook:', err);
            alert(err.message || 'Failed to submit logbook.');
        }
    };

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

                    <form onSubmit={handleSubmit} className="logbook-form">
                        <div className="form-group">
                            <label>Tasks Performed</label>
                            <textarea 
                                placeholder="Describe the tasks you completed this week..." 
                                rows={6}
                                value={tasks}
                                onChange={(e) => setTasks(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Skills Learned / Applied (comma separated)</label>
                            <div className="skills-input-wrapper">
                                <input 
                                    type="text" 
                                    placeholder="e.g. React hooks, Project planning..." 
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="submit-btn" disabled={loading}>
                            Submit Report <Send size={18} />
                        </Button>
                    </form>
                </div>

                <div className="logbook-history">
                    <h3>Submission History</h3>
                    <div className="history-list">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <div key={log.id} className="history-item">
                                    <div className="history-top">
                                        <span className="week-label">Week {log.week}</span>
                                        <span className={`status-badge ${log.status}`}>
                                            {log.status === 'approved' ? <CheckCircle size={14} /> : (log.status === 'rejected' ? <XCircle size={14} /> : <Clock size={14} />)}
                                            {log.status}
                                        </span>
                                    </div>
                                    <p className="log-snippet">{log.content}</p>
                                    <div className="skills-tags">
                                        {log.skills && log.skills.map((s, idx) => (
                                            <span key={idx} className="skill-tag">{s}</span>
                                        ))}
                                    </div>
                                    {log.feedback && (
                                        <div className="feedback-box">
                                            <strong>Supervisor Feedback:</strong>
                                            <p>{log.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple">
                                <div className="icon-wrapper-mb">
                                    <Send size={32} />
                                </div>
                                <p>No submissions yet. Start your logbook for Week 1!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logbook;
