import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RecipeCard = (recipe) => {
  
  const navigate = useNavigate();
  console.log(recipe)
  const handleNavigateRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <Card key={recipe._id} style={{ maxWidth: "21rem", width: "100%", marginBottom: "15px", boxShadow: "0px 2px 20px #cfd8dc", height: "27rem", cursor: "pointer" }}>
    <Card.Img style={{ width: "100%", height: "190px", maxWidth:"334px" }} variant="top" src={recipe.recipeImg || "/dragondancing_1200x1200.jpg"} />
    <Card.Body>
      <Card.Title style={{height: "50px"}}><small style={{ fontweight: "100px" }}>
          ({new Date(recipe.createdAt).toLocaleDateString()})</small></Card.Title>

      <Card.Text className="card_text">

      </Card.Text>
      <Card.Text>
        Điểm: <small className="star">{recipe.averageRating}★ </small><small>({recipe.reviewCount})</small>
      </Card.Text>
      <Button variant="outline-danger" onClick={() => handleNavigateRecipe(recipe._id)}>Xem công thức</Button>
    </Card.Body>
  </Card>
  )
}

export default RecipeCard
