import React from 'react'
import { Card, Button } from 'react-bootstrap';   
import { useNavigate } from "react-router-dom";

const DeviseRecipeHistory = ({recipes}) => {
  const navigate = useNavigate();


  const handleNavigateRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="top_recipe_container">
    <a href="/Recipes"><h1 className="text-center mt-5">Các công thức đã xem</h1></a>
      <div className="top_recipecard">
          {recipes.map((recipe) => (
          <Card key={recipe._id}>
            <Card.Img style={{ width: "100%", height: "170px", maxWidth:"334px" }} variant="top" src={recipe.recipeImg || "/dragondancing_1200x1200.jpg"} />
            <Card.Body>
              <Card.Title style={{height: "50px"}}>{recipe.recipename.length > 26
                  ? recipe.recipename.slice(0,26) + "..."
                  : recipe.recipename}</Card.Title>
              <Card.Text>
                <small className="star">{recipe.averageRating}★ </small><small className="review_num">Số đánh giá: ({recipe.reviewCount})</small>
              </Card.Text>
              <Button variant="outline-danger" onClick={() => handleNavigateRecipe(recipe._id)}>Xem công thức</Button>
            </Card.Body>
          </Card>
          ))}
      </div>
    </div>
  )
}

export default DeviseRecipeHistory
