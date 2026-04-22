import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

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
import Dashboard from './pages/Home/Dashboard';
import TaiKhoan from './pages/GiangVien/TaiKhoan';
import DoiMatKhau from './pages/GiangVien/DoiMatKhau';

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
          <Route path="tai-khoan" element={<TaiKhoan />} />
          
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
          <Route path="tai-khoan" element={<TaiKhoan />} /> 
          <Route path="doi-mat-khau" element={<DoiMatKhau />} /> 

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;