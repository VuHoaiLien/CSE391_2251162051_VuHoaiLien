import React, { useState, useEffect } from 'react';
import './style.css';
import { v4 as uuidv4 } from 'uuid';

const EMPTY_FORM = { id: '', ho: '', ten: '', diachi: '' };

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('students');
      const parsed = saved ? JSON.parse(saved) : [];
      // Đảm bảo mảng hợp lệ
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(EMPTY_FORM);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const ho = form.ho.trim();
    const ten = form.ten.trim();
    const diachi = form.diachi.trim();

    if (!ho || !ten || !diachi) {
      alert('Không được bỏ trống các trường!');
      return false;
    }
    if (ten.length > 15) {
      alert('Tên không được quá 15 ký tự!');
      return false;
    }
    if (ho.length > 20) {
      alert('Họ đệm không được quá 20 ký tự!');
      return false;
    }
    if (diachi.length > 50) {
      alert('Địa chỉ không được quá 50 ký tự!');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const clean = {
      ...form,
      ho: form.ho.trim(),
      ten: form.ten.trim(),
      diachi: form.diachi.trim(),
    };

    if (clean.id) {
      // cập nhật
      setStudents((prev) => prev.map((s) => (s.id === clean.id ? clean : s)));
    } else {
      // thêm mới
      setStudents((prev) => [...prev, { ...clean, id: uuidv4() }]);
    }
    setForm(EMPTY_FORM);
  };

  const handleEdit = (student) => {
    // copy sang form (tránh tham chiếu)
    setForm({
      id: student.id || '',
      ho: student.ho || '',
      ten: student.ten || '',
      diachi: student.diachi || '',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      // nếu đang edit chính record này thì reset form
      setForm((f) => (f.id === id ? EMPTY_FORM : f));
    }
  };

  const norm = (v) => (v || '').toLowerCase();
  const term = searchTerm.toLowerCase();

  const filtered = students.filter(
    (s) =>
      norm(s.ho).includes(term) ||
      norm(s.ten).includes(term) ||
      norm(s.diachi).includes(term) // thêm lọc theo địa chỉ cho tiện
  );
  return (
    <div className="app">
      <h1>Quản lý Sinh viên</h1>

      <input
        type="text"
        placeholder="Tìm kiếm theo họ đệm, tên, địa chỉ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="main-layout">
        {/* Cột trái: Danh sách */}
        <div className="student-list">
          <h2>Danh sách sinh viên</h2>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ đệm</th>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.ho}</td>
                    <td>{s.ten}</td>
                    <td>{s.diachi}</td>
                    <td>
                      <button className="button button--edit" onClick={() => handleEdit(s)}>✏️</button>
                      <button className="button button--delete" onClick={() => handleDelete(s.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cột phải: Form */}
        <div className="form-wrapper">
          <h3>Thêm / Cập nhật sinh viên</h3>
          <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>Họ đệm:</td>
                  <td><input name="ho" value={form.ho} onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td>Tên:</td>
                  <td><input name="ten" value={form.ten} onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td>Địa chỉ:</td>
                  <td><input name="diachi" value={form.diachi} onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center' }}>
                    <button type="submit">{form.id ? '💾 Lưu' : '➕ Thêm'}</button>
                    {form.id && (
                      <button type="button" className="button button--muted" onClick={() => setForm(EMPTY_FORM)}>
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
