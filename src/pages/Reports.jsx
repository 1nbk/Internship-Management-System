import { apiService } from '../api/apiService';
import './Dashboards.css';

const Reports = () => {
    const [users, setUsers] = useState([]);
    const [letters, setLetters] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, lettersData, logsData] = await Promise.all([
                apiService.getUsers(),
                apiService.getLetterRequests(),
                apiService.getInternsLogs() // Admin can also fetch all logbooks probably, but using interns-logs for now or get all users
            ]);
            setUsers(usersData);
            setLetters(lettersData);
            
            // Derive placements from students with status ACTIVE/APPROVED
            const studentPlacements = usersData.filter(u => u.role === 'STUDENT' && u.internshipStarted).map(s => ({
                ...s,
                status: s.status.toLowerCase(),
                department: s.department || 'Other'
            }));
            setPlacements(studentPlacements);
        } catch (err) {
            console.error('Error fetching report data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const activePlacements = placements.filter(p => p.status === 'active').length;
    const completedPlacements = placements.filter(p => p.status === 'completed').length;
    const totalPlacements = placements.length || 1;
    const completionRate = Math.round((completedPlacements / totalPlacements) * 100);
    const activeRate = Math.round((activePlacements / totalPlacements) * 100);

    const totalSupervisors = users.filter(u => u.role === 'supervisor').length;
    const totalStudents = users.filter(u => u.role === 'student').length;

    const reportStats = [
        { label: 'Active Placements', value: `${activeRate}%`, icon: <TrendingUp size={20} />, color: 'emerald' },
        { label: 'Completion Rate', value: `${completionRate}%`, icon: <BarChart3 size={20} />, color: 'blue' },
        { label: 'Total Letters', value: String(letters.length), icon: <TrendingUp size={20} />, color: 'purple' },
    ];

    // Dynamic bar data from placements per department
    const deptMap = {};
    placements.forEach(p => {
        const d = p.department || 'Other';
        deptMap[d] = (deptMap[d] || 0) + 1;
    });
    const barLabels = Object.keys(deptMap).length > 0 ? Object.keys(deptMap) : ['CS', 'IT', 'ENG', 'BUS'];
    const barValues = Object.keys(deptMap).length > 0 ? Object.values(deptMap) : [0, 0, 0, 0];
    const maxBar = Math.max(...barValues, 1);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Global Analytics & Reports</h1>
                    <p>Comprehensive performance metrics across all internship programs.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={handlePrint}>
                        <Printer size={18} />
                        <span>Print Report</span>
                    </button>
                    <button className="btn btn-primary">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="stats-mini-grid">
                {reportStats.map((stat, i) => (
                    <div key={i} className="stat-mini-card">
                        <div className={`mini-icon ${stat.color}`}>{stat.icon}</div>
                        <div className="mini-info">
                            <span className="mini-label">{stat.label}</span>
                            <span className="mini-value">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="data-card large ghost-chart-container">
                    <div className="card-header">
                        <h3>Placements by Department</h3>
                        <div className="chart-legend">
                            <div className="legend-item"><i className="dot emerald"></i> <span>Active</span></div>
                            <div className="legend-item"><i className="dot blue"></i> <span>Completed</span></div>
                        </div>
                    </div>
                    <div className="mock-chart-large">
                        {barLabels.map((label, i) => (
                            <div key={i} className="bar-wrapper">
                                <div className="bar" style={{ height: `${Math.max((barValues[i] / maxBar) * 100, 4)}%` }}>
                                    <div className="bar-tooltip">{barValues[i]}</div>
                                </div>
                                <span className="bar-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="data-card small ghost-chart-container">
                    <div className="card-header">
                        <h3>User Distribution</h3>
                    </div>
                    <div className="mock-pie-chart-wrapper">
                        <div className="mock-pie-chart empty">
                            <div className="pie-center">
                                <span className="total">{users.length}</span>
                                <span className="label">Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="pie-legend">
                        <div className="legend-item">
                            <i className="dot emerald"></i>
                            <div className="legend-meta">
                                <span>Students</span>
                                <span className="val">{totalStudents}</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            <i className="dot blue"></i>
                            <div className="legend-meta">
                                <span>Supervisors</span>
                                <span className="val">{totalSupervisors}</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            <i className="dot purple"></i>
                            <div className="legend-meta">
                                <span>Admins</span>
                                <span className="val">{users.filter(u => u.role === 'admin').length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
