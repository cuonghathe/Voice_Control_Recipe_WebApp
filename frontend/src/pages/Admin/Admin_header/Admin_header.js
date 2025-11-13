import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../admin.scss';

const Header = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <>
            <header className="admin-sidebar">
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <NavLink to='/admin' className="sidebar-logo">
                            AdminPanel
                        </NavLink>
                    </div>
                    
                    <nav className="sidebar-nav">
                        <NavLink to="/admin/overall" className="nav-item">
                            <span>Tổng quan</span>
                        </NavLink>
                        
                        <NavLink to="/admin" className="nav-item">
                            <span>Quản lý công thức</span>
                        </NavLink>
                        
                        <NavLink to="/admin/User/Manage" className="nav-item">
                            <span>Quản lý người dùng</span>
                        </NavLink>

                        <NavLink to="/" className="nav-item" target="_blank">
                            <span>Trang chủ</span>
                        </NavLink>
                    </nav>
                    
                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="logout-btn">
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;

