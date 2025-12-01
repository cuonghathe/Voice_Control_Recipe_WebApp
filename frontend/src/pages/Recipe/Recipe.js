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
import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import VoiceControlInstruction from "../../components/voiceControlInstruction";
import dataWithAppendices from "./dataWithApendices";
import pushDeviseRecipeHistoryData from "../../components/DeviseRecipeHistory/pushDeviseRecipeHistoryData";
import "./Recipe.scss";
import formatRecipeData from "../../components/chatBot/formatData";

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
    const appendicesRef = useRef(null);
    const [command, setCommand] = useState("");
    const [adjustmentFactor, setAdjustmentFactor] = useState([]);

    const servingDes = "Số lượng nguyên liệu sẽ được thay đổi trực tiếp khi số lượng suất ăn được thay đổi"
    const ttsDes = `Tính năng TTS (tường thuật văn bản) cho phép website tường thuật các phần 
        văn bản được hỗ trợ. Để sử dụng tính năng tường thuật văn bản, bạn chỉ cần nhấn vào nút 
        “Đọc” được đặt tại các phần nội dung được hỗ trợ trong trang chi tiết công thức.
        Trong quá trình tường thuật, nếu bạn không muốn tiếp tục nghe, chỉ cần nhấn nút “Dừng”.`
    const ttsDesHelpLink = `/Info`;
    const instuctionDes = `Các bước thực hiện món ăn được trình bày theo thứ tự. 
        Bạn có thể đánh dấu bước đã làm để ẩn hình ảnh (nếu có) hoặc dùng tính năng tường thuật để nghe hướng dẫn.`;
    const appendixDes = `Phần phụ lục cung cấp giải thích cho các thuật ngữ và nguyên liệu có thể gây nhầm lẫn trong công thức. 
        Khi gặp một từ khóa được đánh dấu, bạn có thể di chuột vào chúng xem ngay giải thích`;
    const voiceControlInstruc = [
        {function: `scrollToIngredients()`, text: `Đi đến phần nguyên liệu: "nguyên liệu"`},
        {function: `scrollToInstructions()`, text: `Đi đến phần bước làm: "bước làm", "hướng dẫn"`},
    ]
    

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipe/api/singleRecipe/${id}`);
                setRecipe(response.data);
                setServings(response.data.servingSize);
                setAdjustedIngredients(response.data.ingredients);
                pushDeviseRecipeHistoryData(id)
                
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

    const scrollToAppendices = () => {
        appendicesRef.current?.scrollIntoView();
    };

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSpeakIngredients = () => {
        if (!recipe || !recipe.ingredients) return;

        const ingredientsText = recipe.ingredients
            .map((ingredient, i) => `${ingredient.name}: ${adjustedIngredients[i].quantity} ${ingredient.measurement}`)
            .join(", ");
        console.log(ingredientsText)
        TTS(ingredientsText);
    };

    const handleSpeakInstruction = () =>{
        if(!recipe || !recipe.instructions) return;
        const instructionText = recipe.instructions.map((instruction, index) => `Bước ${index + 1} ${instruction.name}`)
        .join(", ");
        TTS(instructionText);

    }

    const handleSpeakAppendices = () =>{
        if(!recipe || !recipe.appendices) return;
        const appendicesText = recipe.appendices.map((appendix, index) => `Phụ lục ${index + 1} ${appendix.keyWord} ${appendix.defintion}`)
        .join(", ");
        TTS(appendicesText);
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
                                <Card.Img variant="top" src={recipe.recipeImg  || "/dragondancing_1200x1200.jpg"} />
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
                            scrollToAppendices={scrollToAppendices}
                            handleAddServing={() =>handleServingsChange(servings + 1)}
                            handleRemoveServing={() =>handleServingsChange(servings - 1)}
                            handleSpeakIngredients={handleSpeakIngredients}
                            handleSpeakInstruction={handleSpeakInstruction}
                            handleSpeakAppendices={handleSpeakAppendices}
                            handleAddReview={handleAddReview}
                            userCommand={setCommand}
                        />

                    </div>
                    <Card.Title>Thời gian nấu: <span className="mb-4">{recipe.cookingTime}</span>
                    </Card.Title>
                    <div className="title_with_des">
                        <Card.Title>Suất ăn</Card.Title>
                        <DescriptionBox description = {servingDes}/>
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
                    
                    <div ref={ingredientsRef}/> 

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
                <Card className="ingredients-card" >
                    <Card.Body>
                        <div className="info_box">
                            <div className="ingredients-card-title">
                                <h4 className="mt-2">Nguyên liệu</h4>
                                <DescriptionBox description={ttsDes} link={ttsDesHelpLink}/>
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
                                    label={<div className="data_with_apperndices">{dataWithAppendices(ingredient.name, recipe.appendices)} {": "} 
                                    {ingredient.quantity} ({ingredient.measurement})</div>}                                   
                                    checked={checked.includes(ingredient)}
                                    onChange={() => handleCheck(ingredient)}
                                    className={checked.includes(ingredient) ? "ingredient_checked" : ""}
                                />
                            ))}
                        </Form>
                        <div ref={instructionsRef}/>
                    </Card.Body>
                </Card>

                <Card className="instructions-card mt-4" >
                    <Card.Body>
                        <div className="info_box">
                            <div className="ingredients-card-title">
                                <h4 className="mt-2">Cách làm</h4>
                                <DescriptionBox description={instuctionDes}/>
                            </div>
                            <div className="recipe-ingredients-instructions">
                                    <Button variant="success" className="user__action__button" onClick={handleSpeakInstruction}>Đọc</Button>
                                    <Button variant="danger" className="user__action__button" onClick={stopTTS} >Dừng</Button>
                            </div>
                        </div>
                        <Form>
                            {recipe.instructions.map((instruction, index) => (
                                <div key={index} className={checked.includes(instruction) ? "instruction_checked" : ""}>
                                    <Form.Check
                                    type="checkbox"
                                    id={`instruction-${index}`}
                                    label={<div className="data_with_apperndices">{dataWithAppendices(instruction.name, recipe.appendices)}</div>}
                                    checked={checked.includes(instruction)}
                                    onChange={() => handleCheck(instruction)}
                                    />
                                    {instruction.instructionImg?
                                        <div className="instruction_pic">
                                            <Card.Img variant="top" src={instruction.instructionImg} />
                                        </div>
                                        :<div/>    
                                    }
                                </div>
                            ))}
                        </Form>
                        <div ref={appendicesRef}/>
                    </Card.Body>
                </Card>

                <Card className="instructions-card mt-4">
                    <Card.Body>
                        <div className="info_box">
                            <div className="ingredients-card-title">
                                <h4 className="mt-2">Phụ lục</h4>
                                <DescriptionBox description={appendixDes}/>
                            </div>
                            <div className="recipe-ingredients-instructions">
                                    <Button variant="success" className="user__action__button" onClick={handleSpeakAppendices}>Đọc</Button>
                                    <Button variant="danger" className="user__action__button" onClick={stopTTS} >Dừng</Button>
                            </div>
                        </div>
                        <Form>
                            {recipe.appendices.map((appendix, index) => (
                                <div key={index} className={checked.includes(appendix) ? "appendix_checked" : "appendix"}>
                                    <Form.Check
                                    type="checkbox"
                                    id={`appendix-${index}`}
                                    label={appendix.keyWord}
                                    checked={checked.includes(appendix)}
                                    onChange={() => handleCheck(appendix)}
                                    />
                                    
                                    <div className="appendix_def">
                                        <p>: {appendix.defintion}</p>
                                    </div>
                                </div>
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
                    <div ref={reviewRef}/>
                </Form>

                <div className="user_review mt-4" >
                    {reviews.map((review) => (
                        <Card key={review._id} className="mb-3">
                            <Card.Body>
                                <div className="review_info_box">
                                    <img className = "userProfilePic"src={"/logoUser.jpg"} alt = "user profile"/>
                                    <div>
                                        <div className="info_box">
                                            <h5>{review.username}
                                                <span className="stars">
                                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                </span>
                                            </h5>
                                        </div>
                                        <small className="Date">{new Date(review.createdAt).toLocaleDateString()}</small>
                                    </div>
                                </div>

                                <p className="mt-2">{review.description}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
            
            <ChatBotBox recipeInfo = {formatRecipeData(recipe)} command={command}/>
            <VoiceControlInstruction
                scrollToInstructions={scrollToInstructions}
                scrollToReviews={scrollToReviews}
                scrollToIngredients={scrollToIngredients}
                scrollToAppendices={scrollToAppendices}
                handleAddServing={() =>handleServingsChange(servings + 1)}
                handleRemoveServing={() =>handleServingsChange(servings - 1)}
                handleSpeakIngredients={handleSpeakIngredients}
                handleSpeakInstruction={handleSpeakInstruction}
                handleSpeakAppendices={handleSpeakAppendices}
                handleAddReview={handleAddReview}
                voiceControlInstructionArr={voiceControlInstruc}
            />
            
        </Container>
    );
}


export default RecipeDetails;