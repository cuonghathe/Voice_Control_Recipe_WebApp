import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./TopRecipe.scss";

const TopRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [timeFilter, setTimeFilter] = useState("allTime");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");


  useEffect(() => {
    const fetchRecipes = async () => {
      let dateThreshold = null;
      const now = new Date();

      if (timeFilter === "lastMonth") {
        dateThreshold = new Date(now);
        dateThreshold.setMonth(now.getMonth() - 1);
      } else if (timeFilter === "last3Months") {
        dateThreshold = new Date(now);
        dateThreshold.setMonth(now.getMonth() - 3);
      } else if (timeFilter === "lastYear") {
        dateThreshold = new Date(now);
        dateThreshold.setFullYear(now.getFullYear() - 1);
      }

      try {
        const response = await axios.get("http://localhost:5000/recipe/api/getRecipes");
        const sortedRecipes = response.data.allRecipeData
          .filter((recipe) => {
            const createdAt = new Date(recipe.createdAt);
            return !dateThreshold || createdAt >= dateThreshold;
          })
          .sort((a, b) => b.averageRating - a.averageRating);
        setRecipes(sortedRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [timeFilter]);

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value); // Update name filter state
  };

  const filteredRecipe = recipes
    .filter((recipe) => {
      const matchesName =
        nameFilter === "" ||
        (recipe.recipename && recipe.recipename.toLowerCase().includes(nameFilter.toLowerCase()));
      return matchesName;
    })

  const handleNavigateRecipe = (id) => {
    window.open(`/recipe/${id}`, '_blank', 'noopener,noreferrer');

  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="TopRecipe_body">

      <Container className="leaderboard-container">
        <h1 className="leaderboard-title">Top công thức</h1>

        <div className="filter-container">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="form-select"
          >
            <option value="allTime">Toàn thời gian</option>
            <option value="lastMonth">Tháng trước</option>
            <option value="last3Months">3 tháng trước</option>
            <option value="lastYear">Năm trước</option>
          </select>
        </div>

        <div className="filters">
          <input className="search_input"
            type="text"
            placeholder="Tìm kiếm"
            value={nameFilter}
            onChange={handleNameFilterChange}
          />
        </div>

        <Table striped bordered hover responsive className="mt-4 leaderBoard_table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ảnh công thức</th>
              <th>Tên công thức</th>
              <th>Tác giả</th>
              <th>Điểm trung bình</th>
              <th>Số lượng đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {
            filteredRecipe.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Không có công thức nào</td>
              </tr>
            ) : (
            filteredRecipe.map((recipe) => {
              const originalIndex = recipes.findIndex((r) => r._id === recipe._id);
              return (
                <tr key={recipe._id}>
                  <td>{originalIndex + 1}</td> { }
                  <td>
                    <img
                      src={recipe.recipeImg || "/dragondancing_1200x1200.jpg"}
                      alt={recipe.recipename}
                      style={{ width: "75px", height: "75px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                  <td className="name" onClick={() => handleNavigateRecipe(recipe._id)}>{recipe.recipename}</td>
                  <td>{recipe.userData[0]?.username || "Unknown"}</td>
                  <td>{recipe.averageRating}★</td>
                  <td>{recipe.reviewCount}</td>
                </tr>
              );
            }))}
          </tbody>
        </Table>


        {/* responsive design */}
        
        {
          filteredRecipe.length === 0 ? (
            <div>
              <td colSpan="6" className="text-center">Không có công thức nào</td>
            </div>
          ) : (
          filteredRecipe.map((recipe) => {
            const originalIndex = recipes.findIndex((r) => r._id === recipe._id);
          return (
            <div className="leaderBoard_unit_container" key={recipe._id} onClick={() => handleNavigateRecipe(recipe._id)}>
              <div className="rating_stat">
                <h5>#{originalIndex + 1}</h5>
                <p>{recipe.averageRating}★</p>
                <p>{recipe.reviewCount}</p>
              </div>
              <div className="rating_picture">
                <img
                  src={recipe.recipeImg || "/dragondancing_1200x1200.jpg"}
                  alt={recipe.recipename}
                  style={{ width: "85px", height: "112px", objectFit: "cover", borderRadius: "5px" }}
                />
              </div>
              <div className="unit_stat">
                <h5>{recipe.recipename}</h5>
                <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
                <p>Tác giả: {recipe.userData[0]?.username}</p>
              </div>
            </div>
            );
          }))}
      </Container>
    </div>
  );
};

export default TopRecipe;