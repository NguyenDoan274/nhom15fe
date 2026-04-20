import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

// =====================================================================
// ⚠️ LƯU Ý KHI MANG VỀ VS CODE CỦA BẠN:
// Hãy BỎ COMMENT (xóa /* và */) ở khối import dưới đây để hệ thống nhận diện đúng tệp!
// =====================================================================

import Login from './pages/Auth/Login'; 
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';

import SinhVienList from './pages/SinhVien/SinhVienList';
import GiangVienList from './pages/GiangVien/GiangVienList'; 
import LichThiList from './pages/LichThi/LichThiList';
import MonHocList from './pages/MonHoc/MonHocList';
import PhanCongLichThi from './pages/LichThi/PhanCongLichThi';
import ChiTietLichThi from './pages/LichThi/ChiTietLichThi';
import TrainDuLieu from './pages/TrainDuLieu/TrainDuLieu';
import PhongThiCaNhan from './pages/GiangVien/PhongThiCaNhan';
import DiemDanhLichThi from './pages/GiangVien/DiemDanhLichThi';
import DiemDanhCamera from './pages/GiangVien/DiemDanhCamera';

// =====================================================================
// ⚠️ XÓA KHỐI NÀY KHI MANG VỀ MÁY TÍNH CỦA BẠN
// (Đây chỉ là các component giả lập để Canvas ở đây không báo lỗi thiếu tệp)
// =====================================================================
// const Login = () => <div style={{padding: '50px', textAlign: 'center'}}><h2>Đăng nhập</h2><Link to="/admin">Vào Admin</Link> | <Link to="/giang-vien">Vào Giảng viên</Link></div>;
// const AdminLayout = () => <div style={{display: 'flex', fontFamily: 'sans-serif'}}><div style={{width: '260px', borderRight: '1px solid #ccc', padding: '20px', minHeight: '100vh'}}><h3>Menu Admin</h3><Link to="/admin/ds-phong-thi">📝 DS Phòng thi</Link></div><div style={{flex: 1, padding: '20px'}}><Outlet /></div></div>;
// const TeacherLayout = () => <div style={{display: 'flex', fontFamily: 'sans-serif'}}><div style={{width: '260px', borderRight: '1px solid #ccc', padding: '20px', minHeight: '100vh'}}><h3>Menu Giảng viên</h3><Link to="/giang-vien/ds-phong-thi">📝 DS Phòng thi</Link></div><div style={{flex: 1, padding: '20px'}}><Outlet /></div></div>;

// const SinhVienList = () => <div>Quản lý Sinh viên</div>;
// const GiangVienList = () => <div>Quản lý Giảng viên</div>;
// const LichThiList = () => <div>Quản lý Lịch thi toàn trường</div>;
// const MonHocList = () => <div>Quản lý Môn học</div>;
// const PhanCongLichThi = () => <div>Phân công Lịch thi</div>;
// const ChiTietLichThi = () => <div>Chi tiết Lịch thi</div>;
// const TrainDuLieu = () => <div>Train Dữ liệu AI</div>;

// const PhongThiCaNhan = () => <div><h2>Danh sách Phòng thi cá nhân</h2><Link to="../diem-danh/1" style={{padding: '8px 16px', background: '#0d6efd', color: 'white', borderRadius: '4px', textDecoration: 'none'}}>👁️ Xem sinh viên (Phòng mẫu)</Link></div>;
// const DiemDanhLichThi = () => <div><h2>Danh sách Điểm danh</h2><Link to="../diem-danh-camera/1" style={{padding: '8px 16px', background: '#10b981', color: 'white', borderRadius: '4px', textDecoration: 'none'}}>📷 Mở Camera</Link></div>;
// const DiemDanhCamera = () => <div><h2>Giao diện Camera Điểm danh</h2><p>Mô phỏng luồng camera...</p></div>;
// // =====================================================================


// Các component hiển thị tạm thời tránh bị lỗi
const DummyAdmin = ({ title }) => <div style={{padding: '24px', background: 'white', borderRadius: '12px'}}><h2>Màn hình Admin: {title}</h2></div>;
const DummyTeacher = ({ title }) => <div style={{padding: '24px', background: 'white', borderRadius: '12px'}}><h2>Màn hình Giáo viên: {title}</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* ------------------------------------- */}
        {/* LUỒNG ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DummyAdmin title="Tổng quan Phòng Đào Tạo" />} /> 
          
          {/* CÁC TRANG CHÍNH THỨC CỦA ADMIN 👇 */}
          <Route path="sinh-vien" element={<SinhVienList />} /> 
          <Route path="giang-vien" element={<GiangVienList />} /> 
          <Route path="lich-thi/:id/phan-cong" element={<PhanCongLichThi />} />
          <Route path="lich-thi/:id/chi-tiet" element={<ChiTietLichThi />} />
          <Route path="mon-hoc" element={<MonHocList />} />
          <Route path="train-du-lieu" element={<TrainDuLieu />} />
          <Route path="lich-thi" element={<LichThiList />} />
          
          {/* LUỒNG ĐIỂM DANH DÙNG CHUNG CHO CẢ ADMIN VÀ GIẢNG VIÊN */}
          <Route path="ds-phong-thi" element={<PhongThiCaNhan />} />
          <Route path="diem-danh/:id" element={<DiemDanhLichThi />} />
          <Route path="diem-danh-camera/:id" element={<DiemDanhCamera />} />
        </Route>

        {/* ------------------------------------- */}
        {/* LUỒNG GIÁO VIÊN */}
        {/* Lưu ý: Đổi path thành /giang-vien để khớp logic chuyển trang của component */}
        <Route path="/giang-vien" element={<TeacherLayout />}>
          <Route index element={<DummyTeacher title="Tổng quan Lớp học của bạn" />} /> 
          
          {/* CÁC TRANG CHÍNH THỨC CỦA GIÁNG VIÊN 👇 */}
          <Route path="ds-phong-thi" element={<PhongThiCaNhan />} /> 
          <Route path="diem-danh/:id" element={<DiemDanhLichThi />} /> 
          <Route path="diem-danh-camera/:id" element={<DiemDanhCamera />} />

          {/* CÁC TRANG CHƯA LÀM, HIỂN THỊ TẠM DUMMY */}
          <Route path="lich-thi" element={<DummyTeacher title="Lịch thi toàn trường" />} /> 
          <Route path="tai-khoan" element={<DummyTeacher title="Thông tin cá nhân" />} /> 
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;