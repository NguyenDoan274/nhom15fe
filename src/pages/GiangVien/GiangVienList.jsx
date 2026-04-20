import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GiangVienList() {
  const [danhSachGV, setDanhSachGV] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states - BỔ SUNG THÊM TRƯỜNG vai_tro
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ 
    ma_gv: '', 
    ho_ten: '', 
    email: '', 
    password: '', 
    vai_tro: 'giangvien' // Mặc định là giảng viên
  });

  // Excel state
  const [selectedExcelFile, setSelectedExcelFile] = useState(null);

  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
  const apiBase = `${baseURL}/api/admin/giangvien`;

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
      setDanhSachGV(res.data.data.data || res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu giảng viên:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${apiBase}/${selectedId}`, formData, { headers: { 'Authorization': `Bearer ${token}` }});
        alert("Cập nhật giảng viên thành công!");
      } else {
        await axios.post(apiBase, formData, { headers: { 'Authorization': `Bearer ${token}` }});
        alert("Thêm giảng viên thành công!");
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi lưu dữ liệu:", err);
      
      // MẸO CHỮA CHÁY FRONTEND: TỰ DỊCH LỖI TỪ LARAVEL
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        let errorMessages = [];

        // Kiểm tra xem có lỗi trùng mã GV không
        if (errors.ma_gv) {
            errorMessages.push("❌ Mã giảng viên này đã tồn tại trong hệ thống. Vui lòng chọn mã khác!");
        }
        // Kiểm tra xem có lỗi trùng Email không
        if (errors.email) {
            errorMessages.push("❌ Email này đã có người sử dụng!");
        }
        // Kiểm tra các lỗi khác
        if (errors.vai_tro) {
            errorMessages.push("❌ Vui lòng chọn vai trò.");
        }

        // Nếu có lỗi đã dịch thì in ra, nếu có lỗi lạ thì in lỗi gốc của Laravel
        if (errorMessages.length > 0) {
            alert("⚠️ KHÔNG THỂ LƯU DỮ LIỆU:\n\n" + errorMessages.join('\n'));
        } else {
            const rawErrors = Object.values(errors).flat().join('\n');
            alert("⚠️ LỖI:\n" + rawErrors);
        }
      } else {
        alert("Lỗi máy chủ: " + (err.response?.data?.message || "Không thể kết nối."));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa giảng viên này?")) {
      try {
        await axios.delete(`${apiBase}/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (err) { 
        console.error("Lỗi khi xóa:", err);
        alert("Lỗi khi xóa!"); 
      }
    }
  };

  const handleImportExcel = async () => {
    if (!selectedExcelFile) return alert("Chọn file Excel trước!");
    const data = new FormData();
    data.append('file', selectedExcelFile);
    try {
      await axios.post(`${apiBase}/import`, data, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Import thành công!");
      setIsExcelModalOpen(false);
      fetchData();
    } catch (err) { 
      console.error("Lỗi import:", err);
      alert("Lỗi import Excel!"); 
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '400', margin: 0 }}>Danh sách Giảng viên</h1>
        <button 
          onClick={() => { 
            setIsEditing(false); 
            // Reset form và set mặc định vai_tro là giangvien
            setFormData({ma_gv:'', ho_ten:'', email:'', password:'', vai_tro: 'giangvien'}); 
            setIsFormOpen(true); 
          }}
          style={{ backgroundColor: '#16a34a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
        >
          + Thêm Giảng viên
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0', marginBottom: '25px', maxWidth: '100%' }}>
        <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '15px', top: '12px', color: '#94a3b8' }}>🔍</span>
            <input 
                type="text" 
                placeholder="Tìm theo họ tên giảng viên..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e2e8f0', borderRadius: '8px 0 0 8px', outline: 'none' }}
            />
        </div>
        <button 
          onClick={fetchData}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '0 25px', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer' }}
        >
          Tìm kiếm
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="file" 
          onChange={(e) => setSelectedExcelFile(e.target.files[0])}
          style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '4px' }}
        />
        <button 
          onClick={handleImportExcel}
          style={{ backgroundColor: '#16a34a', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Import Excel
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
        <thead>
          <tr style={{ backgroundColor: '#1f2937', color: 'white', textAlign: 'left' }}>
            <th style={cellStyle}>Mã GV</th>
            <th style={cellStyle}>Họ tên</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Vai trò</th>
            <th style={cellStyle}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
          ) : danhSachGV.map((gv) => (
            <tr key={gv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={cellStyle}>{gv.ma_gv || gv.id}</td>
              <td style={cellStyle}>{gv.ho_ten}</td>
              <td style={cellStyle}>{gv.email}</td>
              <td style={cellStyle}>
                {gv.vai_tro === 'admin' ? (
                  <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Admin</span>
                ) : (
                  <span style={{ backgroundColor: '#dcfce3', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Giảng viên</span>
                )}
              </td>
              <td style={cellStyle}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => {
                        setIsEditing(true);
                        setSelectedId(gv.id);
                        setFormData({ ma_gv: gv.ma_gv, ho_ten: gv.ho_ten, email: gv.email, password: '', vai_tro: gv.vai_tro || 'giangvien' });
                        setIsFormOpen(true);
                    }}
                    style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >Sửa</button>
                  <button 
                    onClick={() => handleDelete(gv.id)}
                    style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >Xóa</button>
                  <button 
                    onClick={() => window.location.href = `/admin/giangvien/${gv.id}/phancong`}
                    style={{ backgroundColor: '#06b6d4', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >Phân công</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>{isEditing ? 'Cập nhật Giảng viên' : 'Thêm Giảng viên mới'}</h3>
            <form onSubmit={handleSave}>
              <input 
                placeholder="Mã Giảng viên" 
                value={formData.ma_gv} 
                onChange={e => setFormData({...formData, ma_gv: e.target.value})} 
                required style={inputStyle} 
              />
              <input 
                placeholder="Họ tên" 
                value={formData.ho_ten} 
                onChange={e => setFormData({...formData, ho_ten: e.target.value})} 
                required style={inputStyle} 
              />
              <input 
                placeholder="Email" 
                type="email"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required style={inputStyle} 
              />
              
              {/* Menu thả xuống chọn Vai trò */}
              <select 
                value={formData.vai_tro} 
                onChange={e => setFormData({...formData, vai_tro: e.target.value})} 
                required style={inputStyle}
              >
                <option value="giangvien">Giảng viên coi thi</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>

              {/* Chỉ hiện ô nhập mật khẩu khi tạo mới */}
              {!isEditing && (
                <input 
                    placeholder="Mật khẩu" 
                    type="password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required style={inputStyle} 
                />
              )}
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Lưu</button>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS Styles
const cellStyle = { padding: '12px', borderBottom: '1px solid #f1f5f9' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
const modalContent = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' };

export default GiangVienList;