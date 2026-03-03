import React from 'react';
import { Calendar, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import './Dashboards.css';

const StudentDashboard = () => {
    const stats = [
        { label: 'Weeks Completed', value: '6/12', icon: <Calendar size={24} />, color: 'blue' },
        { label: 'Reports Approved', value: '5', icon: <CheckCircle2 size={24} />, color: 'green' },
        { label: 'Submission Streak', value: '4 weeks', icon: <TrendingUp size={24} />, color: 'purple' },
        { label: 'Days Remaining', value: '42', icon: <Clock size={24} />, color: 'orange' },
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
                        <h3>Progress Overview</h3>
                    </div>
                    <div className="progress-container">
                        <div className="progress-label">
                            <span>Overall Completion</span>
                            <span>50%</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: '50%' }}></div>
                        </div>
                    </div>

                    <div className="timeline-list">
                        <h4>Upcoming Tasks</h4>
                        <div className="timeline-item">
                            <div className="time-marker"></div>
                            <div className="time-content">
                                <h5>Submit Week 7 Logbook</h5>
                                <p>Due in 2 days</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="time-marker"></div>
                            <div className="time-content">
                                <h5>Monthly Evaluation</h5>
                                <p>Due next Friday</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="data-card small">
                    <div className="card-header">
                        <h3>Skills Learned</h3>
                    </div>
                    <div className="tags-cloud">
                        <span className="tag">React</span>
                        <span className="tag">UI/UX</span>
                        <span className="tag">Project Mgmt</span>
                        <span className="tag">API Dev</span>
                        <span className="tag">Testing</span>
                    </div>
                    <button className="btn-md btn-primary w-full mt-1">Submit Logbook</button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
