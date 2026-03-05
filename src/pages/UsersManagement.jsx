import React, { useState } from 'react';
import { Search, UserPlus, Mail, Shield, UserCheck, UserX, Clock, Filter, MoreVertical, X, Check } from 'lucide-react';
import Button from '../components/Button';
import './Dashboards.css';

const UsersManagement = () => {
    const [activeTab, setActiveTab] = useState('supervisors');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'supervisor', department: '' });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [assignment, setAssignment] = useState({ supervisorId: '' });

    const [users, setUsers] = useState([]);

    React.useEffect(() => {
        const savedUsers = JSON.parse(localStorage.getItem('ims_users') || '[]');
        if (savedUsers.length === 0) {
            // Seed initial data if empty
            const seed = [
                { id: 1, name: 'Dr. Sarah Smith', email: 'sarah.s@uni.edu', role: 'supervisor', status: 'active', dept: 'CS', date: '2026-01-10' },
                { id: 2, name: 'Prof. James Bond', email: 'j.bond@uni.edu', role: 'supervisor', status: 'active', dept: 'CS', date: '2026-01-12' },
                { id: 3, name: 'Alice Student', email: 'alice@student.edu', role: 'student', status: 'active', dept: 'CS', date: '2026-02-01' }
            ];
            localStorage.setItem('ims_users', JSON.stringify(seed));
            setUsers(seed);
        } else {
            setUsers(savedUsers);
        }
    }, []);

    const handleAddUser = (e) => {
        e.preventDefault();
        const user = {
            id: users.length + 1,
            ...newUser,
            status: 'active',
            date: new Date().toISOString().split('T')[0],
            dept: newUser.department || 'N/A'
        };
        setUsers([user, ...users]);
        setShowAddModal(false);
        setNewUser({ name: '', email: '', role: 'supervisor', department: '' });
    };

    const handleStatusChange = (id, status) => {
        const updated = users.map(u => u.id === id ? { ...u, status } : u);
        setUsers(updated);
        localStorage.setItem('ims_users', JSON.stringify(updated));
    };

    const handleAssignSupervisor = (e) => {
        e.preventDefault();
        const updatedUsers = users.map(u => {
            if (u.id === selectedStudent.id) {
                const supervisor = users.find(s => s.id === parseInt(assignment.supervisorId));
                return { ...u, supervisorId: assignment.supervisorId, supervisorName: supervisor?.name };
            }
            return u;
        });
        setUsers(updatedUsers);
        localStorage.setItem('ims_users', JSON.stringify(updatedUsers));
        setShowAssignModal(false);
        setSelectedStudent(null);
    };

    const filteredUsers = users.filter(usr => {
        const matchesTab = activeTab === 'all' ? true : usr.role === activeTab.slice(0, -1);
        const matchesSearch = usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usr.dept.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>User Management & Oversight</h1>
                    <p>Manage user roles, system access, and supervisor approvals.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
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
                        <span className="count">{users.filter(u => u.role === 'supervisor').length}</span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Students
                        <span className="count">{users.filter(u => u.role === 'student').length}</span>
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
                        <input
                            type="text"
                            placeholder="Search by name, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar">{u.name.charAt(0)}</div>
                                                <div className="user-meta">
                                                    <span className="name">{u.name}</span>
                                                    <span className="role-tag">{u.role}</span>
                                                    {u.role === 'student' && u.supervisorName && (
                                                        <span className="assigned-tag">Assigned to: {u.supervisorName}</span>
                                                    )}
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
                                                    <button
                                                        className="approve-btn"
                                                        title="Approve"
                                                        onClick={() => handleStatusChange(u.id, 'active')}
                                                    >
                                                        <UserCheck size={16} />
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        title="Reject"
                                                        onClick={() => handleStatusChange(u.id, 'rejected')}
                                                    >
                                                        <UserX size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`badge ${u.status === 'active' ? 'success' : 'danger'}`}>
                                                    {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                {u.role === 'student' && (
                                                    <button
                                                        className="btn-sm btn-outline"
                                                        onClick={() => {
                                                            setSelectedStudent(u);
                                                            setShowAssignModal(true);
                                                        }}
                                                    >
                                                        Assign Supervisor
                                                    </button>
                                                )}
                                                <button className="icon-btn-sm"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-table-cell">
                                        <div className="empty-state-simple">
                                            No users found.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New User</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="j.doe@example.com"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="supervisor">Supervisor</option>
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Department</label>
                                        <input
                                            type="text"
                                            value={newUser.department}
                                            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                            placeholder="e.g. CS"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                                <Button type="submit">Create User <Check size={18} /></Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Assign Supervisor Modal */}
            {showAssignModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Assign Supervisor to {selectedStudent?.name}</h3>
                            <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAssignSupervisor}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Select Academic Supervisor</label>
                                    <select
                                        required
                                        value={assignment.supervisorId}
                                        onChange={(e) => setAssignment({ ...assignment, supervisorId: e.target.value })}
                                    >
                                        <option value="">Select a supervisor...</option>
                                        {users.filter(u => u.role === 'supervisor' && u.status === 'active').map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.dept})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" type="button" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                                <Button type="submit">Confirm Assignment <UserPlus size={18} /></Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
