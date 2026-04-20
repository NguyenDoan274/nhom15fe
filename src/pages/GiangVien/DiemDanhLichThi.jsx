import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function DiemDanhLichThi() {
  const { id } = useParams(); // Lấy ID lịch thi từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/giang-vien';

  const [lichThi, setLichThi] = useState({});
  const [danhSach, setDanhSach] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [chuaDiemDanh, setChuaDiemDanh] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const fetchDanhSach = async () => {
    setIsLoading(true);
    try {
      // Gọi API lấy danh sách sinh viên của phòng thi này
      const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
      const res = await axios.get(`${baseURL}/api/rekognition/diemdanh/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          search: searchTerm,
          chua_diem_danh: chuaDiemDanh ? 1 : ''
        }
      });
      
      const data = res.data?.data;
      setLichThi(data?.lichThi || {});
      setDanhSach(data?.sinhViens || []);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      alert("⚠️ Không thể tải dữ liệu điểm danh!");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý tìm kiếm khi bấm nút "Tìm kiếm"
  const handleSearch = (e) => {
    e.preventDefault();
    fetchDanhSach();
  };

  // Hàm điểm danh thủ công (Checkbox)
  const handleToggleDiemDanh = async (diemDanhId) => {
    try {
      const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
      // Gọi API toggle trạng thái điểm danh thủ công
      await axios.post(`${baseURL}/api/diemdanh/toggle`, 
        { id: diemDanhId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      // Cập nhật lại danh sách sau khi tick
      fetchDanhSach();
    } catch (error) {
      alert("⚠️ Lỗi khi cập nhật trạng thái điểm danh thủ công!");
    }
  };

  const tenMonHienThi = lichThi.mon_hoc?.ten_mon || lichThi.ten_mon || '...';

  // Format thời gian hiển thị (VD: 2026-04-05 08:30:00 -> 08:30:00)
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { hour12: false });
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* TIÊU ĐỀ */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'normal', color: '#374151', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📋</span> Danh sách sinh viên phòng {lichThi.phong || '...'} – {tenMonHienThi}
        </h1>
      </div>

      {/* THANH CÔNG CỤ (Nút Trở lại & Điểm danh) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
         onClick={() => navigate(`${basePath}/ds-phong-thi`)}
          style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}
        >
          🗂️ Danh sách phòng thi
        </button>
        <button 
         onClick={() => navigate(`${basePath}/diem-danh-camera/${id}`)}
          style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold' }}
        >
          📷 Điểm danh
        </button>
      </div>

      {/* BỘ LỌC TÌM KIẾM */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <span style={{ position: 'absolute', left: '10px', top: '8px', color: '#6b7280' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm MSSV hoặc tên sinh viên" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={chuaDiemDanh}
            onChange={(e) => setChuaDiemDanh(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          Chưa điểm danh
        </label>

        <button type="submit" style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
          Tìm kiếm
        </button>
      </form>

      {/* BẢNG DỮ LIỆU */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#212529', color: 'white', textAlign: 'left', fontSize: '14px' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Mã SV</th>
              <th style={thStyle}>Họ tên</th>
              <th style={thStyle}>Lớp</th>
              <th style={{...thStyle, textAlign: 'center'}}>Điểm danh</th>
              <th style={thStyle}>Kết quả</th>
              <th style={thStyle}>Độ chính xác</th>
              <th style={thStyle}>Thời gian</th>
              <th style={thStyle}>Hình thức</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px' }}>Đang tải danh sách...</td></tr>
            ) : danhSach.length > 0 ? (
              danhSach.map((item, index) => {
                const sv = item.sinh_vien || item.sinhVien || {};
                const isChecked = item.ket_qua === 'hợp lệ';

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6', fontSize: '14px' }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{sv.ma_sv || '-'}</td>
                    <td style={tdStyle}>{sv.ho_ten || '-'}</td>
                    <td style={tdStyle}>{sv.lop || '-'}</td>
                    <td style={{...tdStyle, textAlign: 'center'}}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleToggleDiemDanh(item.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{...tdStyle, color: isChecked ? '#198754' : '#374151', fontWeight: isChecked ? 'bold' : 'normal'}}>
                      {item.ket_qua || 'Vắng mặt'}
                    </td>
                    <td style={tdStyle}>{item.do_chinh_xac ? `${item.do_chinh_xac}%` : '-'}</td>
                    <td style={tdStyle}>{formatTime(item.thoi_gian_dd)}</td>
                    <td style={tdStyle}>{item.hinh_thuc || '-'}</td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>Không tìm thấy sinh viên nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

const thStyle = { padding: '12px 15px', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'middle' };

export default DiemDanhLichThi;