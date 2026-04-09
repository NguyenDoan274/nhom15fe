import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PhanCongLichThi() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lichThi, setLichThi] = useState({});
  const [danhSachMonHoc, setDanhSachMonHoc] = useState([]); 
  const [danhSachTatCaGV, setDanhSachTatCaGV] = useState([]);
  const [gvDaPhanCong, setGvDaPhanCong] = useState([]);

  const [searchGv, setSearchGv] = useState('');
  const [selectedGvId, setSelectedGvId] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');
  const MAX_GIANG_VIEN = 3;
  const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000/';

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Kéo Môn Học
      const resMon = await axios.get(`${baseURL}api/admin/monhoc`, { headers });
      setDanhSachMonHoc(resMon.data?.data?.data || resMon.data?.data || []);

      // 2. Kéo Tất cả Giảng Viên
      const resGv = await axios.get(`${baseURL}api/admin/giangvien`, { headers });
      const allGv = resGv.data?.data?.data || resGv.data?.data || [];
      setDanhSachTatCaGV(allGv);

      // 3. Kéo Dữ liệu Lịch thi & Phân công
      const resPhanCong = await axios.get(`${baseURL}api/admin/lichthi/${id}/phancong`, { headers });
      const lich = resPhanCong.data?.data?.lichThi || {};
      setLichThi(lich);

      // 4. MÓC DỮ LIỆU ĐÃ PHÂN CÔNG (Giải quyết triệt để lỗi không hiện thông tin)
      // Dò mảng trung gian phan_cong_g_vs do Laravel trả về
      const rawPhanCong = lich.phan_cong_g_vs || lich.phanCongGVs || lich.phan_cong_gvs || [];
      
      // Lấy danh sách ID đã phân công
      const assignedIds = rawPhanCong.map(pc => Number(pc.giang_vien_id));
      
      // Tìm thông tin chi tiết (Họ tên, Email) từ danh sách Tất cả GV
      const assignedGvDetails = allGv.filter(gv => assignedIds.includes(Number(gv.id)));
      
      // Gắn thêm ID của bảng phân công để xíu nữa có mã mà Xóa
      const gvWithPcId = assignedGvDetails.map(gv => {
         const pcRecord = rawPhanCong.find(pc => Number(pc.giang_vien_id) === Number(gv.id));
         return { ...gv, phan_cong_id: pcRecord?.id };
      });

      setGvDaPhanCong(gvWithPcId);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedGvId) {
      return alert("⚠️ BẠN QUÊN CHỌN GIẢNG VIÊN!\nVui lòng gõ tên, sau đó BẤM VÀO TÊN GIẢNG VIÊN trong danh sách xổ xuống rồi mới nhấn Lưu.");
    }
    
    try {
      // Gọi API chính
      await axios.post(`${baseURL}api/admin/lichthi/${id}/phancong`, 
        { lich_thi_id: id, giang_vien_id: selectedGvId }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert("🎉 Đã lưu phân công thành công!");
      resetForm();
    } catch (err) {
      // CƠ CHẾ BACKUP: Nếu API trên lỗi, tự động vòng qua API của GiangVienController
      try {
        await axios.post(`${baseURL}api/admin/giangvien/${selectedGvId}/assign/${id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
        alert("🎉 Đã lưu phân công thành công!");
        resetForm();
      } catch (fallbackErr) {
        if (err.response?.status === 409 || fallbackErr.response?.status === 409) {
          alert("⚠️ TRÙNG LỊCH: Giảng viên này đã có ca gác thi khác trùng giờ!");
        } else {
          alert("⚠️ LỖI LƯU DỮ LIỆU. Bạn nhấn F12 qua tab Console để xem chi tiết nhé.");
          console.error(err.response);
        }
      }
    }
  };

  const resetForm = () => {
    setSearchGv('');     
    setSelectedGvId(''); 
    fetchAllData(); 
  };

  const handleUnassign = async (gv) => {
    if (!window.confirm(`Xóa giảng viên ${gv.ho_ten} khỏi phòng thi này?`)) return;
    
    try {
      // Thử xóa bằng ID phân công (Cách 1)
      if (gv.phan_cong_id) {
         await axios.delete(`${baseURL}api/admin/lichthi/${id}/phancong/${gv.phan_cong_id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      } else {
         // Backup: Xóa bằng ID Giảng Viên (Cách 2)
         await axios.delete(`${baseURL}api/admin/giangvien/${gv.id}/unassign/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      }
      fetchAllData();
    } catch (err) {
      alert("⚠️ Lỗi khi xóa phân công!");
    }
  };

  const handleSelectGV = (gv) => {
    setSelectedGvId(gv.id);
    setSearchGv(`${gv.ho_ten} (${gv.ma_gv})`); 
    setShowDropdown(false);
  };

  if (isLoading) return <div style={{ padding: '30px', fontSize: '16px', color: '#6b7280' }}>⏳ Đang đồng bộ dữ liệu...</div>;

  const assignedIds = gvDaPhanCong.map(gv => Number(gv.id));
  const availableGV = danhSachTatCaGV.filter(gv => !assignedIds.includes(Number(gv.id)));
  const isFull = gvDaPhanCong.length >= MAX_GIANG_VIEN;

  const monHocTuongUng = danhSachMonHoc.find(m => m.id === lichThi.mon_hoc_id);
  const tenMonHienThi = lichThi.monHoc?.ten_mon || lichThi.ten_mon || (monHocTuongUng ? monHocTuongUng.ten_mon : '---');

  const filteredGV = availableGV.filter(gv => 
    (gv.ho_ten || "").toLowerCase().includes((searchGv || "").toLowerCase()) || 
    (gv.ma_gv || "").toLowerCase().includes((searchGv || "").toLowerCase())
  );

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'normal', color: '#1f2937', marginBottom: '15px' }}>
        Phân công môn: <span style={{fontWeight: 'bold'}}>{tenMonHienThi}</span> --- Phòng: <span style={{fontWeight: 'bold'}}>{lichThi.phong || '---'}</span>
      </h1>
      
      <button onClick={() => navigate('/admin/lich-thi')} style={{ backgroundColor: '#6c757d', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>Trở lại</button>

      {isFull ? (
        <div style={{ backgroundColor: '#fee2e2', padding: '15px', borderRadius: '6px', maxWidth: '800px', marginBottom: '30px', border: '1px solid #fca5a5' }}>
          <p style={{ color: '#dc2626', margin: 0, fontWeight: 'bold' }}>⚠️ Không thể phân công thêm. (Đã đạt tối đa {MAX_GIANG_VIEN} người / phòng)</p>
        </div>
      ) : (
        <div style={{ marginBottom: '30px', maxWidth: '800px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '5px' }}>Chọn giảng viên <span style={{color: 'red'}}>*</span></label>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input 
              type="text" placeholder="Gõ tên giảng viên rồi BẤM CHỌN trong danh sách..." value={searchGv}
              onChange={(e) => { setSearchGv(e.target.value); setSelectedGvId(''); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <span style={{ position: 'absolute', right: '12px', top: '10px', color: '#6c757d', pointerEvents: 'none' }}>▼</span>
            
            {showDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #0d6efd', borderRadius: '0 0 4px 4px', maxHeight: '200px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {filteredGV.length > 0 ? filteredGV.map((gv) => (
                  <div key={gv.id} onClick={() => handleSelectGV(gv)} style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#0d6efd'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'black'; }}>
                    {gv.ho_ten} ({gv.ma_gv})
                  </div>
                )) : (
                  <div style={{ padding: '10px 15px', color: '#6b7280', fontStyle: 'italic' }}>Không tìm thấy giảng viên phù hợp</div>
                )}
              </div>
            )}
          </div>
          <button onClick={handleAssign} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Lưu phân công</button>
        </div>
      )}

      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
        Giảng viên đã được phân công ({gvDaPhanCong.length}/{MAX_GIANG_VIEN}):
      </h3>
      
      <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', maxWidth: '800px', backgroundColor: '#fff', overflow: 'hidden' }}>
        {gvDaPhanCong.length > 0 ? gvDaPhanCong.map((gv, index) => (
          <div key={gv.id} style={{ padding: '15px 20px', borderBottom: index !== gvDaPhanCong.length - 1 ? '1px solid #dee2e6' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
            <span style={{ fontSize: '15px', color: '#212529', fontWeight: '500' }}>👨‍🏫 {gv.ho_ten} <span style={{ color: '#6c757d', fontSize: '13px', marginLeft: '5px' }}>({gv.ma_gv})</span></span>
            <button onClick={() => handleUnassign(gv)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>Xóa</button>
          </div>
        )) : (
          <div style={{ padding: '20px', color: '#6c757d', fontSize: '15px', textAlign: 'center', fontStyle: 'italic' }}>Chưa có giảng viên nào được phân công gác thi phòng này.</div>
        )}
      </div>
    </div>
  );
}

export default PhanCongLichThi;