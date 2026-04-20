import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

function TeacherLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      
      {/* SIDEBAR DÀNH CHO GIÁO VIÊN */}
      <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
          <h1 style={{ color: '#1d4ed8', fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
            <span style={{ color: '#dc2626' }}>S</span>TU
          </h1>
          <p style={{ color: '#2563eb', fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>Hệ thống điểm danh</p>
        </div>

        <ul style={{ listStyle: 'none', padding: '20px 12px', display: 'flex', flexDirection: 'column' }}>
          {/* Chú ý đường dẫn bây giờ bắt đầu bằng /teacher */}
          <li><Link to="/teacher" className={`menu-item ${isActive('/teacher') && location.pathname === '/teacher' ? 'active' : ''}`}>🏠 Màn hình chính</Link></li>
          <li><Link to="/teacher/lich-thi" className={`menu-item ${isActive('/teacher/lich-thi') ? 'active' : ''}`}>📅 Lịch thi toàn bộ</Link></li>
          <li><Link to="/teacher/phong-thi" className={`menu-item ${isActive('/teacher/phong-thi') ? 'active' : ''}`}>📝 DS phòng thi cá nhân</Link></li>
          <li style={{ marginTop: '20px' }}><Link to="/teacher/tai-khoan" className={`menu-item ${isActive('/teacher/tai-khoan') ? 'active' : ''}`}>👤 Thông tin tài khoản</Link></li>
        </ul>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* HEADER DÀNH CHO GIÁO VIÊN */}
        <header style={{ height: '72px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ backgroundColor: '#2563eb', color: 'white', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>GV</span>
            <span style={{ fontWeight: '500', color: '#374151', fontSize: '16px' }}>Giáo viên gác thi</span>
          </div>

          <div>
            <span style={{ marginRight: '16px', fontWeight: 'bold', color: '#1d4ed8' }}>GV. Trần Văn Hùng</span>
            <button onClick={() => navigate('/login')} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '24px', cursor: 'pointer' }}>
              Đăng xuất
            </button>
          </div>
        </header>

        <div style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

export default TeacherLayout;