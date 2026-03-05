import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Users, Building2, GraduationCap, Printer } from 'lucide-react';
import './Dashboards.css';

const Reports = () => {
    const reportStats = [
        { label: 'Active Placements', value: '0%', icon: <TrendingUp size={20} />, color: 'emerald' },
        { label: 'Completion Rate', value: '0%', icon: <BarChart3 size={20} />, color: 'blue' },
        { label: 'Avg. Feedbacks', value: '0.0', icon: <TrendingUp size={20} />, color: 'purple' },
    ];

    const handlePrint = () => {
        window.print();
        // Fallback for environment where print might not be ideal
        alert('Generating PDF report... Please wait.');
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
                        <h3>Placement Growth Trend</h3>
                        <div className="chart-legend">
                            <div className="legend-item"><i className="dot emerald"></i> <span>Engineering</span></div>
                            <div className="legend-item"><i className="dot blue"></i> <span>Management</span></div>
                            <div className="legend-item"><i className="dot purple"></i> <span>Arts</span></div>
                        </div>
                    </div>
                    <div className="mock-chart-large">
                        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                            <div key={i} className="bar-wrapper">
                                <div className="bar" style={{ height: `2px` }}>
                                    <div className="bar-tooltip">{h}%</div>
                                </div>
                                <span className="bar-label">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="data-card small ghost-chart-container">
                    <div className="card-header">
                        <h3>Supervisor Distribution</h3>
                    </div>
                    <div className="mock-pie-chart-wrapper">
                        <div className="mock-pie-chart empty">
                            <div className="pie-center">
                                <span className="total">0</span>
                                <span className="label">Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="pie-legend">
                        <div className="legend-item">
                            <i className="dot emerald"></i>
                            <div className="legend-meta">
                                <span>Internal</span>
                                <span className="val">0 (0%)</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            <i className="dot blue"></i>
                            <div className="legend-meta">
                                <span>External</span>
                                <span className="val">0 (0%)</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            <i className="dot purple"></i>
                            <div className="legend-meta">
                                <span>Guest</span>
                                <span className="val">0 (0%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
