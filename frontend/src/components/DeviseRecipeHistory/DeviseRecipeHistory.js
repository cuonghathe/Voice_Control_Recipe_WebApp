import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "../../pages/Home/home.scss";


const DeviseRecipeHistory = ({recipes}) => {
  const navigate = useNavigate();

  const settings = {
    arrows: true,
    speed: 500,           
    slidesToShow: 4,      
    slidesToScroll: 2,
    infinite: false,   
    responsive: [
      {
        breakpoint: 1267,  
        settings: {
          slidesToShow: 3, 
          slidesToScroll: 3,    
        }
      },

      {
        breakpoint: 600,
        settings: {
          arrows: false,
          slidesToShow: 1.5, 
        }
      },

      {
        breakpoint: 401,
        settings: {
          arrows: false,
          slidesToShow: 1, 
        }
      }
    ]
  };

  const handleRemoveHistory = () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch sử xem công thức?")) return;
    localStorage.removeItem("recipeHistoryInfo");
    window.location.reload();
  }

  const handleNavigateRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="history_recipe_container">

    <p className="text_style_button" onClick={() => handleRemoveHistory()} >Xóa lịch sử xem</p>
    <h1 className="text-center mt-5">Các công thức đã xem</h1>
      <div className="history_recipecard">
        {recipes.length > 0 ?
          <Slider {...settings}>
            {recipes.map((recipe) => (
              <Card key={recipe._id}>
              <Card.Img style={{ width: "100%", height: "170px", objectFit: "cover" }} variant="top" src={recipe.recipeImg || "/dragondancing_1200x1200.jpg"} />
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
          </Slider>
          : <p className="text-center">Bạn chưa xem công thức nào</p>
        }
      </div>
    </div>
  )
}

export default DeviseRecipeHistory
