import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login'; 
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';

// Nhập các trang bạn đã tạo
import SinhVienList from './pages/SinhVien/SinhVienList';
import GiangVienList from './pages/GiangVien/GiangVienList'; 
import LichThiList from './pages/LichThi/LichThiList';
import MonHocList from './pages/MonHoc/MonHocList';
import PhanCongLichThi from './pages/LichThi/PhanCongLichThi';
import ChiTietLichThi from './pages/LichThi/ChiTietLichThi';
import TrainDuLieu from './pages/TrainDuLieu/TrainDuLieu';
import PhongThiCaNhan from './pages/GiangVien/PhongThiCaNhan';
import DiemDanhLichThi from './pages/GiangVien/DiemDanhLichThi';

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
          
          {/* CÁC TRANG CHÍNH THỨC ĐÃ HOÀN THIỆN 👇 */}
          <Route path="sinh-vien" element={<SinhVienList />} /> 
          <Route path="giang-vien" element={<GiangVienList />} /> 
          <Route path="lich-thi/:id/phan-cong" element={<PhanCongLichThi />} />
          <Route path="lich-thi/:id/chi-tiet" element={<ChiTietLichThi />} />
          <Route path="mon-hoc" element={<MonHocList />} />
          <Route path="train-du-lieu" element={<TrainDuLieu />} />
          <Route path="ds-phong-thi" element={<PhongThiCaNhan />} />
          <Route path="diem-danh/:id" element={<DiemDanhLichThi />} />
        
   
          
          {/* CÁC TRANG CHƯA LÀM, HIỂN THỊ TẠM DUMMY */}
           
         <Route path="lich-thi" element={<LichThiList />} />
        </Route>

        {/* ------------------------------------- */}
        {/* LUỒNG GIÁO VIÊN */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<DummyTeacher title="Tổng quan Lớp học của bạn" />} /> 
          <Route path="lich-thi" element={<DummyTeacher title="Lịch thi toàn trường" />} /> 
          <Route path="phong-thi" element={<DummyTeacher title="Danh sách phòng thi bạn gác" />} /> 
          <Route path="tai-khoan" element={<DummyTeacher title="Thông tin cá nhân" />} /> 
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;