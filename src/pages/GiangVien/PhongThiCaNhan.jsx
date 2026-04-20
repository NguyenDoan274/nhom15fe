import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function PhongThiCaNhan() {
  const [danhSachLichThi, setDanhSachLichThi] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
const location = useLocation();
  // Nếu đang ở /admin thì basePath là /admin, ngược lại là /giang-vien
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/giang-vien';
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetchLichThiCaNhan();
  }, []);

  const fetchLichThiCaNhan = async () => {
    setIsLoading(true);
    try {
      // Gọi API lấy danh sách lịch thi
      const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
      const res = await axios.get(`${baseURL}/api/lichthi`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rawData = res.data?.data?.data || res.data?.data || [];
      setDanhSachLichThi(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      console.error("Lỗi tải danh sách phòng thi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm lọc tìm kiếm tại frontend
  const filteredList = danhSachLichThi.filter(lich => {
    const tenMon = lich.mon_hoc?.ten_mon || lich.ten_mon || '';
    const phong = lich.phong || '';
    const searchLower = searchTerm.toLowerCase();
    return tenMon.toLowerCase().includes(searchLower) || phong.toLowerCase().includes(searchLower);
  });

  // Hàm ghép ngày và giờ cho đẹp (2026-03-18 & 19:08:00 => 18/03/2026 19:08)
  const formatDateTime = (ngay, gio) => {
    if (!ngay || !gio) return '';
    const [year, month, day] = ngay.split('-');
    const [hour, minute] = gio.split(':');
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* TIÊU ĐỀ */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'normal', color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>📅</span> Danh sách phòng thi
        </h1>
      </div>

      {/* THANH TÌM KIẾM */}
      <div style={{ display: 'flex', marginBottom: '20px', maxWidth: '100%' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '15px', top: '10px', color: '#6b7280' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm theo phòng hoặc tên môn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #ced4da', borderRadius: '4px 0 0 4px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          style={{ backgroundColor: '#0d6efd', color: 'white', padding: '0 25px', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
        >
          Tìm kiếm
        </button>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div style={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#212529', color: 'white', textAlign: 'left', fontSize: '14px' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Tên môn</th>
              <th style={thStyle}>Ngày thi</th>
              <th style={thStyle}>Phòng</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Đang tải danh sách phòng thi...</td></tr>
            ) : filteredList.length > 0 ? (
              filteredList.map((lich, index) => {
                const tenMon = lich.mon_hoc?.ten_mon || lich.ten_mon || 'Không rõ';
                const isFinished = lich.trang_thai === 'da_ket_thuc';
                const isNotStarted = lich.trang_thai === 'chua_dien_ra';

                return (
                  <tr key={lich.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{tenMon}</td>
                    <td style={tdStyle}>{formatDateTime(lich.ngay_thi, lich.gio_thi)}</td>
                    <td style={tdStyle}>{lich.phong}</td>
                    <td style={tdStyle}>
                      <span style={{ 
                        backgroundColor: isFinished ? '#6c757d' : (isNotStarted ? '#eab308' : '#10b981'), 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' 
                      }}>
                        {isFinished ? 'Đã kết thúc' : (isNotStarted ? 'Chưa diễn ra' : 'Đang diễn ra')}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button 
                      onClick={() => navigate(`${basePath}/diem-danh/${lich.id}`)}
                        style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        👁️ Xem sinh viên
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>Bạn chưa được phân công phòng thi nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 15px', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'middle' };

export default PhongThiCaNhan;