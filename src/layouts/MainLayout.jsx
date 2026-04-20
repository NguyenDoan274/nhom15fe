import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      
      {/* SIDEBAR DÀNH CHO ADMIN */}
      <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
          <h1 style={{ color: '#1d4ed8', fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
            <span style={{ color: '#dc2626' }}>S</span>TU
          </h1>
          <p style={{ color: '#dc2626', fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>Phòng Đào Tạo</p>
        </div>

        <ul style={{ listStyle: 'none', padding: '20px 12px', display: 'flex', flexDirection: 'column' }}>
          {/* Chú ý đường dẫn bây giờ bắt đầu bằng /admin */}
          <li><Link to="/admin" className={`menu-item ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}>🏠 Màn hình chính</Link></li>
          <li><Link to="/admin/sinh-vien" className={`menu-item ${isActive('/admin/sinh-vien') ? 'active' : ''}`}>👨‍🎓 Quản lý sinh viên</Link></li>
          <li><Link to="/admin/giang-vien" className={`menu-item ${isActive('/admin/giang-vien') ? 'active' : ''}`}>👨‍🏫 Quản lý giảng viên</Link></li>
          <li><Link to="/admin/mon-hoc" className={`menu-item ${isActive('/admin/mon-hoc') ? 'active' : ''}`}>📚 Quản lý môn học</Link></li>
          <li><Link to="/admin/lich-thi" className={`menu-item ${isActive('/admin/lich-thi') ? 'active' : ''}`}>📅 Quản lý lịch thi</Link></li>
          <li><Link to="/admin/train-du-lieu" className={`menu-item ${isActive('/admin/train-du-lieu') ? 'active' : ''}`}>🧠 Train dữ liệu AI</Link></li>
        </ul>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* HEADER DÀNH CHO ADMIN */}
        <header style={{ height: '72px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ backgroundColor: '#dc2626', color: 'white', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>AD</span>
            <span style={{ fontWeight: '500', color: '#374151', fontSize: '16px' }}>Quản trị hệ thống</span>
          </div>

          <div>
            <span style={{ marginRight: '16px', fontWeight: 'bold', color: '#dc2626' }}>Admin Đào Tạo</span>
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

export default AdminLayout;