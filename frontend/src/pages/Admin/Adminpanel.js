import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Nav, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './admin.scss';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");
  

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recipe/api/getRecipes");
        setRecipes(response.data.allRecipeData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu", error);
        setError("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công thức này?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/recipe/api/delete/${recipeId}`, {
        headers: { Authorization: `${token}` },
      });
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      setError("Lỗi khi xóa công thức.");
    }
  };


  const filteredRecipe = recipes
  .filter((recipe) => {
    const matchesName =
      nameFilter === "" ||
      (recipe.recipename && recipe.recipename.toLowerCase().includes(nameFilter.toLowerCase()));

    return matchesName;
  })

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleNavigateRecipe = (id) => {
    navigate(`Recipe/${id}`);
  };

  if (loading) return <p>Đang tải danh sách công thức...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <Container>
      <h2 className="overall-title">Quản lý công thức</h2>

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
                <th>Tên công thức</th>
                <th>Tác giả</th>
                <th>Ngày tạo</th>
                <th>Review</th>
                <th>Điểm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipe.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">Không có công thức nào</td>
                </tr>
              ) : (
                filteredRecipe.map((recipe) => (
                  <tr key={recipe._id}>
                    <td><strong>{recipe.recipename}</strong></td>
                    <td>{recipe.userData && recipe.userData[0] ? recipe.userData[0].username : 'N/A'}</td>
                    <td>{new Date(recipe.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{recipe.reviewCount || 0}</td>
                    <td>{recipe.averageRating || 0}</td>
                    <td>
                      <Button className="btn btn-success btn-sm me-2" onClick={() => handleNavigateRecipe(recipe._id)}>
                        Xem
                      </Button>
                      <Button className="btn btn-danger btn-sm" onClick={() => handleDeleteRecipe(recipe._id)}>
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

export default RecipeList;
