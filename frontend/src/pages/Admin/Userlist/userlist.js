import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Container, Form, Nav, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../admin.scss';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/admin/api/users", {
        headers: { Authorization: `${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("lỗi load dữ liệu");
      setLoading(false);
    } 
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/admin/api/user/${userId}`, {
        headers: { Authorization: `${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const filteredUser = users
  .filter((user) => {
    const matchesName =
      nameFilter === "" ||
      (user.username && user.username.toLowerCase().includes(nameFilter.toLowerCase()));

    return matchesName;
  })

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };


  const handleNav = (id) => {
    navigate(`/admin/userprofile/${id}`);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <Container>
      <h2 className="overall-title">Quản lý người dùng</h2>

      <Nav className='mb-4'>
        <Form className='d-flex' style={{ maxWidth: "400px", width: "100%" }}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm"
            value={nameFilter}
            onChange={handleNameFilterChange}
          />
        </Form>
      </Nav>

      <Card className="recent-card">

        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Tên người dùng</th>
                <th>Số lần đăng nhập</th>
                <th>Số bài đăng</th>
                <th>Điểm trung bình</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUser.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">Không có người dùng nào</td>
                </tr>
              ) : (
                filteredUser.map((user) => (
                  <tr key={user._id}>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.tokens ? user.tokens.length : 0}</td>
                    <td>{user.totalRecipes || 0}</td>
                    <td>{user.averageRatingAcrossRecipes || 0}</td>
                    <td>
                      <Button className="btn btn-success btn-sm me-2" onClick={() => handleNav(user._id)}>
                        Xem
                      </Button>
                      <Button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user._id)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserList;
