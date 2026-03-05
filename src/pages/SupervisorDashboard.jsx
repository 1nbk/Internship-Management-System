import React from 'react';
import { Users, FileText, Clock, AlertCircle } from 'lucide-react';
import './Dashboards.css';

const SupervisorDashboard = () => {
    const stats = [
        { label: 'Active Interns', value: '0', icon: <Users size={24} />, color: 'blue' },
        { label: 'Pending Reports', value: '0', icon: <Clock size={24} />, color: 'orange' },
        { label: 'Approved Today', value: '0', icon: <FileText size={24} />, color: 'green' },
        { label: 'Urgent Reviews', value: '0', icon: <AlertCircle size={24} />, color: 'red' },
    ];

    const [pendingReports, setPendingReports] = React.useState([]);
    const [myInterns, setMyInterns] = React.useState([]);

    return (
        <div className="dashboard-view">
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
                <div className="data-card large">
                    <div className="card-header">
                        <h3>Pending Reports</h3>
                        <button className="text-btn">View All</button>
                    </div>
                    <div className="reports-list">
                        {pendingReports.length > 0 ? (
                            pendingReports.map((r, i) => (
                                <div key={i} className="report-item">
                                    <div className="report-main">
                                        <div className="user-dot"></div>
                                        <div className="report-details">
                                            <h4>Week {r.week} - {r.student}</h4>
                                            <p>Submitted {r.time} • {r.program}</p>
                                        </div>
                                    </div>
                                    <div className="report-actions">
                                        <button className="btn-sm btn-outline">Review</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple">
                                No reports pending review.
                            </div>
                        )}
                    </div>
                </div>

                <div className="data-card small">
                    <div className="card-header">
                        <h3>My Interns</h3>
                    </div>
                    <div className="interns-compact">
                        {myInterns.length > 0 ? (
                            myInterns.map((intern, i) => (
                                <div key={i} className="intern-row">
                                    <div className="mini-avatar">{intern.name.charAt(0)}</div>
                                    <div className="intern-name">{intern.name}</div>
                                    <div className="intern-status online"></div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple">
                                No interns assigned.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
