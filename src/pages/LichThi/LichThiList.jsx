import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LichThiList() {
  const [danhSachLichThi, setDanhSachLichThi] = useState([]);
  const [danhSachMonHoc, setDanhSachMonHoc] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE BỘ LỌC ---
  const [filters, setFilters] = useState({
    mssv: '', ten_mon: '', phong: '', ngay_thi: '', gio_thi: '', ky_thi: '', nam_hoc: '', trang_thai: ''
  });

  // --- STATE FORM THÊM/SỬA LỊCH THI ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [searchMonHoc, setSearchMonHoc] = useState('');
  const [showMonDropdown, setShowMonDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    mon_hoc_id: '', khu: '', tang: '', phong: '', ky_thi: '', nam_hoc: '2025-2026', ngay_thi: '', gio_thi: ''
  });

  // --- STATE MODAL THÊM SINH VIÊN (MỚI) ---
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [targetLichThiId, setTargetLichThiId] = useState(null);
  const [mssvInput, setMssvInput] = useState('');
  const [studentPreview, setStudentPreview] = useState('');

  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
  const apiLichThi = `${baseURL}/api/lichthi`;
  const apiMonHoc = `${baseURL}/api/admin/monhoc`;

  useEffect(() => {
    fetchMonHoc();
    fetchLichThi();
  }, []);

  // HIỆU ỨNG TÌM KIẾM TÊN SINH VIÊN TỰ ĐỘNG
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Tách các MSSV bằng dấu xuống dòng, loại bỏ khoảng trắng thừa và dòng trống
      const mssvArray = mssvInput.split('\n').map(s => s.trim()).filter(s => s);
      
      if (mssvArray.length === 0) {
        setStudentPreview('');
        return;
      }
      
      setStudentPreview('⏳ Đang dò tìm thông tin sinh viên...');
      
      try {
        // Gọi API search-list của SinhVienController
        const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
        const res = await axios.post(`${baseURL}/api/sinhvien/search-list`, 
          { mssv: mssvArray }, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        const students = res.data?.data || [];
        if (students.length > 0) {
           // Lắp ráp tên tương ứng với từng MSSV
           const previewText = mssvArray.map(ma_sv => {
              const found = students.find(s => s.ma_sv === ma_sv);
              return found ? `${found.ma_sv} - ${found.ho_ten}` : `${ma_sv} - ❌ Không tìm thấy`;
           }).join('\n');
           setStudentPreview(previewText);
        } else {
           setStudentPreview('❌ Không tìm thấy sinh viên nào khớp với các MSSV trên.');
        }
      } catch (error) {
        setStudentPreview('⚠️ Dữ liệu sẽ được đối chiếu khi bạn nhấn "Thêm toàn bộ".');
      }
    }, 800); // Đợi 0.8s sau khi gõ xong mới gọi API cho đỡ lag

    return () => clearTimeout(delayDebounceFn);
  }, [mssvInput]);

  const fetchLichThi = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(apiLichThi, { headers: { 'Authorization': `Bearer ${token}` }, params: filters });
      const rawData = res.data?.data?.data || res.data?.data || res.data || [];
      setDanhSachLichThi(Array.isArray(rawData) ? rawData : []);
    } catch (err) { console.error("Lỗi tải lịch thi:", err); } 
    finally { setIsLoading(false); }
  };

  const fetchMonHoc = async () => {
    try {
      const res = await axios.get(apiMonHoc, { headers: { 'Authorization': `Bearer ${token}` } });
      const rawData = res.data?.data?.data || res.data?.data || res.data || [];
      setDanhSachMonHoc(Array.isArray(rawData) ? rawData : []);
    } catch (err) { console.error("Không tải được môn học:", err); }
  };

  // --- HÀM THÊM SINH VIÊN VÀO CA THI ---
  const handleAddStudentsSubmit = async () => {
    const mssvArray = mssvInput.split('\n').map(s => s.trim()).filter(s => s);
    if (mssvArray.length === 0) return alert("Vui lòng nhập ít nhất 1 MSSV!");

    try {
      const res = await axios.post(`${apiLichThi}/${targetLichThiId}/add-students`, 
        { mssv: mssvArray }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const data = res.data;
      let msg = `🎉 KẾT QUẢ THÊM SINH VIÊN:\n\n✅ Thêm thành công: ${data.added?.length || 0} SV\n⚠️ Bỏ qua: ${data.skipped?.length || 0} SV`;
      
      // Hiển thị chi tiết các sinh viên bị trùng lịch để Admin biết
      if (data.skipped?.length > 0) {
          msg += `\n\n📌 Lý do bỏ qua (Trùng lịch / Đã có trong phòng):\n- ` + data.skipped.join('\n- ');
      }
      
      alert(msg);
      setIsAddStudentModalOpen(false);
      setMssvInput('');
      setStudentPreview('');
      fetchLichThi(); // Tải lại bảng để cập nhật số lượng "SL: xx SV"
    } catch (err) {
      alert("⚠️ Lỗi khi thêm sinh viên: " + (err.response?.data?.message || err.message));
    }
  };

  // --- HÀM XỬ LÝ LỊCH THI ---
  const handleSaveLichThi = async (e) => {
    e.preventDefault();
    if (!formData.mon_hoc_id) return alert("Vui lòng chọn một Môn học từ danh sách!");
    
    const tenPhong = `${formData.khu}${formData.tang}${formData.phong}`;
    const dataToSend = { ...formData, phong: tenPhong };

    try {
      if (isEditing) {
        await axios.put(`${apiLichThi}/${selectedId}`, dataToSend, { headers: { 'Authorization': `Bearer ${token}` } });
        alert("🎉 Cập nhật lịch thi thành công!");
      } else {
        await axios.post(apiLichThi, dataToSend, { headers: { 'Authorization': `Bearer ${token}` } });
        alert("🎉 Thêm lịch thi thành công!");
      }
      setIsFormOpen(false);
      fetchLichThi();
    } catch (err) {
      if (err.response?.status === 422) alert("⚠️ KIỂM TRA LẠI DỮ LIỆU:\n" + Object.values(err.response.data.errors).flat().join('\n'));
      else alert("⚠️ LỖI.");
    }
  };

  const handleEditClick = (lich) => {
    setIsEditing(true);
    setSelectedId(lich.id);
    let khu = '', tang = '', phongNum = '';
    if (lich.phong && lich.phong.length >= 3) {
      khu = lich.phong.charAt(0); tang = lich.phong.charAt(1); phongNum = lich.phong.substring(2);
    }
    setFormData({ ...lich, khu, tang, phong: phongNum });
    const mon = danhSachMonHoc.find(m => m.id === lich.mon_hoc_id);
    setSearchMonHoc(mon ? `${mon.ten_mon} (${mon.ma_mon})` : 'Không rõ');
    setIsFormOpen(true);
  };

  const handleSelectMonHoc = (mon) => {
    setFormData({ ...formData, mon_hoc_id: mon.id });
    setSearchMonHoc(`${mon.ten_mon} (${mon.ma_mon})`);
    setShowMonDropdown(false);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa lịch thi này?")) {
      try {
        await axios.delete(`${apiLichThi}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        fetchLichThi();
      } catch (err) { alert("Lỗi khi xóa!"); }
    }
  };

  // ==========================================
  // GIAO DIỆN 1: FORM THÊM / SỬA LỊCH THI
  // ==========================================
  if (isFormOpen) {
    const filteredMonHoc = danhSachMonHoc.filter(m => 
      (m.ten_mon || "").toLowerCase().includes((searchMonHoc || "").toLowerCase()) || 
      (m.ma_mon || "").toLowerCase().includes((searchMonHoc || "").toLowerCase())
    );

    return (
      <div style={{ padding: '30px', backgroundColor: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'normal', marginBottom: '15px' }}>{isEditing ? 'Cập nhật lịch thi' : 'Thêm lịch thi'}</h1>
        <button onClick={() => setIsFormOpen(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '25px' }}>Trở lại</button>

        <form onSubmit={handleSaveLichThi} style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={labelStyle}>Môn học</label>
            <input type="text" placeholder="Tìm kiếm môn học..." value={searchMonHoc} onChange={(e) => { setSearchMonHoc(e.target.value); setFormData({ ...formData, mon_hoc_id: '' }); setShowMonDropdown(true); }} onFocus={() => setShowMonDropdown(true)} style={inputStyle} />
            {showMonDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #3b82f6', borderRadius: '0 0 4px 4px', maxHeight: '200px', overflowY: 'auto', zIndex: 10 }}>
                {filteredMonHoc.length > 0 ? filteredMonHoc.map((mon) => (
                  <div key={mon.id} onClick={() => handleSelectMonHoc(mon)} style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#3b82f6'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'black'; }}>
                    {mon.ten_mon} ({mon.ma_mon})
                  </div>
                )) : <div style={{ padding: '10px 15px', color: '#6b7280' }}>Không tìm thấy</div>}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Phòng</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select required value={formData.khu} onChange={e => setFormData({...formData, khu: e.target.value})} style={{ ...inputStyle, width: 'auto' }}>
                <option value="">Chọn khu</option><option value="A">Khu A</option><option value="B">Khu B</option><option value="C">Khu C</option><option value="D">Khu D</option>
              </select>
              <input required type="text" placeholder="Tầng" maxLength="1" value={formData.tang} onChange={e => setFormData({...formData, tang: e.target.value})} style={{ ...inputStyle, width: '100px' }} />
              <input required type="text" placeholder="Phòng" maxLength="2" value={formData.phong} onChange={e => setFormData({...formData, phong: e.target.value})} style={{ ...inputStyle, width: '120px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Ngày thi</label><input required type="date" value={formData.ngay_thi} onChange={e => setFormData({...formData, ngay_thi: e.target.value})} style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Giờ thi</label><input required type="time" value={formData.gio_thi} onChange={e => setFormData({...formData, gio_thi: e.target.value})} style={inputStyle} /></div>
          </div>

          <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Kỳ thi</label><input required type="text" value={formData.ky_thi} onChange={e => setFormData({...formData, ky_thi: e.target.value})} style={inputStyle} /></div>
          <div style={{ marginBottom: '30px' }}><label style={labelStyle}>Năm học</label><input required type="text" value={formData.nam_hoc} onChange={e => setFormData({...formData, nam_hoc: e.target.value})} style={inputStyle} /></div>

          <button type="submit" style={{ backgroundColor: isEditing ? '#eab308' : '#16a34a', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            {isEditing ? 'Cập nhật' : 'Thêm'}
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // GIAO DIỆN 2: BẢNG LỊCH THI 
  // ==========================================
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#fff', minHeight: '100vh', position: 'relative' }}>
      
      {/* MÀN CHẮN & MODAL THÊM SINH VIÊN CỦA BẠN */}
      {isAddStudentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '600px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#374151', fontWeight: 'normal' }}>Thêm sinh viên vào ca thi</h3>
              <button onClick={() => setIsAddStudentModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>

            <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563' }}>Nhập MSSV (Mỗi mã 1 dòng):</label>
                <textarea 
                  value={mssvInput}
                  onChange={(e) => setMssvInput(e.target.value)}
                  placeholder="Ví dụ:&#10;DH52001&#10;DH52002"
                  style={{ width: '100%', height: '200px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563' }}>Tên sinh viên:</label>
                <textarea 
                  value={studentPreview}
                  readOnly
                  placeholder="Nhập MSSV để hiển thị..."
                  style={{ width: '100%', height: '200px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', resize: 'none', backgroundColor: '#f9fafb', color: '#374151', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ padding: '15px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsAddStudentModalOpen(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng</button>
              <button onClick={handleAddStudentsSubmit} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm toàn bộ</button>
            </div>

          </div>
        </div>
      )}

      {/* --- PHẦN HEADER VÀ BỘ LỌC TÌM KIẾM --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'normal', margin: 0, color: '#1f2937' }}>Danh sách lịch thi</h1>
        <button onClick={() => { setIsEditing(false); setIsFormOpen(true); setFormData({mon_hoc_id: '', khu: '', tang: '', phong: '', ky_thi: '', nam_hoc: '2025-2026', ngay_thi: '', gio_thi: ''}); setSearchMonHoc(''); }} style={{ backgroundColor: '#16a34a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px' }}>+ Thêm mới</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        <input name="mssv" placeholder="MSSV" value={filters.mssv} onChange={e => setFilters({...filters, mssv: e.target.value})} style={filterInputStyle} />
        <input name="ten_mon" placeholder="Tên môn" value={filters.ten_mon} onChange={e => setFilters({...filters, ten_mon: e.target.value})} style={filterInputStyle} />
        <input name="phong" placeholder="Phòng" value={filters.phong} onChange={e => setFilters({...filters, phong: e.target.value})} style={filterInputStyle} />
        <input name="ngay_thi" type="date" value={filters.ngay_thi} onChange={e => setFilters({...filters, ngay_thi: e.target.value})} style={filterInputStyle} />
        <input name="gio_thi" type="time" value={filters.gio_thi} onChange={e => setFilters({...filters, gio_thi: e.target.value})} style={filterInputStyle} />
        <select name="trang_thai" value={filters.trang_thai} onChange={e => setFilters({...filters, trang_thai: e.target.value})} style={filterInputStyle}>
          <option value="">Tất cả trạng thái</option><option value="chua_dien_ra">Chưa diễn ra</option><option value="da_ket_thuc">Đã kết thúc</option>
        </select>
        <button onClick={fetchLichThi} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0 30px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lọc</button>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
        <thead>
          <tr style={{ backgroundColor: '#111827', color: 'white', textAlign: 'left', fontSize: '14px' }}>
            <th style={thStyle}>Tên môn</th><th style={thStyle}>Ngày thi</th><th style={thStyle}>Giờ thi</th><th style={thStyle}>Phòng</th><th style={thStyle}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Đang tải dữ liệu...</td></tr>
          ) : danhSachLichThi.length > 0 ? (
            danhSachLichThi.map((lich, idx) => {
              const monHocTuongUng = danhSachMonHoc.find(m => m.id === lich.mon_hoc_id);
              const tenMonHienThi = monHocTuongUng ? monHocTuongUng.ten_mon : 'Đã xóa hoặc không rõ';
              const isChuaDienRa = lich.trang_thai === 'chua_dien_ra';
              const isFinished = lich.trang_thai === 'da_ket_thuc';

              return (
              <tr key={lich.id || idx} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td style={tdStyle}>{tenMonHienThi}</td><td style={tdStyle}>{lich.ngay_thi}</td><td style={tdStyle}>{lich.gio_thi}</td><td style={tdStyle}>{lich.phong}</td>
                <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ backgroundColor: isFinished ? '#ef4444' : (isChuaDienRa ? '#eab308' : '#10b981'), color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {isFinished ? 'Đã kết thúc' : (isChuaDienRa ? 'Chưa diễn ra' : 'Đang diễn ra')}
                      </span>
                      <button onClick={() => window.location.href = `/admin/lich-thi/${lich.id}/phan-cong`} style={btnAction('#06b6d4')}>Phân công</button>
                      {isChuaDienRa && <button onClick={() => handleEditClick(lich)} style={btnAction('#eab308')}>Sửa</button>}
                      <button onClick={() => handleDelete(lich.id)} style={btnAction('#ef4444')}>Xóa</button>
                      {isFinished && <button style={btnAction('#0ea5e9')}>📊 Xem kết quả</button>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right', fontSize: '12px', color: '#4b5563', lineHeight: '1.4', marginRight: '15px' }}>
                        <div>SL: {lich.so_sinh_vien || 0} SV</div>
                        <div>GV đã PC: {lich.so_giang_vien || 0} GV</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                         {/* NÚT THÊM SINH VIÊN [+] */}
                         {isChuaDienRa && (
                            <button 
                              onClick={() => {
                                setTargetLichThiId(lich.id);
                                setIsAddStudentModalOpen(true);
                                setMssvInput('');
                                setStudentPreview('');
                              }}
                              style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              +
                            </button>
                         )}
                         <button 
  onClick={() => window.location.href = `/admin/lich-thi/${lich.id}/chi-tiet`}
  style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>
  👁️
</button>
                      </div>
                    </div>

                  </div>
                </td>
              </tr>
            )})
          ) : (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Chưa có lịch thi nào được tạo.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const filterInputStyle = { padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', minWidth: '140px', flex: '1 1 auto' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' };
const thStyle = { padding: '16px 12px', fontWeight: 'bold' };
const tdStyle = { padding: '16px 12px', verticalAlign: 'middle' };
const btnAction = (color) => ({ backgroundColor: color, color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' });

export default LichThiList;