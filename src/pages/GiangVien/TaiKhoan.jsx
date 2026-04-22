import React from 'react';
import { useNavigate } from 'react-router-dom';

function TaiKhoan() {
  const navigate = useNavigate();
  // Lấy dữ liệu user từ localStorage đã lưu lúc login
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '50px',
    minHeight: '80vh'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  };

  const tableStyle = {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '12px 0',
    color: '#4b5563',
    width: '120px',
    borderBottom: '1px solid #f3f4f6'
  };

  const tdStyle = {
    padding: '12px 0',
    fontWeight: '600',
    color: '#1f2937',
    borderBottom: '1px solid #f3f4f6'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h4 style={{ textAlign: 'center', marginBottom: '25px', color: '#111827' }}>
          Thông tin tài khoản
        </h4>
        
        <table style={tableStyle}>
          <tbody>
            <tr>
              <th style={thStyle}>Họ và tên:</th>
              <td style={tdStyle}>{user.ho_ten || 'N/A'}</td>
            </tr>
            <tr>
              <th style={thStyle}>Email:</th>
              <td style={tdStyle}>{user.email || 'N/A'}</td>
            </tr>
            <tr>
              <th style={thStyle}>Vai trò:</th>
              <td style={tdStyle}>
                {user.vai_tro === 'giang_vien' ? 'Giảng viên' : user.vai_tro}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => navigate('/giang-vien/doi-mat-khau')}
            style={{ 

              backgroundColor: '#2563eb', 
              color: '#fff', 
              padding: '10px 24px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaiKhoan;