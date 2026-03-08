import React from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
    Users, LogOut, ChevronRight, Bell,
    Shield, Mail, Send, Activity, BarChart3, Briefcase, Server,
    ClipboardList, FolderOpen, UserCircle, GraduationCap, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = {
        admin: [
            { path: '/dashboard/admin', icon: <Server size={20} />, label: 'Admin Console' },
            { path: '/dashboard/placements', icon: <Activity size={20} />, label: 'Placements' },
            { path: '/dashboard/reports', icon: <BarChart3 size={20} />, label: 'Global Reports' },
            { path: '/dashboard/admin/letters', icon: <Mail size={20} />, label: 'Letter Requests' },
            { path: '/dashboard/users', icon: <Shield size={20} />, label: 'User Management' },
        ],
        supervisor: [
            { path: '/dashboard/supervisor', icon: <Briefcase size={20} />, label: 'Internship Overview' },
            { path: '/dashboard/my-interns', icon: <UserCircle size={20} />, label: 'My Interns' },
            { path: '/dashboard/reviews', icon: <ClipboardList size={20} />, label: 'Weekly Reviews' },
        ],
        student: [
            { path: '/dashboard/student', icon: <Activity size={20} />, label: 'My Progress' },
            { path: '/dashboard/opportunities', icon: <Briefcase size={20} />, label: 'Find Internships' },
            { path: '/dashboard/letter-request', icon: <Send size={20} />, label: 'Request Letter' },
            { path: '/dashboard/logbook', icon: <ClipboardList size={20} />, label: 'Weekly Logbook' },
            { path: '/dashboard/documents', icon: <FolderOpen size={20} />, label: 'Documents' },
        ]
    };

    const roleMenu = menuItems[user?.role || 'student'];
    const roleLabel = user?.role === 'admin' ? 'ADMIN' : user?.role === 'supervisor' ? 'SUPERVISOR' : 'STUDENT';

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <GraduationCap size={22} />
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">IMS Portal</span>
                        <span className={`role-badge ${user?.role}`}>{roleLabel}</span>
                    </div>
                </div>

                <div className="sidebar-section-label">
                    <span>NAVIGATION</span>
                </div>

                <nav className="sidebar-nav">
                    {roleMenu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            title={item.label}
                        >
                            <div className="nav-icon-wrap">{item.icon}</div>
                            <span className="nav-label">{item.label}</span>
                            <ChevronRight size={14} className="arrow" />
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user-mini">
                        <div className="sidebar-avatar">{user?.name?.charAt(0) || 'U'}</div>
                        <div className="sidebar-user-text">
                            <span className="sidebar-user-name">{user?.name || 'User'}</span>
                            <span className="sidebar-user-role">{user?.role}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn" title="Logout">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="content-header">
                    <div className="header-search">
                        <h2>
                            {user?.role === 'admin' ? 'Admin Portal' :
                                user?.role === 'supervisor' ? 'Supervisor Console' :
                                    'Student Portal'}
                        </h2>
                        <p>Welcome back, {user?.name || 'User'}</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="notif-dot"></span>
                        </button>
                        <div className="user-profile">
                            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                            <div className="user-info">
                                <span className="user-name">{user?.name || 'User'}</span>
                                <span className="user-role">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-body">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
