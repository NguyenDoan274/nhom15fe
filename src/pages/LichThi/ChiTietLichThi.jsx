import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChiTietLichThi() {
  const { id } = useParams(); // Lấy ID lịch thi từ URL
  const navigate = useNavigate();

  const [lichThi, setLichThi] = useState({});
  const [danhSachSinhVien, setDanhSachSinhVien] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Gọi API show() của LichThiController
      const res = await axios.get(`${baseURL}/api/lichthi/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = res.data?.data;
      setLichThi(data?.lichThi || {});
      
      // Dữ liệu sinh viên nằm trong bảng DiemDanh (do Backend thiết kế)
      const dsSinhVien = data?.sinhViens || [];
      setDanhSachSinhVien(dsSinhVien);
      
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      alert("⚠️ Không thể tải danh sách sinh viên.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa sinh viên khỏi phòng thi
  const handleRemoveStudent = async (diemDanhId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này khỏi phòng thi?")) return;
    try {
      // Gọi API removeStudent của LichThiController
      await axios.delete(`${baseURL}/api/lichthi/remove-student/${diemDanhId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData(); // Tải lại bảng sau khi xóa
    } catch (err) {
      alert("⚠️ Lỗi khi xóa sinh viên khỏi ca thi!");
    }
  };

  if (isLoading) return <div style={{ padding: '30px', fontSize: '16px', color: '#6b7280' }}>⏳ Đang tải dữ liệu...</div>;

  const tenMonHienThi = lichThi.mon_hoc?.ten_mon || lichThi.ten_mon || 'Không rõ môn';

  // Lọc sinh viên theo ô tìm kiếm
  const filteredSinhVien = danhSachSinhVien.filter(item => {
    const sv = item.sinh_vien || item.sinhVien;
    if (!sv) return false;
    const searchLower = searchTerm.toLowerCase();
    return (sv.ma_sv || "").toLowerCase().includes(searchLower) || 
           (sv.ho_ten || "").toLowerCase().includes(searchLower);
  });

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* TIÊU ĐỀ */}
      <h1 style={{ fontSize: '26px', fontWeight: 'normal', color: '#1f2937', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '30px' }}>📑</span> 
        Danh sách sinh viên phòng {lichThi.phong || '...'} – {tenMonHienThi}
      </h1>
      
      {/* NÚT TRỞ LẠI */}
      <button 
        onClick={() => navigate('/admin/lich-thi')} 
        style={{ backgroundColor: '#6c757d', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
      >
        Trở lại
      </button>

      {/* THANH TÌM KIẾM */}
      <div style={{ display: 'flex', marginBottom: '20px', maxWidth: '800px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#6b7280' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm theo MSSV hoặc tên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #ced4da', borderRadius: '4px 0 0 4px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          style={{ backgroundColor: '#0d6efd', color: 'white', padding: '0 20px', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}
        >
          Tìm kiếm
        </button>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#212529', color: 'white', textAlign: 'left', fontSize: '14px' }}>
            <th style={thStyle}>STT</th>
            <th style={thStyle}>MSSV</th>
            <th style={thStyle}>Họ tên</th>
            <th style={thStyle}>Lớp</th>
            <th style={thStyle}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredSinhVien.length > 0 ? (
            filteredSinhVien.map((item, index) => {
              const sv = item.sinh_vien || item.sinhVien; // Tùy cấu trúc Laravel trả về
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6', fontSize: '14px' }}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{sv?.ma_sv || 'N/A'}</td>
                  <td style={tdStyle}>{sv?.ho_ten || 'N/A'}</td>
                  <td style={tdStyle}>{sv?.lop || 'N/A'}</td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => handleRemoveStudent(item.id)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                Không tìm thấy sinh viên nào trong phòng thi này.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: '12px 15px', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'middle' };

export default ChiTietLichThi;