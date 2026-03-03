import React, { useState } from 'react';
import { Search, UserPlus, Mail, Shield, UserCheck, UserX, Clock, Filter, MoreVertical } from 'lucide-react';
import './Dashboards.css';

const UsersManagement = () => {
    const [activeTab, setActiveTab] = useState('supervisors');

    const users = [
        { id: 1, name: 'Dr. Sarah Wilson', email: 's.wilson@university.edu', role: 'supervisor', status: 'pending', date: '2024-03-01' },
        { id: 2, name: 'James Miller', email: 'j.miller@industry.com', role: 'supervisor', status: 'active', date: '2023-12-15' },
        { id: 3, name: 'Mark Thompson', email: 'mark.t@student.edu', role: 'student', status: 'active', date: '2024-01-20' },
        { id: 4, name: 'Dr. Maria Garcia', email: 'm.garcia@university.edu', role: 'supervisor', status: 'pending', date: '2024-03-02' },
        { id: 5, name: 'John Doe', email: 'j.doe@student.edu', role: 'student', status: 'active', date: '2023-11-05' },
    ];

    const filteredUsers = users.filter(usr =>
        activeTab === 'all' ? true : usr.role === activeTab.slice(0, -1)
    );

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>User Management & Oversight</h1>
                    <p>Manage user roles, system access, and supervisor approvals.</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={18} />
                    <span>Add New User</span>
                </button>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'supervisors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('supervisors')}
                    >
                        Supervisors
                        <span className="count">12</span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Students
                    </button>
                    <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </button>
                </div>
            </div>

            <div className="data-card">
                <div className="card-filters">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search by name, email, or department..." />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>User Profile</th>
                                <th>Contact Email</th>
                                <th>Joined / Applied</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar">{u.name.charAt(0)}</div>
                                            <div className="user-meta">
                                                <span className="name">{u.name}</span>
                                                <span className="role-tag">{u.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="email-cell">
                                            <Mail size={16} />
                                            <span>{u.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            <Clock size={16} />
                                            <span>{u.date}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {u.status === 'pending' ? (
                                            <div className="approval-actions">
                                                <button className="approve-btn"><UserCheck size={16} /></button>
                                                <button className="reject-btn"><UserX size={16} /></button>
                                            </div>
                                        ) : (
                                            <span className="badge success">Verified</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className="icon-btn-sm"><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
