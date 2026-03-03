import React, { useState } from 'react';
import { Search, Filter, ExternalLink, MoreVertical, Building2, User, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import './Dashboards.css';

const Placements = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const placements = [
        { id: 1, student: 'Alice Johnson', company: 'TechNova Solutions', supervisor: 'Dr. Robert Smith', startDate: '2024-01-15', status: 'active' },
        { id: 2, student: 'Michael Chen', company: 'GreenEnergy Corp', supervisor: 'Sarah Wilson', startDate: '2024-02-01', status: 'pending' },
        { id: 3, student: 'Emma Davis', company: 'Global Finance', supervisor: 'James Miller', startDate: '2023-11-20', status: 'completed' },
        { id: 4, student: 'David Wilson', company: 'HealthTech Systems', supervisor: 'Dr. Maria Garcia', startDate: '2024-01-10', status: 'active' },
        { id: 5, student: 'Sophia Lee', company: 'Creative Designs', supervisor: 'Alex Turney', startDate: '2024-02-15', status: 'pending' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return 'badge success';
            case 'pending': return 'badge warning';
            case 'completed': return 'badge info';
            default: return 'badge';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <Clock size={14} />;
            case 'pending': return <AlertCircle size={14} />;
            case 'completed': return <CheckCircle2 size={14} />;
            default: return null;
        }
    };

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Placement Management</h1>
                    <p>Track and oversee all active student internships globally.</p>
                </div>
                <button className="btn btn-primary">
                    <Filter size={18} />
                    <span>Advanced Filter</span>
                </button>
            </div>

            <div className="data-card">
                <div className="card-filters">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search students, companies, or supervisors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="placement-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Placement Entity</th>
                                <th>Assigned Supervisor</th>
                                <th>Duration / Start</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placements.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar-sm">{p.student.charAt(0)}</div>
                                            <span>{p.student}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="company-cell">
                                            <Building2 size={16} />
                                            <span>{p.company}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="supervisor-cell">
                                            <User size={16} />
                                            <span>{p.supervisor}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            <Calendar size={16} />
                                            <span>{p.startDate}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={getStatusStyle(p.status)}>
                                            {getStatusIcon(p.status)}
                                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="icon-btn-sm" title="View Details">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="icon-btn-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
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

export default Placements;
