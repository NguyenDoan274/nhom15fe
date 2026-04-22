import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SinhVienList() {
  const [danhSachSinhVien, setDanhSachSinhVien] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // State đúng theo yêu cầu Backend (lop_y và lop_z)
  const [formData, setFormData] = useState({
    ma_sv: '', ho_ten: '', email: '', lop_y: '', lop_z: '', hinh_anh: null
  });

  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';

  const apiBase = `${baseURL}/api/admin/sinhvien`;

  useEffect(() => { fetchData(); }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(apiBase, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { page: currentPage, search: searchTerm }
      });
      const result = res.data.data;
      setDanhSachSinhVien(result.data || []);
      setTotalPages(result.last_page || 1);
      setTotalRecords(result.total || 0);
    } catch (err) { console.error("Lỗi:", err); }
    finally { setIsLoading(false); }
  };

  const getImageUrl = (sv) => {
    if (!sv.ma_sv || !sv.lop) return '❌';
    const folderLop = sv.lop.toLowerCase();
    const timestamp = new Date().getTime();
    return `${baseURL}/uploads/hinhanh_sv/${folderLop}/${sv.ma_sv}.jpg?t=${timestamp}`;
  };

  const openAddForm = () => {
    setIsEditing(false);
    setFormData({ ma_sv: '', ho_ten: '', email: '', lop_y: '', lop_z: '', hinh_anh: null });
    setIsFormOpen(true);
  };

  const openEditForm = (sv) => {
    setIsEditing(true);
    setSelectedId(sv.id);
    const match = sv.lop?.match(/D(\d+)_TH(\d+)/);
    setFormData({
      ma_sv: sv.ma_sv,
      ho_ten: sv.ho_ten,
      email: sv.email,
      lop_y: match ? match[1] : '',
      lop_z: match ? match[2] : '',
      hinh_anh: null
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) return;
    try {
      await axios.delete(`${apiBase}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      alert("Đã xóa!");
      fetchData();
    } catch (err) { alert("Lỗi khi xóa!"); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('ma_sv', formData.ma_sv);
    data.append('ho_ten', formData.ho_ten);
    data.append('email', formData.email);
    data.append('lop_y', formData.lop_y);
    data.append('lop_z', formData.lop_z);
    if (formData.hinh_anh) data.append('hinh_anh', formData.hinh_anh);
    if (isEditing) data.append('_method', 'PUT');

    try {
      const url = isEditing ? `${apiBase}/${selectedId}` : apiBase;
      await axios.post(url, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert(isEditing ? "Cập nhật thành công!" : "Thêm thành công!");
      setIsFormOpen(true); // Giữ form mở hoặc đóng tùy ý bạn, thường là false
      setIsFormOpen(false);
      fetchData();
    } catch (err) { 
        const msg = err.response?.data?.message || "Lỗi dữ liệu!";
        alert(msg); 
    }
  };

  if (isFormOpen) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px' }}>
        <h2 style={{ color: '#4f46e5' }}>{isEditing ? '✏️ Cập nhật sinh viên' : '➕ Thêm sinh viên mới'}</h2>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
          <input placeholder="Mã SV" value={formData.ma_sv} onChange={e => setFormData({...formData, ma_sv: e.target.value})} required style={inputStyle} />
          <input placeholder="Họ tên" value={formData.ho_ten} onChange={e => setFormData({...formData, ho_ten: e.target.value})} required style={inputStyle} />
          <input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={inputStyle} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span>Lớp: D</span>
             <input placeholder="25" value={formData.lop_y} onChange={e => setFormData({...formData, lop_y: e.target.value})} required style={{...inputStyle, width: '60px'}} maxLength="2" />
             <span>_TH</span>
             <input placeholder="01" value={formData.lop_z} onChange={e => setFormData({...formData, lop_z: e.target.value})} required style={{...inputStyle, width: '60px'}} maxLength="2" />
          </div>

          <label>Ảnh sinh viên (nếu có):</label>
          <input type="file" onChange={e => setFormData({...formData, hinh_anh: e.target.files[0]})} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Lưu dữ liệu</button>
            <button type="button" onClick={() => setIsFormOpen(false)} style={{ backgroundColor: '#ef4444', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Quản lý Sinh viên ({totalRecords})</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openAddForm} style={btnAdd}>+ Thêm sinh viên</button>
        </div>
      </div>

      <input 
        placeholder="🔍 Tìm kiếm nhanh mã SV, tên hoặc lớp..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} 
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th style={thStyle}>MSSV</th>
            <th style={thStyle}>Họ và Tên</th>
            <th style={thStyle}>Lớp</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Ảnh</th>
            <th style={{...thStyle, textAlign: 'center'}}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Đang tải dữ liệu...</td></tr>
          ) : danhSachSinhVien.map(sv => (
            <tr key={sv.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={tdStyle}>{sv.ma_sv}</td>
              <td style={tdStyle}>{sv.ho_ten}</td>
              <td style={tdStyle}>{sv.lop}</td>
              <td style={tdStyle}>{sv.email}</td>
              <td style={tdStyle}>
                {(!sv.hinh_anh || imageErrors[sv.id]) ? (
                  <span>❌</span>
                ) : (
                  <img 
                    src={getImageUrl(sv)} 
                    alt={sv.ma_sv}
                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ddd' }}
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [sv.id]: true }));
                    }}
                  />
                )}
              </td>
              <td style={{...tdStyle, textAlign: 'center'}}>
                <button onClick={() => openEditForm(sv)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}>✏️</button>
                <button onClick={() => handleDelete(sv.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} style={pageBtn}>&laquo;</button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} style={pageBtn}>&raquo;</button>
      </div>
    </div>
  );
}

const thStyle = { padding: '16px', fontWeight: '600', color: '#374151' };
const tdStyle = { padding: '16px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd' };
const btnAdd = { backgroundColor: '#2563eb', color: '#fff', padding: '10px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const pageBtn = { padding: '5px 15px', cursor: 'pointer' };

export default SinhVienList;