import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

function TeacherLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* SIDEBAR */}
        <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                <h1 style={{ color: '#1d4ed8', fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
                  <span style={{ color: '#dc2626' }}>S</span>TU
                </h1>
                <p style={{ color: '#dc2626', fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>Phòng Đào Tạo</p>
              </div>
      
          <nav style={{ padding: '10px' }}>
          <Link to="/giang-vien" className={`menu-item ${isActive('/giang-vien') ? 'active' : ''}`}>🏠 Màn hình chính</Link>
          <Link to="/giang-vien/ds-phong-thi" className={`menu-item ${isActive('/giang-vien/ds-phong-thi') ? 'active' : ''}`}>📝 DS phòng thi cá nhân</Link>
          <Link to="/giang-vien/tai-khoan" className={`menu-item ${isActive('/giang-vien/tai-khoan') ? 'active' : ''}`}>👤 Thông tin tài khoản</Link>
        </nav>
      </aside>
      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '60px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontWeight: 'bold', color: '#0d6efd' }}>🟦 Lớp học</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Xin chào, <strong>{user.ho_ten || 'Giảng viên'}</strong></span>
            <button onClick={handleLogout} style={{ backgroundColor: '#0d6efd', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer' }}>Đăng xuất</button>
          </div>
        </header>

        <div style={{ padding: '30px', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TeacherLayout;