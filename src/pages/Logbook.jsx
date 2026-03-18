import React, { useState, useEffect } from 'react';
import { Send, Plus, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import './Logbook.css';

const Logbook = () => {
    const { user } = useAuth();
    const [activeWeek, setActiveWeek] = useState(1);
    const [logs, setLogs] = useState([]);
    
    const [tasks, setTasks] = useState('');
    const [skillsString, setSkillsString] = useState('');

    useEffect(() => {
        const savedLogs = JSON.parse(localStorage.getItem('ims_logbooks') || '[]');
        const myLogs = savedLogs.filter(log => log.studentId === user?.id).sort((a,b) => b.week - a.week);
        setLogs(myLogs);
        
        if (myLogs.length > 0) {
            setActiveWeek(myLogs.reduce((max, log) => log.week > max ? log.week : max, 0) + 1);
        }
    }, [user?.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const allUsers = JSON.parse(localStorage.getItem('ims_users') || '[]');
        const me = allUsers.find(u => u.id === user?.id);
        
        if (!me?.supervisorId) {
            alert('Cannot submit logbook yet! The Admin has not assigned you a supervisor.');
            return;
        }

        const newLog = {
            id: Date.now(),
            studentId: user?.id,
            studentName: user?.name,
            supervisorId: parseInt(me.supervisorId),
            program: me.program || 'N/A',
            week: activeWeek,
            content: tasks,
            skills: skillsString.split(',').map(s => s.trim()).filter(Boolean),
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            feedback: ''
        };

        const existingLogs = JSON.parse(localStorage.getItem('ims_logbooks') || '[]');
        const updatedLogs = [newLog, ...existingLogs];
        localStorage.setItem('ims_logbooks', JSON.stringify(updatedLogs));
        
        const myNewLogs = [newLog, ...logs].sort((a,b) => b.week - a.week);
        setLogs(myNewLogs);
        setActiveWeek(myNewLogs.reduce((max, log) => log.week > max ? log.week : max, 0) + 1);
        setTasks('');
        setSkillsString('');
    };

    return (
        <div className="logbook-container fade-in">
            <div className="logbook-header">
                <h1>Weekly Logbook</h1>
                <p>Document your weekly tasks and skills learned for your supervisor.</p>
            </div>

            <div className="logbook-grid">
                <div className="logbook-form-card">
                    <div className="card-top">
                        <h3>Submit Week {activeWeek} Report</h3>
                        <span className="badge-pending">Drafting</span>
                    </div>

                    <form className="logbook-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tasks Performed</label>
                            <textarea 
                                required
                                value={tasks}
                                onChange={(e) => setTasks(e.target.value)}
                                placeholder="Describe the tasks you completed this week..." 
                                rows={6}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Skills Learned / Applied (Comma separated)</label>
                            <div className="skills-input-wrapper">
                                <input 
                                    type="text" 
                                    required
                                    value={skillsString}
                                    onChange={(e) => setSkillsString(e.target.value)}
                                    placeholder="e.g. React hooks, Data Analysis..." 
                                />
                                <Button type="button" variant="secondary" size="sm"><Plus size={16} /></Button>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="submit-btn" disabled={!tasks || !skillsString}>
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
                                            {log.status === 'approved' ? <CheckCircle size={14} /> : log.status === 'rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="log-snippet">{log.content}</p>
                                    {log.skills && log.skills.length > 0 && (
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            {log.skills.map((skill, i) => (
                                                <span key={i} style={{ fontSize: '0.75rem', background:'rgba(59,130,246,0.1)', color:'var(--primary)', padding:'0.2rem 0.5rem', borderRadius:'4px' }}>{skill}</span>
                                            ))}
                                        </div>
                                    )}
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
