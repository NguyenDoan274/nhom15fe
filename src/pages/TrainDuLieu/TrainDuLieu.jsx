import React, { useState, useRef } from 'react';
import axios from 'axios';

function TrainDuLieu() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000/';

  // Hàm thêm dòng log
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type }]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Hàm dịch lỗi thông minh (Chặn các lỗi kỹ thuật dài dòng)
  const formatErrorMessage = (serverMsg, errMessage) => {
    const msg = serverMsg || errMessage || "";
    if (msg.includes("Không tồn tại MSSV")) {
      // Cắt bỏ phần dư thừa, chỉ lấy đúng câu thông báo chuẩn
      return msg.split(":")[0] + ": " + msg.split(":")[1].trim(); 
    }
    if (msg.includes("cURL error 60") || msg.includes("SSL certificate")) {
      return "Lỗi kết nối bảo mật (SSL) với AWS. Báo Backend kiểm tra file cacert.pem!";
    }
    if (msg.includes("Server Error") || msg.includes("500")) {
      return "Lỗi máy chủ nội bộ. Không thể xử lý ảnh này.";
    }
    return msg; // Trả về nguyên gốc nếu là lỗi khác
  };

  // Nút Upload & Train
  const handleUploadAndTrain = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return alert("Vui lòng chọn ít nhất 1 ảnh để Train!");
    }

    setIsLoading(true);
    setLogs([]); // Xóa log cũ

    const total = selectedFiles.length;

    for (let i = 0; i < total; i++) {
      const file = selectedFiles[i];
      const ma_sv = file.name.substring(0, file.name.lastIndexOf('.')).toUpperCase();

      const formData = new FormData();
      formData.append('ma_sv', ma_sv);
      formData.append('hinh_anh', file);

      try {
        const res = await axios.post(`${baseURL}api/admin/rekognition/train-ajax`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (res.data?.success) {
            addLog(`✅ [${i + 1}/${total}] ${file.name}: ${res.data?.message || 'Train thành công'}`, 'success');
        } else {
            // Xử lý lỗi trả về mã 200 nhưng success = false (Ví dụ: Không tồn tại MSSV)
            const cleanError = formatErrorMessage(res.data?.message, "");
            addLog(`❌ [${i + 1}/${total}] ${file.name}: ${cleanError}`, 'error');
        }

      } catch (err) {
        // Xử lý lỗi trả về mã 500 (Ví dụ: cURL error 60)
        const cleanError = formatErrorMessage(err.response?.data?.message, err.message);
        addLog(`❌ [${i + 1}/${total}] ${file.name}: ${cleanError}`, 'error');
      }
    }

    addLog(`Hoàn tất ${total} ảnh!`, 'summary');
    setIsLoading(false);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Nút Train Lại (Ép buộc Retrain)
  const handleRetrain = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
       return alert("Vui lòng chọn ảnh sinh viên cần train lại!");
    }

    if (!window.confirm(`Bạn có chắc chắn muốn TRAIN LẠI khuôn mặt cho ${selectedFiles.length} sinh viên này?`)) return;

    setIsLoading(true);
    setLogs([]);

    const total = selectedFiles.length;

    for (let i = 0; i < total; i++) {
      const file = selectedFiles[i];
      const ma_sv = file.name.substring(0, file.name.lastIndexOf('.')).toUpperCase();

      const formData = new FormData();
      formData.append('ma_sv', ma_sv);
      formData.append('hinh_anh', file);

      try {
        const res = await axios.post(`${baseURL}api/admin/rekognition/retrain-ajax`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (res.data?.success) {
            addLog(`✅ [${i + 1}/${total}] ${file.name}: ${res.data?.message || 'Train lại thành công'}`, 'success');
        } else {
            const cleanError = formatErrorMessage(res.data?.message, "");
            addLog(`❌ [${i + 1}/${total}] ${file.name}: ${cleanError}`, 'error');
        }
      } catch (err) {
        const cleanError = formatErrorMessage(err.response?.data?.message, err.message);
        addLog(`❌ [${i + 1}/${total}] ${file.name}: ${cleanError}`, 'error');
      }
    }

    addLog(`Hoàn tất ${total} ảnh!`, 'summary');
    setIsLoading(false);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'normal', color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>📥</span> Upload & Train khuôn mặt sinh viên
        </h1>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4b5563' }}>
          Chọn ảnh khuôn mặt (tên file = MSSV, ≤5MB, JPG/PNG)
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="file" multiple accept=".jpg, .jpeg, .png" 
            onChange={handleFileChange} ref={fileInputRef} disabled={isLoading}
            style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', width: '100%', maxWidth: '800px', color: '#374151', fontSize: '14px' }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '25px' }}>
        <button onClick={handleUploadAndTrain} disabled={isLoading} style={btnStyle('#0d6efd', isLoading)}>
          🚀 {isLoading ? 'Đang xử lý...' : 'Upload & Train'}
        </button>
        <button onClick={handleRetrain} disabled={isLoading} style={btnStyle('#ffc107', isLoading, '#000')}>
          🔄 Train lại
        </button>
      </div>

      <div>
        <h3 style={{ fontSize: '15px', margin: '0 0 10px 0', color: '#000' }}>📄 Log:</h3>
        
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          {logs.map((log, index) => (
            <div key={index} style={{ 
                color: log.type === 'error' ? '#dc3545' : log.type === 'success' ? '#198754' : '#000',
                fontWeight: log.type === 'summary' ? 'bold' : 'normal',
                marginTop: log.type === 'summary' ? '5px' : '0'
            }}>
              {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const btnStyle = (bg, loading, color = '#fff') => ({
  backgroundColor: loading ? '#6b7280' : bg,
  color: color,
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: loading ? 'not-allowed' : 'pointer',
  fontSize: '14px'
});

export default TrainDuLieu;