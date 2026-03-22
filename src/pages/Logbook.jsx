import { useAuth } from '../context/AuthContext';
import { apiService } from '../api/apiService';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import './Logbook.css';

const Logbook = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [activeWeek, setActiveWeek] = useState(1);
    const [tasks, setTasks] = useState('');
    const [skillsString, setSkillsString] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await apiService.getMyLogs();
            const normalized = data.map(l => ({
                ...l,
                status: (l.status || 'pending').toLowerCase()
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
        if (user) fetchLogs();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check for supervisor assignment (from dev2 logic)
        if (user?.role?.toLowerCase() === 'student' && !user?.supervisorId) {
            toast.warning('Cannot submit logbook yet! Please ensure your supervisor has been assigned by the Admin.');
            return;
        }

        try {
            setLoading(true);
            const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s);
            await apiService.submitLogbook({
                week: activeWeek,
                content: tasks,
                skills: skillsArray
            });
            setTasks('');
            setSkillsString('');
            toast.success('Logbook submitted successfully!');
            await fetchLogs();
        } catch (err) {
            console.error('Error submitting logbook:', err);
            toast.error(err.message || 'Failed to submit logbook.');
        } finally {
            setLoading(false);
        }
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

                    <form onSubmit={handleSubmit} className="logbook-form">
                        <div className="form-group">
                            <label>Tasks Performed</label>
                            <textarea 
                                placeholder="Describe the tasks you completed this week..." 
                                rows={6}
                                value={tasks}
                                onChange={(e) => setTasks(e.target.value)}
                                required
                                disabled={loading}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Skills Learned / Applied (comma separated)</label>
                            <div className="skills-input-wrapper">
                                <input 
                                    type="text" 
                                    placeholder="e.g. React hooks, Project planning..." 
                                    value={skillsString}
                                    onChange={(e) => setSkillsString(e.target.value)}
                                    disabled={loading}
                                />
                                <Button type="button" variant="secondary" size="sm" onClick={() => {}}><Plus size={16} /></Button>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="submit-btn" isLoading={loading} disabled={loading || !tasks}>
                            Submit Report <Send size={18} />
                        </Button>
                    </form>
                </div>

                <div className="logbook-history">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Submission History</h3>
                        {logs.length > 0 && <span className="text-muted" style={{ fontSize: '0.8rem' }}>{logs.length} Total</span>}
                    </div>
                    <div className="history-list">
                        {loading && logs.length === 0 ? (
                            <div className="loading-simple">Loading history...</div>
                        ) : logs.length > 0 ? (
                            logs.map((log) => (
                                <div key={log.id} className="history-item">
                                    <div className="history-top">
                                        <span className="week-label">Week {log.week}</span>
                                        <span className={`status-badge ${log.status}`}>
                                            {log.status === 'approved' ? <CheckCircle size={14} /> : (log.status === 'rejected' ? <XCircle size={14} /> : <Clock size={14} />)}
                                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="log-snippet">{log.content}</p>
                                    
                                    {log.skills && log.skills.length > 0 && (
                                        <div className="skills-tags" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            {log.skills.map((s, idx) => (
                                                <span key={idx} className="skill-tag" style={{ fontSize: '0.75rem', background:'rgba(59,130,246,0.1)', color:'var(--primary)', padding:'0.2rem 0.5rem', borderRadius:'4px' }}>{s}</span>
                                            ))}
                                        </div>
                                    )}

                                    {log.feedback && (
                                        <div className="feedback-box" style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '3px solid var(--warning)', borderRadius: '4px' }}>
                                            <strong style={{ fontSize: '0.8rem', color: 'var(--warning-dark)', display: 'block', marginBottom: '0.25rem' }}>Supervisor Feedback:</strong>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>{log.feedback}</p>
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
