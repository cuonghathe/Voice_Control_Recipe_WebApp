import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './admin.scss';

const AdminWebsiteOverall = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalReviews: 0,
    averageRating: 0,
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOverallData();
  }, []);

  const fetchOverallData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Fetch users data
      const usersResponse = await axios.get("http://localhost:5000/admin/api/users", {
        headers: { Authorization: `${token}` },
      });

      // Fetch recipes data
      const recipesResponse = await axios.get("http://localhost:5000/recipe/api/getRecipes");

      const users = usersResponse.data;
      const recipes = recipesResponse.data.allRecipeData;

      // Calculate statistics
      const totalUsers = users.length;
      const totalRecipes = recipes.length;
      
      // Calculate total reviews and average rating
      let totalReviews = 0;
      let sumOfRatings = 0;
      
      recipes.forEach(recipe => {
        totalReviews += recipe.reviewCount || 0;
        if (recipe.averageRating) {
          sumOfRatings += parseFloat(recipe.averageRating) * (recipe.reviewCount || 0);
        }
      });

      const averageRating = totalReviews > 0 ? (sumOfRatings / totalReviews).toFixed(1) : 0;

      setStats({
        totalUsers,
        totalRecipes,
        totalReviews,
        averageRating,
      });

      // Get recent recipes (latest 5)
      const sortedRecipes = [...recipes].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentRecipes(sortedRecipes.slice(0, 5));

      // Get recent users (latest 5)
      const sortedUsers = [...users].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentUsers(sortedUsers.slice(0, 5));

      setLoading(false);
    } catch (err) {
      console.error("Lỗi tải dữ liệu", err);
      setError("Lỗi tải dữ liệu");
      setLoading(false);
    }
  };

  const handleViewRecipe = (id) => {
    navigate(`/admin/Recipe/${id}`);
  };

  const handleViewUser = (id) => {
    navigate(`/admin/userprofile/${id}`);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <Container fluid>
        <h2 className="overall-title">Tổng quan Website</h2>

        <Row className="stats-row">
          <Col md={3} sm={6} className="mb-4">
            <Card className="stat-card stat-card-users">
              <Card.Body>
                <div className="stat-label-con">
                  <Card.Text className="stat-label">Tổng số người dùng</Card.Text>
                </div>
                <Card.Title className="stat-value">{stats.totalUsers}</Card.Title>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-4">
            <Card className="stat-card stat-card-recipes">
              <Card.Body>
                <div className="stat-label-con">
                  <Card.Text className="stat-label">Tổng số công thức</Card.Text>
                </div>
                <Card.Title className="stat-value">{stats.totalRecipes}</Card.Title>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-4">
            <Card className="stat-card stat-card-reviews">
              <Card.Body>
                <div className="stat-label-con">
                  <Card.Text className="stat-label">Tổng số đánh giá</Card.Text>
                </div>
                <Card.Title className="stat-value">{stats.totalReviews}</Card.Title>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* Recent Data Tables */}
        <Row>
          <Col md={6} className="mb-4">
            <Card className="recent-card">
              <Card.Header className="recent-card-header">
                <h5 className="mb-0">
                  Công thức mới nhất
                </h5>
              </Card.Header>
              <Card.Body>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Tên công thức</th>
                      <th>Tác giả</th>
                      <th>Ngày tạo</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecipes.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">Không có công thức nào</td>
                      </tr>
                    ) : (
                      recentRecipes.map((recipe) => (
                        <tr key={recipe._id}>
                          <td>{recipe.recipename}</td>
                          <td>{recipe.userData && recipe.userData[0] ? recipe.userData[0].username : 'N/A'}</td>
                          <td>{new Date(recipe.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleViewRecipe(recipe._id)}
                            >
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="recent-card">
              <Card.Header className="recent-card-header">
                <h5 className="mb-0">
                  Người dùng mới nhất
                </h5>
              </Card.Header>
              <Card.Body>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Tên người dùng</th>
                      <th>Email</th>
                      <th>Ngày đăng ký</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">Không có người dùng nào</td>
                      </tr>
                    ) : (
                      recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleViewUser(user._id)}
                            >
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

export default AdminWebsiteOverall;

