import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://nhom15be.sonnguyenhungthanh.io.vn/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Biến này để theo dõi xem mình đang Sửa user nào. Nếu = null là đang Thêm mới.
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get(API_URL);
    setUsers(response.data);
  };

  // --- HÀM XỬ LÝ KHI BẤM NÚT LƯU ---
  const saveUser = async () => {
    if (editingId !== null) {
      // Đang có ID -> Chế độ Sửa (PUT)
      await axios.put(`${API_URL}/${editingId}`, {
        name: name,
        email: email,
        phone: phone
      });
      setEditingId(null); // Xong việc thì xóa trạng thái sửa
    } else {
      // Đang trống -> Chế độ Thêm mới (POST)
      await axios.post(API_URL, {
        name: name,
        email: email,
        phone: phone
      });
    }

    // Dọn dẹp trắng các ô nhập liệu
    setName('');
    setEmail('');
    setPhone('');
    getUsers(); // Load lại bảng
  };

  // --- HÀM XỬ LÝ KHI BẤM NÚT SỬA Ở DƯỚI BẢNG ---
  const clickEdit = (user) => {
    // 1. Đẩy dữ liệu của user đó lên các ô input
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    // 2. Lưu lại ID để báo cho hệ thống biết mình đang sửa
    setEditingId(user.id);
  };

  // --- HÀM HỦY SỬA ---
  const cancelEdit = () => {
    setName('');
    setEmail('');
    setPhone('');
    setEditingId(null); // Đưa về lại chế độ Thêm mới
  };

  // --- HÀM XÓA ---
  const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    getUsers();
  };

  return (
    // Code CSS giúp căn giữa toàn bộ nội dung ra giữa màn hình
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Quản lý người dùng</h1>

      {/* --- KHU VỰC NHẬP LIỆU --- */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '2px dashed #aaa', borderRadius: '10px' }}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>
          {editingId ? "Đang sửa thông tin..." : "Thêm người dùng mới"}
        </h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" />
          
          <button onClick={saveUser} style={{ cursor: 'pointer', backgroundColor: editingId ? '#ff9800' : '#4caf50', color: 'white', border: 'none', padding: '5px 15px' }}>
            {editingId ? "Cập nhật" : "Thêm ngay"}
          </button>

          {/* Nút Hủy chỉ xuất hiện khi đang ở chế độ Sửa */}
          {editingId && (
            <button onClick={cancelEdit} style={{ cursor: 'pointer' }}>Hủy</button>
          )}
        </div>
      </div>

      {/* --- KHU VỰC BẢNG DỮ LIỆU --- */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '80%', textAlign: 'center' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button onClick={() => clickEdit(user)} style={{ marginRight: '10px', cursor: 'pointer' }}>Sửa</button>
                <button onClick={() => deleteUser(user.id)} style={{ cursor: 'pointer', color: 'red' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;