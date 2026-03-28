import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
    Users, LogOut, ChevronRight, Bell, CheckCircle, AlertCircle,
    Shield, Mail, Send, Activity, BarChart3, Briefcase, Server,
    ClipboardList, FolderOpen, UserCircle, GraduationCap, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api/apiService';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (user) {
                    const res = await apiService.getNotifications();
                    if (res?.success) setNotifications(res.notifications);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = {
        admin: [
            { path: '/dashboard/admin', icon: <Server size={20} />, label: 'Admin Console' },
            { path: '/dashboard/admin/internships', icon: <Briefcase size={20} />, label: 'Manage Internships' },
            { path: '/dashboard/placements', icon: <Activity size={20} />, label: 'Placements' },
            { path: '/dashboard/reports', icon: <BarChart3 size={20} />, label: 'Global Reports' },
            { path: '/dashboard/admin/letters', icon: <Mail size={20} />, label: 'Letter Requests' },
            { path: '/dashboard/users', icon: <Shield size={20} />, label: 'User Management' },
            { path: '/dashboard/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
        ],
        supervisor: [
            { path: '/dashboard/supervisor', icon: <Briefcase size={20} />, label: 'Internship Overview' },
            { path: '/dashboard/my-interns', icon: <UserCircle size={20} />, label: 'My Interns' },
            { path: '/dashboard/reviews', icon: <ClipboardList size={20} />, label: 'Weekly Reviews' },
            { path: '/dashboard/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
        ],
        student: [
            { path: '/dashboard/student', icon: <Activity size={20} />, label: 'My Progress' },
            { path: '/dashboard/opportunities', icon: <Briefcase size={20} />, label: 'Find Internships' },
            { path: '/dashboard/letter-request', icon: <Send size={20} />, label: 'Request Letter' },
            { path: '/dashboard/logbook', icon: <ClipboardList size={20} />, label: 'Weekly Logbook' },
            { path: '/dashboard/documents', icon: <FolderOpen size={20} />, label: 'Documents' },
            { path: '/dashboard/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
        ]
    };

    const role = user?.role?.toLowerCase() || 'student';
    const roleMenu = menuItems[role] || menuItems.student;
    const roleLabel = role === 'admin' ? 'ADMIN' : role === 'supervisor' ? 'SUPERVISOR' : 'STUDENT';

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
                        <div className="sidebar-avatar" style={{ 
                            background: user?.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            {!user?.avatar && (user?.name?.charAt(0) || 'U')}
                        </div>
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
                        <div className="notification-wrapper" ref={notifRef}>
                            <button className="icon-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                                <Bell size={20} />
                                {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
                            </button>
                            {isNotifOpen && (
                                <div className="notification-dropdown fade-in">
                                    <div className="notif-header">
                                        <h3>Notifications</h3>
                                        <span className="notif-count">{notifications.length} New</span>
                                    </div>
                                    <div className="notif-body">
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <div key={notif.id} className={`notif-item ${notif.type}`} onClick={() => {
                                                    navigate(notif.link);
                                                    setIsNotifOpen(false);
                                                }}>
                                                    <div className="notif-icon">
                                                        {notif.type === 'success' ? <CheckCircle size={16} /> : 
                                                         notif.type === 'error' ? <AlertCircle size={16} /> :
                                                         notif.type === 'warning' ? <Activity size={16} /> : <Bell size={16} />}
                                                    </div>
                                                    <div className="notif-content">
                                                        <h4>{notif.title}</h4>
                                                        <p>{notif.message}</p>
                                                        <span className="notif-time">{notif.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="notif-empty">
                                                <Bell size={32} />
                                                <p>No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="user-profile">
                            <div className="avatar" style={{ 
                                background: user?.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                                {!user?.avatar && (user?.name?.charAt(0) || 'U')}
                            </div>
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
