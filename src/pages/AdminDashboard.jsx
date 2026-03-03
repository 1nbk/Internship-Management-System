import React from 'react';
import { Users, UserCheck, Clock, FileCheck } from 'lucide-react';
import './Dashboards.css';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Students', value: '124', icon: <Users size={24} />, color: 'blue' },
        { label: 'Students Placed', value: '98', icon: <UserCheck size={24} />, color: 'green' },
        { label: 'Pending Approvals', value: '12', icon: <Clock size={24} />, color: 'orange' },
        { label: 'Active Supervisors', value: '45', icon: <FileCheck size={24} />, color: 'purple' },
    ];

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
                        <button className="text-btn">View All</button>
                    </div>
                    <div className="table-responsive">
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
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td>Student Name {i}</td>
                                        <td>Tech Corp</td>
                                        <td>Dr. Sarah Wilson</td>
                                        <td><span className="badge success">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="data-card small">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="actions-list">
                        <button className="action-item">Approve New Supervisor</button>
                        <button className="action-item">Generate Monthly Report</button>
                        <button className="action-item">Update Templates</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
