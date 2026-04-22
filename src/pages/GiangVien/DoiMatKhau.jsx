import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DoiMatKhau() {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu khớp nhau ở Frontend trước
    if (formData.new_password !== formData.new_password_confirmation) {
      setError('Mật khẩu mới và xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${baseURL}/api/tai-khoan/doi-mat-khau`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert(res.data.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      
      // Theo logic Backend: Xóa token cũ khi đổi mật khẩu
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      // Hiển thị lỗi từ Laravel validate gửi về
      const msg = err.response?.data?.message || "Lỗi cập nhật mật khẩu!";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>🔒 Đổi mật khẩu</h4>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Mật khẩu hiện tại</label>
            <input 
              type="password" 
              required 
              style={inputStyle}
              onChange={e => setFormData({...formData, current_password: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Mật khẩu mới</label>
            <input 
              type="password" 
              required 
              style={inputStyle}
              onChange={e => setFormData({...formData, new_password: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Xác nhận mật khẩu mới</label>
            <input 
              type="password" 
              required 
              style={inputStyle}
              onChange={e => setFormData({...formData, new_password_confirmation: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}
            >
              {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/giang-vien/tai-khoan')}
              style={{ flex: 1, backgroundColor: '#9ca3af', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };

export default DoiMatKhau;