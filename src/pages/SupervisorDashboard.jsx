import React from 'react';
import { Users, FileText, Clock, AlertCircle } from 'lucide-react';
import './Dashboards.css';

const SupervisorDashboard = () => {
    const stats = [
        { label: 'Active Interns', value: '8', icon: <Users size={24} />, color: 'blue' },
        { label: 'Pending Reports', value: '14', icon: <Clock size={24} />, color: 'orange' },
        { label: 'Approved Today', value: '4', icon: <FileText size={24} />, color: 'green' },
        { label: 'Urgent Reviews', value: '2', icon: <AlertCircle size={24} />, color: 'red' },
    ];

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
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="report-item">
                                <div className="report-main">
                                    <div className="user-dot"></div>
                                    <div className="report-details">
                                        <h4>Week {i + 4} - User Name</h4>
                                        <p>Submitted 2 hours ago • Marketing Internship</p>
                                    </div>
                                </div>
                                <div className="report-actions">
                                    <button className="btn-sm btn-outline">Review</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="data-card small">
                    <div className="card-header">
                        <h3>My Interns</h3>
                    </div>
                    <div className="interns-compact">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="intern-row">
                                <div className="mini-avatar">{String.fromCharCode(64 + i)}</div>
                                <div className="intern-name">Intern {i}</div>
                                <div className="intern-status online"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
