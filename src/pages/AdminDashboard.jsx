import React, { useState } from 'react';
import { Users, UserCheck, Clock, FileCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboards.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Students', value: '0', icon: <Users size={24} />, color: 'blue' },
        { label: 'Students Placed', value: '0', icon: <UserCheck size={24} />, color: 'green' },
        { label: 'Pending Approvals', value: '0', icon: <Clock size={24} />, color: 'orange' },
        { label: 'Active Supervisors', value: '0', icon: <FileCheck size={24} />, color: 'purple' },
    ];

    const [recentPlacements, setRecentPlacements] = useState([]);

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Admin Console</h1>
                    <p>System-wide monitoring and administrative control center.</p>
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
                <div className="data-card large">
                    <div className="card-header">
                        <h3>Recent Placements</h3>
                        <button className="text-btn" onClick={() => navigate('/dashboard/placements')}>
                            View All <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="table-responsive">
                        {recentPlacements.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Company</th>
                                        <th>Supervisor</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPlacements.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.student}</td>
                                            <td>{p.company}</td>
                                            <td>{p.supervisor}</td>
                                            <td>
                                                <span className={`badge ${p.status === 'Active' ? 'success' : p.status === 'Pending' ? 'warning' : 'info'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state-simple">
                                <p>No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="data-card small">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="actions-list">
                        <button className="action-item" onClick={() => navigate('/dashboard/users')}>
                            Approve New Supervisor
                        </button>
                        <button className="action-item" onClick={() => navigate('/dashboard/reports')}>
                            Generate Monthly Report
                        </button>
                        <button className="action-item" onClick={() => navigate('/dashboard/admin/letters')}>
                            Review Letter Requests
                        </button>
                        <button className="action-item" onClick={() => navigate('/dashboard/placements')}>
                            Manage All Placements
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
