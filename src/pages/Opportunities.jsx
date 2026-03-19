import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Briefcase, Filter, ChevronRight, Star } from 'lucide-react';
import { apiService } from '../api/apiService';
import Button from '../components/Button';
import './Dashboards.css';

const Opportunities = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const data = await apiService.getOpportunities();
            // Map backend fields to frontend expected fields
            const normalized = data.map(o => ({
                ...o,
                duration: '6 Months', // Mock duration as it's not in schema yet
                rating: 4.5 + (Math.random() * 0.5) // Random rating for aesthetic
            }));
            setOpportunities(normalized);
        } catch (err) {
            console.error('Error fetching opportunities:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const filteredOpportunities = opportunities.filter(opp => {
        const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || opp.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="dashboard-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Internship Discovery</h1>
                    <p>Find and apply to top internship opportunities tailored to your skills.</p>
                </div>
                <div className="header-actions">
                    <div className="search-wrapper-premium">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search roles or companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="filters-bar-premium">
                {['All', 'Software Engineering', 'Design', 'Data Science', 'Marketing'].map((cat) => (
                    <button
                        key={cat}
                        className={`filter-chip ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="opportunities-grid">
                {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((opp) => (
                        <div key={opp.id} className="opp-card-premium">
                            <div className="opp-card-header">
                                <div className="company-logo-placeholder">
                                    <Building2 size={24} />
                                </div>
                                <div className="opp-meta">
                                    <div className="opp-status-badge">
                                        {opp.status}
                                    </div>
                                    <div className="opp-rating">
                                        <Star size={14} fill="currentColor" />
                                        <span>{opp.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="opp-card-body">
                                <h3>{opp.title}</h3>
                                <div className="company-name">{opp.company}</div>

                                <div className="opp-details-row">
                                    <div className="opp-detail">
                                        <MapPin size={16} />
                                        <span>{opp.location}</span>
                                    </div>
                                    <div className="opp-detail">
                                        <Briefcase size={16} />
                                        <span>{opp.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="opp-card-footer">
                                <Button variant="outline" className="w-full">View Details</Button>
                                <Button className="w-full">
                                    Apply Now <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-full">
                        <Search size={48} />
                        <h3>No opportunities found</h3>
                        <p>Try adjusting your search or filters to find what you're looking for.</p>
                        <Button variant="secondary" onClick={() => { setSearchTerm(''); setFilter('All'); }}>
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Opportunities;
