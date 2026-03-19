import { apiService } from '../api/apiService';
import './Dashboards.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [letterRequests, setLetterRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [lettersData, usersData] = await Promise.all([
                apiService.getLetterRequests(),
                apiService.getUsers()
            ]);
            setLetterRequests(lettersData);
            setUsers(usersData);
        } catch (err) {
            console.error('Error fetching admin dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalStudents = users.filter(u => u.role === 'student').length;
    const activeSupervisors = users.filter(u => u.role === 'supervisor' && u.status === 'active').length;
    const pendingLetters = letterRequests.filter(r => r.status === 'pending').length;
    const assignedStudents = users.filter(u => u.role === 'student' && u.supervisorName).length;

    const stats = [
        { label: 'Total Students', value: String(totalStudents), icon: <Users size={24} />, color: 'blue' },
        { label: 'Active Supervisors', value: String(activeSupervisors), icon: <UserCheck size={24} />, color: 'green' },
        { label: 'Pending Letters', value: String(pendingLetters), icon: <Clock size={24} />, color: 'orange' },
        { label: 'Students Assigned', value: String(assignedStudents), icon: <FileCheck size={24} />, color: 'purple' },
    ];

    const quickActions = [
        { label: 'Review Letters', desc: 'Approve pending requests', icon: <Mail size={22} />, path: '/dashboard/admin/letters', accent: '#f59e0b' },
        { label: 'User Management', desc: 'Manage roles & access', icon: <Shield size={22} />, path: '/dashboard/users', accent: '#8b5cf6' },
        { label: 'View Placements', desc: 'Track active internships', icon: <Briefcase size={22} />, path: '/dashboard/placements', accent: '#10b981' },
        { label: 'Global Reports', desc: 'Analytics & exports', icon: <TrendingUp size={22} />, path: '/dashboard/reports', accent: '#3b82f6' },
    ];

    return (
        <div className="dashboard-view fade-in">
            {/* Welcome Banner */}
            <div className="admin-welcome-banner">
                <div className="welcome-text">
                    <h1>Welcome back, {user?.name || 'Admin'} 👋</h1>
                    <p>Here's an overview of your internship management system.</p>
                </div>
                <div className="welcome-accent">
                    <Activity size={80} strokeWidth={1} />
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div className={`stat-icon ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Recent Letter Requests */}
                <div className="data-card large">
                    <div className="card-header">
                        <h3>Recent Letter Requests</h3>
                        <button className="text-btn" onClick={() => navigate('/dashboard/admin/letters')}>
                            View All <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="table-responsive">
                        {letterRequests.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Company</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letterRequests.slice(0, 5).map((r) => (
                                        <tr key={r.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="avatar-sm">{r.studentName?.charAt(0) || 'S'}</div>
                                                    <span>{r.studentName || 'Student'}</span>
                                                </div>
                                            </td>
                                            <td>{r.company}</td>
                                            <td>{r.dateSubmitted}</td>
                                            <td>
                                                <span className={`badge ${r.status === 'pending' ? 'warning' : r.status === 'issued' ? 'success' : 'info'}`}>
                                                    {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state-simple">
                                <p>No letter requests yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="data-card small">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="admin-quick-actions">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                className="admin-action-card"
                                onClick={() => navigate(action.path)}
                            >
                                <div className="action-icon-wrap" style={{ background: `${action.accent}15`, color: action.accent }}>
                                    {action.icon}
                                </div>
                                <div className="action-text">
                                    <span className="action-label">{action.label}</span>
                                    <span className="action-desc">{action.desc}</span>
                                </div>
                                <ArrowRight size={16} className="action-arrow" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
