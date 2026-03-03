import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Users, Building2, GraduationCap } from 'lucide-react';
import './Dashboards.css';

const Reports = () => {
    const reportStats = [
        { label: 'Active Placements', value: '84%', icon: <TrendingUp />, color: 'emerald' },
        { label: 'Completion Rate', value: '92%', icon: <BarChart3 />, color: 'blue' },
        { label: 'Avg. Feedbacks', value: '4.8', icon: <TrendingUp />, color: 'purple' },
    ];

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Global Analytics & Reports</h1>
                    <p>Comprehensive performance metrics across all internship programs.</p>
                </div>
                <div className="header-actions">
                    <div className="date-picker-mock">
                        <Calendar size={18} />
                        <span>Last 30 Days</span>
                    </div>
                    <button className="btn btn-secondary">
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
                        <h3>Placement Growth Trend</h3>
                        <div className="chart-legend">
                            <span><i className="dot emerald"></i> Engineering</span>
                            <span><i className="dot blue"></i> Management</span>
                            <span><i className="dot purple"></i> Arts</span>
                        </div>
                    </div>
                    <div className="mock-chart-large">
                        {/* Visual representation of a bar chart */}
                        {[40, 60, 45, 70, 85, 60, 75, 90, 80, 95, 100, 85].map((h, i) => (
                            <div key={i} className="bar-wrapper">
                                <div className="bar" style={{ height: `${h}%` }}></div>
                                <span className="bar-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="data-card small ghost-chart-container">
                    <div className="card-header">
                        <h3>Supervisor Distribution</h3>
                    </div>
                    <div className="mock-pie-chart">
                        <div className="pie-slice p1"></div>
                        <div className="pie-slice p2"></div>
                        <div className="pie-slice p3"></div>
                        <div className="pie-center">
                            <span className="total">45</span>
                            <span className="label">Supervisors</span>
                        </div>
                    </div>
                    <div className="pie-legend">
                        <div className="legend-item">
                            <i className="dot emerald"></i>
                            <span>Internal (60%)</span>
                        </div>
                        <div className="legend-item">
                            <i className="dot blue"></i>
                            <span>External (30%)</span>
                        </div>
                        <div className="legend-item">
                            <i className="dot purple"></i>
                            <span>Guest (10%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
