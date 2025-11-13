import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../src/pages/Dashboard/Dashboard.scss';


const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results } = location.state || { results: [] };

    const handleNavigateRecipe = (id) => {
        navigate(`/recipe/${id}`);
    };

    return (
        <Container className='dashboard_container'>
            <div className="recipe_container">
                <h1 className="text-center mt-5">Kết quả tìm kiếm ({results.length})</h1>
                <div className="recipecard">
                    {results.map((recipe) => (
                    <Card key={recipe._id}>
                      <Card.Img style={{ width: "100%", height: "190px", maxWidth:"334px" }} variant="top" src={recipe.recipeImg || "/dragondancing_1200x1200.jpg"} />
                      <Card.Body>
                        <Card.Title style={{height: "50px"}}>{recipe.recipename.length > 24 
                            ? recipe.recipename.slice(0,24) + "..."
                            : recipe.recipename} <small style={{ fontweight: "100px" }}>
                            ({new Date(recipe.createdAt).toLocaleDateString()})</small></Card.Title>
        
                        <Card.Text className="card_text">
                          {recipe.description.length > 100
                            ? recipe.description.slice(0, 100) + "..."
                            : recipe.description}
                        </Card.Text>

                        <Card.Text>
                          Điểm: <small className="star">{recipe.averageRating}★ </small><small>( {recipe.reviewCount} )</small>
                        </Card.Text>
                        <Button variant="outline-danger" onClick={() => handleNavigateRecipe(recipe._id)}>Xem công thức</Button>
                      </Card.Body>
                    </Card>
                    ))}
                </div>
            </div>
        </Container>
    );
};


export default SearchResults;