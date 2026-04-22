import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function DiemDanhCamera() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/giang-vien';

  const [danhSach, setDanhSach] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [chuaDiemDanh, setChuaDiemDanh] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [facesData, setFacesData] = useState([]); 
  
  // STATE MỚI: Bắt lỗi từ Backend để in ra màn hình
  const [apiError, setApiError] = useState(null); 
  
  const videoRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDanhSach();
    return () => stopCamera(); 
  }, []);

  // VÒNG LẶP GỌI API MỖI 2 GIÂY
  useEffect(() => {
    let timeoutId;
    if (isCameraOpen && !isProcessing) {
      timeoutId = setTimeout(() => {
        captureAndRecognize();
      }, 2000); 
    }
    return () => clearTimeout(timeoutId);
  }, [isCameraOpen, isProcessing]);

  const fetchDanhSach = async () => {
    setIsLoading(true);
    try {
      const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
      const res = await axios.get(`${baseURL}/api/rekognition/diemdanh/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: searchTerm, chua_diem_danh: chuaDiemDanh ? 1 : '' }
      });
      setDanhSach(res.data?.data?.sinhViens || res.data?.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDanhSach();
  };

//     if (!videoRef.current || !isCameraOpen) return;

//     setIsProcessing(true);
//     setApiError(null); // Xóa lỗi cũ đi trước khi gọi mới

//     try {
//       const video = videoRef.current;
//       const canvas = document.createElement('canvas');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
//       const base64Image = canvas.toDataURL('image/jpeg', 0.8);
// const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';
//       const resCompare = await axios.post(`${baseURL}/api/rekognition/compare-many/${id}`, {
//   hinh_anh_base64: base64Image
// }, {
//   headers: { 'Authorization': `Bearer ${token}` }
// });

//       const detectedFaces = resCompare.data?.faces || [];
//       setFacesData(detectedFaces); 

//       const indicesToConfirm = detectedFaces
//         .map((face, index) => (face.valid && !face.checkedIn) ? index : -1)
//         .filter(index => index !== -1);

//       if (indicesToConfirm.length > 0) {
//       await axios.post(`${baseURL}/api/rekognition/confirm-many/${id}`, {
//   faces: JSON.stringify(indicesToConfirm)
// }, {
//   headers: { 'Authorization': `Bearer ${token}` }
// });
//         fetchDanhSach(); 
//       }

//     } catch (err) {
//       // NẾU BACKEND LỖI, IN THẲNG RA MÀN HÌNH ĐỂ BẠN THẤY
//       const errorMsg = err.response?.data?.message || err.message;
//       setApiError(errorMsg);
//       setFacesData([]); // Xóa khung nhận diện vì lỗi
//     } finally {
//       setIsProcessing(false); 
//     }
//   };

const captureAndRecognize = async () => {
  if (!videoRef.current || !isCameraOpen) return;

  setIsProcessing(true);
  setApiError(null);

  try {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000';

    // 1. Gọi API nhận diện khuôn mặt
    const resCompare = await axios.post(`${baseURL}/api/rekognition/compare-many/${id}`, 
      { hinh_anh_base64: base64Image },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    const detectedFaces = resCompare.data?.faces || [];
    setFacesData(detectedFaces); 

    // 2. Lọc ra các đối tượng Hợp lệ và Chưa điểm danh
    const listToConfirm = detectedFaces.filter(face => face.valid && !face.checkedIn);

    if (listToConfirm.length > 0) {
      // 3. GỬI NGUYÊN MẢNG OBJECT LÊN (Không gửi index nữa)
      await axios.post(`${baseURL}/api/rekognition/confirm-many/${id}`, {
        detected_faces: listToConfirm 
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // 4. Load lại bảng danh sách để cập nhật trạng thái màu xanh/vàng
      fetchDanhSach(); 
    }

  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    setApiError(errorMsg);
  } finally {
    setIsProcessing(false); 
  }
};

  const toggleCamera = async () => {
    if (isCameraOpen) stopCamera();
    else startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraOpen(true);
      setFacesData([]);
      setApiError(null);
    } catch (err) {
      alert("⚠️ Không thể mở camera.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
    setFacesData([]);
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#374151', margin: '0 0 15px 0' }}>📸 Điểm danh khuôn mặt</h1>
        <button onClick={() => navigate(`${basePath}/diem-danh/${id}`)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '6px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', marginBottom: '20px' }}>Trở về</button>

        <div style={{ borderTop: '1px solid #e5e7eb', margin: '0 auto 20px auto', maxWidth: '800px' }}></div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: '#4b5563', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#198754' }}></div> Chưa điểm danh (Xanh lá)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#ffc107' }}></div> Đã điểm danh (Vàng)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#dc3545' }}></div> Không hợp lệ (Đỏ)</div>
        </div>

        <button onClick={toggleCamera} style={{ backgroundColor: isCameraOpen ? '#dc3545' : '#0d6efd', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
          {isCameraOpen ? '⏹️ Đóng Camera' : '🎥 Mở Camera'}
        </button>

        <div style={{ marginTop: '20px', display: isCameraOpen ? 'block' : 'none' }}>
          <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto', border: '3px solid #3b82f6', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }} />
            
            {facesData.map((face, index) => {
               const leftPercent = (1 - face.box.x - face.box.width) * 100;
               const topPercent = face.box.y * 100;
               const widthPercent = face.box.width * 100;
               const heightPercent = face.box.height * 100;

               let borderColor = '#dc3545'; 
               if (face.color === 'green') borderColor = '#198754'; 
               if (face.color === 'yellow') borderColor = '#ffc107'; 

               return (
                 <div key={index} style={{
                   position: 'absolute', border: `3px solid ${borderColor}`,
                   left: `${leftPercent}%`, top: `${topPercent}%`, width: `${widthPercent}%`, height: `${heightPercent}%`,
                   boxSizing: 'border-box', zIndex: 10, transition: 'all 0.3s ease'
                 }}>
                   <span style={{
                     position: 'absolute', top: '-25px', left: '-3px',
                     backgroundColor: borderColor, color: face.color === 'yellow' ? '#000' : '#fff',
                     padding: '2px 8px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', borderRadius: '4px 4px 0 0'
                   }}>
                     {face.ho_ten ? `${face.name} - ${face.ho_ten} (${Math.round(face.similarity || 0)}%)` : '❓ Không rõ'}
                   </span>
                 </div>
               );
            })}
          </div>

          {/* HIỂN THỊ DÒNG THÔNG BÁO LỖI API DƯỚI CAMERA */}
          {apiError ? (
            <div style={{ marginTop: '15px', color: '#dc3545', fontWeight: 'bold', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', maxWidth: '640px', margin: '15px auto 0 auto' }}>
              ⚠️ LỖI KẾT NỐI BACKEND: {apiError}
            </div>
          ) : (
            isCameraOpen && (
              <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '10px' }}>
                {isProcessing ? '⏳ Đang quét AI...' : '🟢 Camera đang hoạt động. Sẵn sàng nhận diện...'}
              </p>
            )
          )}
        </div>
      </div>

      <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#212529', fontWeight: 'normal' }}>📑 Danh sách sinh viên</h3>
        </div>

        <div style={{ padding: '15px', borderBottom: '1px solid #dee2e6' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <span style={{ position: 'absolute', left: '10px', top: '8px', color: '#6b7280' }}>🔍</span>
              <input type="text" placeholder="Tìm MSSV hoặc tên sinh viên" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
              <input type="checkbox" checked={chuaDiemDanh} onChange={(e) => setChuaDiemDanh(e.target.checked)} style={{ cursor: 'pointer' }} /> Chưa điểm danh
            </label>
            <button type="submit" style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Tìm kiếm</button>
          </form>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#212529', textAlign: 'center', fontSize: '13px', borderBottom: '2px solid #dee2e6' }}>
              <th style={thStyle}>#</th><th style={thStyle}>Mã SV</th><th style={thStyle}>Họ tên</th><th style={thStyle}>Lớp</th><th style={thStyle}>Điểm danh</th><th style={thStyle}>Kết quả</th><th style={thStyle}>Độ chính xác</th><th style={thStyle}>Thời gian</th><th style={thStyle}>Hình thức</th>
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
                  <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6', fontSize: '13px', textAlign: 'center', backgroundColor: isChecked ? '#f0fdf4' : 'transparent' }}>
                    <td style={tdStyle}>{index + 1}</td><td style={tdStyle}>{sv.ma_sv || '-'}</td><td style={tdStyle}>{sv.ho_ten || '-'}</td><td style={tdStyle}>{sv.lop || '-'}</td>
                    <td style={tdStyle}><input type="checkbox" checked={isChecked} readOnly disabled /></td>
                    <td style={{...tdStyle, color: isChecked ? '#198754' : '#6b7280', fontWeight: isChecked ? 'bold' : 'normal'}}>{item.ket_qua || 'Chưa có'}</td>
                    <td style={tdStyle}>{item.do_chinh_xac ? `${item.do_chinh_xac}%` : '-'}</td>
                    <td style={tdStyle}>{item.thoi_gian_dd ? new Date(item.thoi_gian_dd).toLocaleTimeString('vi-VN', { hour12: false }) : '-'}</td>
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

const thStyle = { padding: '12px 10px', fontWeight: 'bold' };
const tdStyle = { padding: '12px 10px', verticalAlign: 'middle' };

export default DiemDanhCamera;