import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import Scrolling from "../../api/voiceControl/scrolling";
import TTS, { stopTTS } from "../../api/voiceControl/TTS";
import ChatBotBox from "../../components/chatBot/ChatBotBox";
import VoiceControlInstruction from "../../components/voiceControlInstruction";
import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import "./Recipe.scss";

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [checked, setChecked] = useState([]);
    const [servings, setServings] = useState(1);
    const [adjustedIngredients, setAdjustedIngredients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const [newReview, setNewReview] = useState({ username: "", rating: "1", description: "" });
    const token = localStorage.getItem("authToken");
    const [isExpanded, setIsExpanded] = useState(false);
    const instructionsRef = useRef(null);
    const reviewRef = useRef(null);
    const ingredientsRef = useRef(null);
    const [command, setCommand] = useState("");
    const [adjustmentFactor, setAdjustmentFactor] = useState([]);


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipe/api/singleRecipe/${id}`);
                setRecipe(response.data);
                setServings(response.data.servingSize);
                setAdjustedIngredients(response.data.ingredients);
                
            } catch (error) {
                console.error("Failed to fetch recipe:", error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/review/api/getreview/${id}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        };



        fetchRecipe();
        fetchReviews();
    }, [id]);


    const handleCheck = (Item) => {
        setChecked(prevState =>
            prevState.includes(Item)
                ? prevState.filter(item => item !== Item)
                : [...prevState, Item]
        );
    };

    useEffect(() => {
        if (!adjustmentFactor.length && recipe) {
            const factors = recipe.ingredients.map(ingredient => Number(ingredient.quantity) / Number(recipe.servingSize))
            setAdjustmentFactor(factors);
        }
    }, [recipe]);
    
    
    const adjustIngredients = (newServings) => {
        const newIngredients = recipe.ingredients.map((ingredient, i) => ({
            ...ingredient,
            quantity: Math.ceil(newServings * adjustmentFactor[i] * 4)/4
        }));
        setAdjustedIngredients(newIngredients);
    };    

    const handleServingsChange = (newServings) => {
        if (newServings <= 0){
            newServings = 1;
        }
        adjustIngredients(newServings);
        setServings(newServings);
        setRecipe(prev => ({
            ...prev,
            ingredients: adjustedIngredients,
            servingSize: newServings,
        }));
        
    };


    const handleAddReview = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/review/api/create/${id}`, newReview, {
                headers: { Authorization: `${token}` },
            });
            setReviews([...reviews, response.data.addReview]);
            setNewReview({ username: "", rating: "", description: "" });
        } catch (error) {
            console.error("Lỗi tạo:", error);
            setError(error.response?.data?.error || "Lỗi tạo:");
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
        return (total / reviews.length).toFixed(1);
    };

    const scrollToInstructions = () => {
        instructionsRef.current?.scrollIntoView();
    };

    const scrollToReviews = () => {
        reviewRef.current?.scrollIntoView();
    };

    const scrollToIngredients = () => {
        ingredientsRef.current?.scrollIntoView();
    };

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSpeakIngredients = () => {
        if (!recipe || !recipe.ingredients) return;

        const ingredientsText = recipe.ingredients
            .map((ingredient, i) => `${ingredient.name}: ${adjustedIngredients[i].quantity} ${ingredient.measurement}`)
            .join(", ");
        
        TTS(ingredientsText);
    };

    const handleSpeakInstruction = () =>{
        if(!recipe || !recipe.instructions) return;
        const instructionText = recipe.instructions.map((instruction, index) => `Bước ${index} ${instruction}`)
        .join(", ");
        TTS(instructionText);
    }


    if (!recipe) return <p>Đang tải dữ liệu...</p>;

    return (

        <Container className="recipe-container">
            <div className="recipe-title-contaier">
                <h1 className="recipe-title">{recipe.recipename}</h1>
            </div>
            <div className="recipe-header-details-container">
                <div className="recipe-header-container">
                    <div className="recipe-header">
                        <div className="recipe-image-container">
                            <Card className="recipe-image-card">
                                <Card.Img variant="top" src={recipe.recipeImg || "/logo192.png"} />
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="recipe-details">
                    <h4 className="recipe-author">Tác giả: <span className="review">{recipe.userId.username}</span></h4>
                    <div className="rating_info">
                        Điểm: <span className="star">{calculateAverageRating()}<i >★ </i></span>
                        <span className="review_btn" onClick={scrollToReviews}>({reviews.length}) Đánh giá</span>
                        <Scrolling
                            scrollToInstructions={scrollToInstructions}
                            scrollToReviews={scrollToReviews}
                            scrollToIngredients={scrollToIngredients}
                            handleAddServing={() =>handleServingsChange(servings + 1)}
                            handleRemoveServing={() =>handleServingsChange(servings - 1)}
                            handleSpeakIngredients={handleSpeakIngredients}
                            handleAddReview={handleAddReview}
                            userCommand={setCommand}
                        />

                    </div>
                    <Card.Title>Thời gian nấu: <span className="mb-4">{recipe.cookingTime}</span>
                    </Card.Title>
                    <div className="title_with_des">
                        <DescriptionBox/>
                        <Card.Title>Suất ăn</Card.Title>
                    </div>
                    
                    <div className="mb-4">
                        <div className="d-flex align-items-center button-group-outline mt-2 serving_container">
                            <ButtonGroup className="serving_change">
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings - 10)}>-10</Button>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings - 5)}>-5</Button>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings - 1)}>-1</Button>
                                <p className="mx-2 my-0 servings-display">{servings}</p>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings + 1)}>+1</Button>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings + 5)}>+5</Button>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings + 10)}>+10</Button>
                            </ButtonGroup>

                            <Button variant="primary" className="navBtn" onClick={scrollToInstructions}>
                                Xem Cách Làm
                            </Button>
                        </div>
                    </div>
                    <div className="description">
                        <Card.Title>Mô tả:</Card.Title>
                        <p className="detail" style={{WebkitLineClamp: isExpanded ? 'none' : 3}}>
                            {recipe.description}
                        </p>

                        <p className="toggle" onClick={toggleDescription}>
                            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="recipe-ingredients-instructions">
                <Card className="ingredients-card" ref={ingredientsRef}>
                    <Card.Body>
                        <div className="info_box">
                            <div className="ingredients-card-title">
                                <DescriptionBox/>
                                <h4 className="mt-2">Nguyên liệu</h4>
                            </div>
                            <div className="recipe-ingredients-instructions">
                                <Button variant="success" className="user__action__button" onClick={handleSpeakIngredients}>Đọc</Button>
                                <Button variant="danger" className="user__action__button" onClick={stopTTS} >Dừng</Button>
                            </div>
                        </div>

                        <Form>
                            {adjustedIngredients.map((ingredient, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    id={`ingredient-${index}`}
                                    label={`${ingredient.name}: ${ingredient.quantity} (${ingredient.measurement})`}
                                    checked={checked.includes(ingredient.name)}
                                    onChange={() => handleCheck(ingredient.name)}
                                    className={checked.includes(ingredient.name) ? "checked" : ""}
                                />
                            ))}
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="instructions-card mt-4" ref={instructionsRef}>
                    <Card.Body>
                        <div className="info_box">
                            <h4 className="mt-2">Cách làm</h4>
                            <div className="recipe-ingredients-instructions">
                                    <Button variant="success" className="user__action__button" onClick={handleSpeakInstruction}>Đọc</Button>
                                    <Button variant="danger" className="user__action__button" onClick={stopTTS} >Dừng</Button>
                            </div>
                        </div>
                        <Form>
                            {recipe.instructions.map((instruction, index) => (
                                <Form.Check
                                key={index}
                                type="checkbox"
                                id={`instruction-${index}`}
                                label={instruction}
                                checked={checked.includes(instruction)}
                                onChange={() => handleCheck(instruction)}
                                className={checked.includes(instruction) ? "checked" : ""}
                            />
                            ))}
                        </Form>
                    </Card.Body>
                </Card>
            </div>

            <div className="reviewdetails mt-4">
                <h2>Reviews ({reviews.length})</h2>
                <Form className="mt-3">
                    <Form.Group>
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            type="text"
                            value={newReview.username}
                            onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
                            placeholder="Nhập tên của bạn"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Đánh giá (1-5)</Form.Label>
                        <Form.Select
                            className="rating"
                            value={newReview.rating}
                            onChange={(e) =>
                                setNewReview({ ...newReview, rating: e.target.value })
                            }
                            >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Bình luận</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newReview.description}
                            onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                            placeholder="Viết nhận xét của bạn..."
                        />
                    </Form.Group>

                    {typeof error === "object" ? <p className="error">{error.message}</p> : <p className="error">{error}</p>}

                    <Button variant="primary" className="mt-3 userprofile__action" onClick={handleAddReview}>
                        Gửi đánh giá
                    </Button>
                </Form>

                <div className="user_review mt-4" ref={reviewRef}>
                    {reviews.map((review) => (
                        <Card key={review._id} className="mb-3">
                            <Card.Body>
                                <div className="info_box">
                                    <h5>{review.username}
                                        <span className="stars">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </span>
                                    </h5>
                                </div>
                                <div>
                                    <small className="Date">{new Date(review.createdAt).toLocaleDateString()}</small>
                                </div>

                                <p className="mt-2">{review.description}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
            
            <ChatBotBox recipeInfo = {recipe} command={command}/>
            <VoiceControlInstruction/>
            
        </Container>
    );
}


export default RecipeDetails;