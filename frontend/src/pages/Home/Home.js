import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from '../../components/Hero';
import './home.scss';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const now = new Date();  // Get current date
      let dateThreshold = new Date(now);
      dateThreshold.setMonth(now.getMonth() - 3);  // Set threshold to 3 months ago

      try {
        const response = await axios.get("http://localhost:5000/recipe/api/getRecipes");
        const sortedRecipes = response.data.allRecipeData
          .filter((recipe) => {
            const createdAt = new Date(recipe.createdAt);
            return createdAt >= dateThreshold;  // Only recipes from the last 3 months
          })
          .sort((a, b) => b.averageRating - a.averageRating);  // Sort by average rating
        setRecipes(sortedRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/api/alluserstats");
        setUsers(response.data);
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

  return (
    <div>
      <Hero />
      <div>
        {recipes.map((recipe) => (
          <div key={recipe._id} onClick={() => handleNavigateRecipe(recipe._id)}>
            <h3>{recipe.recipename}</h3>
            {/* Add other recipe details if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
