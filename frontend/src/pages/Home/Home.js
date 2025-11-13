import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from 'react-bootstrap';   
import Hero from '../../components/Hero';
import './home.scss';


const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const now = new Date();
      let dateThreshold = new Date(now);
      dateThreshold.setMonth(now.getMonth() - 3);  

      try {
        const response = await axios.get("http://localhost:5000/recipe/api/getRecipes");
        const sortedRecipes = response.data.allRecipeData
          .filter((recipe) => {
            const createdAt = new Date(recipe.createdAt);
            return createdAt >= dateThreshold;
          })
          .sort((a, b) => b.averageRating - a.averageRating).slice(0, 10);
        setRecipes(sortedRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/api/alluserstats");
        const sortedUsers = response.data
          .sort((a, b) => b.totalRecipes - a.totalRecipes) // Sort by total recipes
          .slice(0, 10); // Take top 10 users
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    };

    fetchRecipes();
    fetchUsers();  // Fetch user data as well if needed
  }, []);

  const handleNavigateRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  const handleNavigateUser = (id) => {
    navigate(`/UserProfilePublic/${id}`)
  };


  return (
    <>
      <Hero />
      <div className="top_recipe_container">
      <a href="/Recipes"><h1 className="text-center mt-5">Công thức nổi bật trong tháng qua</h1></a>
        <div className="top_recipecard">
            {recipes.map((recipe) => (
            <Card key={recipe._id}>
              <Card.Img style={{ width: "100%", height: "170px", maxWidth:"334px" }} variant="top" src={recipe.recipeImg || "/dragondancing_1200x1200.jpg"} />
              <Card.Body>
                <Card.Title style={{height: "50px"}}>{recipe.recipename.length > 26
                    ? recipe.recipename.slice(0,26) + "..."
                    : recipe.recipename}</Card.Title>
                <Card.Text>
                  Điểm: {recipe.averageRating}<small className="recipe_star">★ </small><small>( {recipe.reviewCount} )</small>
                </Card.Text>
                <Button variant="outline-danger" onClick={() => handleNavigateRecipe(recipe._id)}>Xem công thức</Button>
              </Card.Body>
            </Card>
            ))}
        </div>
      </div>

      <div className="top_user_container">
        <a href="/users/leaderboard"><h1 className="text-center mt-5">Người dùng nổi bật</h1></a>
        <div className="top_usercard">
          {users.map((user) => (
            <Card key={user._id} onClick={() => handleNavigateUser(user._id)}>
              <Card.Body>
                <Card.Title>
                  <img src={user.userprofile || "/dragondancing_1200x1200.jpg"} alt={user.username}/>
                  {user.username}
                </Card.Title>
                <Card.Text>
                  Tổng công thức: {user.totalRecipes} <br />
                  Tổng đánh giá: {user.totalReviews} <br />
                  Điểm trung bình: {user.averageRatingAcrossRecipes}<small className="user_star">★</small>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
