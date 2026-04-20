import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MonHocList() {
  const [danhSachMonHoc, setDanhSachMonHoc] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ ma_mon: '', ten_mon: '' });

  const token = localStorage.getItem('token');
        const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';

  const apiBase = `${baseURL}/api/admin/monhoc`; // API Backend


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(apiBase, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: searchTerm }
      });
      setDanhSachMonHoc(res.data.data.data || res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu môn học:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${apiBase}/${selectedId}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Cập nhật môn học thành công!");
      } else {
        await axios.post(apiBase, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Thêm môn học thành công!");
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi lưu dữ liệu:", err);
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        if (errors.ma_mon) {
          alert("⚠️ LỖI: Mã môn học này đã tồn tại. Vui lòng nhập mã khác!");
        } else {
          alert("⚠️ LỖI KIỂM TRA DỮ LIỆU:\n" + Object.values(errors).flat().join('\n'));
        }
      } else {
        alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu dữ liệu"));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa môn học này không?")) {
      try {
        await axios.delete(`${apiBase}/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (err) { 
        alert("Lỗi khi xóa! Có thể môn học này đang được xếp lịch thi."); 
      }
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'normal', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '30px' }}>📚</span> Danh sách môn học
        </h1>
        <button 
          onClick={() => { 
            setIsEditing(false); 
            setFormData({ ma_mon: '', ten_mon: '' }); 
            setIsFormOpen(true); 
          }}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px' }}
        >
          + Thêm môn học
        </button>
      </div>

      {/* --- THANH TÌM KIẾM --- */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#6b7280' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm theo mã môn hoặc tên môn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #d1d5db', borderRadius: '4px 0 0 4px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          onClick={fetchData}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '0 20px', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}
        >
          Tìm kiếm
        </button>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <th style={thStyle}>Mã môn</th>
            <th style={thStyle}>Tên môn</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px' }}>Đang tải dữ liệu...</td></tr>
          ) : danhSachMonHoc.length > 0 ? (
            danhSachMonHoc.map((mon) => (
              <tr key={mon.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={tdStyle}>{mon.ma_mon}</td>
                <td style={tdStyle}>{mon.ten_mon}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button 
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedId(mon.id);
                      setFormData({ ma_mon: mon.ma_mon, ten_mon: mon.ten_mon });
                      setIsFormOpen(true);
                    }}
                    style={btnEdit}
                  >
                    ✏️ Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(mon.id)}
                    style={btnDelete}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
             <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Chưa có dữ liệu môn học.</td></tr>
          )}
        </tbody>
      </table>

      {/* --- MODAL THÊM/SỬA --- */}
      {isFormOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1f2937' }}>
              {isEditing ? 'Cập nhật Môn học' : 'Thêm Môn học mới'}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Mã môn học</label>
                <input 
                  type="text" 
                  value={formData.ma_mon} 
                  onChange={e => setFormData({...formData, ma_mon: e.target.value})} 
                  placeholder="VD: CS00040"
                  required 
                  style={inputStyle} 
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Tên môn học</label>
                <input 
                  type="text" 
                  value={formData.ten_mon} 
                  onChange={e => setFormData({...formData, ten_mon: e.target.value})} 
                  placeholder="VD: Mã nguồn mở"
                  required 
                  style={inputStyle} 
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer', flex: 1 }}>
                  Lưu dữ liệu
                </button>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ backgroundColor: '#9ca3af', color: 'white', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer', flex: 1 }}>
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- CSS Styles ---
const thStyle = { padding: '15px', textAlign: 'left', color: '#111827' };
const tdStyle = { padding: '15px', color: '#374151' };
const btnEdit = { backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '13px' };
const btnDelete = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };

export default MonHocList;