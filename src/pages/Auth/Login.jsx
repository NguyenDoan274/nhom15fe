import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. GỌI API ĐĂNG NHẬP 
      const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
      const response = await axios.post(`${baseURL}/api/login`, {
        email: email,
        password: password
      });

      // 2. BÓC TÁCH DỮ LIỆU ĐÚNG CẤU TRÚC LARAVEL TRẢ VỀ
      // Đã sửa lại để truy cập đúng lớp response.data.data
      const token = response.data.data.access_token;
      const user = response.data.data.user;

      // 3. LƯU VÀO LOCALSTORAGE ĐỂ DÙNG CHO CÁC TRANG KHÁC
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Lấy vai trò (Xử lý an toàn nếu user không có trường vai_tro)
      const userRole = user.vai_tro || user.role || 'giangvien';
      localStorage.setItem('role', userRole); 

      // 4. THÔNG BÁO VÀ CHUYỂN TRANG
      alert(`Đăng nhập thành công! Chào mừng ${user.ho_ten || user.name || 'bạn'}!`);
      
      // Chuyển hướng dựa trên vai trò
      if (userRole === 'admin') {
        window.location.href = '/admin/sinh-vien'; // Đã sửa link trỏ về trang Quản lý Sinh viên
      } else {
        window.location.href = '/teacher/dashboard';
      }

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      // Bắt lỗi an toàn hơn
      if (err.response && err.response.status === 401) {
        setError('Email hoặc mật khẩu không chính xác!');
      } else {
        setError('Lỗi kết nối. Hãy kiểm tra lại Console!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#1f2937', fontWeight: 'bold', margin: '0 0 8px 0' }}>STU LOGIN</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Hệ thống điểm danh khuôn mặt</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email</label>
            <input 
              type="email" 
              required
              placeholder="admin@stu.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Mật khẩu</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: isLoading ? '#9ca3af' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {isLoading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>
          Hỗ trợ: phongdaotao@stu.edu.vn
        </div>
      </div>
    </div>
  );
}

export default Login;