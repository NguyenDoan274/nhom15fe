import React from 'react';

function Dashboard() {
  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', minHeight: '500px' }}>
      
      {/* Tiêu đề trang giống trong hình */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '2px solid #f3f4f6', paddingBottom: '20px', marginBottom: '24px' }}>
        <span style={{ fontSize: '32px' }}>📚</span> {/* Biểu tượng thay thế tạm */}
        <h2 style={{ color: '#1f2937', fontSize: '26px', fontWeight: '600', margin: 0 }}>Danh sách phòng thi</h2>
      </div>

      {/* Khu vực chứa dữ liệu sẽ fetch từ API sau này */}
      <div style={{ color: '#6b7280', textAlign: 'center', marginTop: '80px', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
        <p style={{ fontSize: '16px' }}>Đang chờ tải dữ liệu phòng thi từ Backend PHP...</p>
      </div>

    </div>
  );
}

export default Dashboard;