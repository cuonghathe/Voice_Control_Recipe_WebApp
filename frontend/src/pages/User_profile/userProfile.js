import axios from "axios";
import React, { useEffect, useState } from "react";
import { CardTitle } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import "../Recipe/Recipe.scss";

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [ratingRange] = useState("");
    const [sortOrder, setSortOrder] = useState("highest");
    const [nameFilter, setNameFilter] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/user/api/profile/${userId}`);
                setUser(userResponse.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        const fetchUserRecipes = async () => {
            try {
                const recipeResponse = await axios.get(`http://localhost:5000/user/api/getuserrecipe/${userId}`);
                setRecipes(recipeResponse.data);
            } catch (error) {
                console.error("Failed to fetch recipes:", error);
            }
        };

        const fetchUserReviews = async () => {
            try {
                const reviewResponse = await axios.get(`http://localhost:5000/user/api/getuserreview/${userId}`);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        };


        fetchUserData();
        fetchUserRecipes();
        fetchUserReviews();
    }, [userId]);


    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản?")) return;

        try {
            await axios.delete(`http://localhost:5000/user/api/delprofile/${userId}`, {
            });
            localStorage.removeItem("authToken");
            navigate("/");

        } catch (error) {
            console.error("Fuck!:", error);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa công thức này?")) return;

        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:5000/recipe/api/delete/${recipeId}`, {
                headers: { Authorization: `${token}` },
            });
            setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa review này?")) return;

        try {
            await axios.delete(`http://localhost:5000/review/api/deletereview/${reviewId}`, {
                headers: { Authorization: `${token}` },
            });
            setReviews(reviews.filter(review => review._id !== reviewId));
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleNameFilterChange = (e) => {
        setNameFilter(e.target.value);
      };
    
    
      const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
      };
    
      const filteredRecipe = recipes
      .filter((recipe) => {
        const matchesName =
          nameFilter === "" ||
          (recipe.recipename && recipe.recipename.toLowerCase().includes(nameFilter.toLowerCase()));
    
        const matchesRating =
          ratingRange === "" ||
          ratingRange === "Điểm" ||
          (ratingRange === "Review" && recipe.reviewCount) ||
          (ratingRange === "Ngày tạo" && recipe.createdAt);
    
        return matchesRating && matchesName;
      })
    
        .sort((a, b) => {
          if (sortOrder === "date↓") return new Date(a.createdAt) - new Date(b.createdAt);
          if (sortOrder === "date↑") return new Date(b.createdAt) - new Date(a.createdAt);
          return new Date(b.createdAt) - new Date(a.createdAt);
    
    });
    


    if (!user) {
        return <div>Đang tải dữ liệu...</div>;
    }
    
    return (
        <Container className="recipe-container">
            <div className="recipe-header-details-container">
                <div className="recipe-header-container">
                    <div className="recipe-header">
                        <h1 className="recipe-title">{ }</h1>
                        <div className="recipe-image-container">
                            <Card className="recipe-image-card">
                                <Card.Img variant="top" src={user.userprofile || "/dragondancing_1200x1200.jpg"} />
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="user-details">

                    <h4 className="recipe-author">
                        Username: <span className="review">{user.username}</span>

                    </h4>
                    <Card.Title>Email: <span className="mb-4">{user.email}</span></Card.Title>
                    <Card.Title>Ngày tham gia: <span className="mb-4">{new Date(user.createdAt).toLocaleDateString()}</span></Card.Title>
                    <Card.Title>Điểm trung bình:<span className="star"> {user.averageRatingAcrossRecipes}★</span> </Card.Title>
                    <Card.Title>Số bài đăng:<span className="mb-4"> {user.totalRecipes}</span> </Card.Title>
                    <Card.Title>Số đánh giá đã nhận:<span className="mb-4"> {user.totalReviews}</span> </Card.Title>
                    <Card.Title>Số đánh giá đã tạo:<span className="mb-4"> {reviews.length}</span> </Card.Title>
                    <Card.Title>Số lần đăng nhập:<span className="mb-4"> {user.tokens.length}</span>
                    <div className="userprofile__action">
                        <Button variant="warning" onClick={() => navigate(`/updateprofile/${userId}`)}>Sửa tài khoản</Button>
                        <Button variant="danger" onClick={() => handleDeleteUser(user._id)} >Xóa tài khoán</Button>
                    </div></Card.Title>
                </div>
            </div>


            <div className="recipe-ingredients-instructions">
                <Card className="ingredients-card">
                    <Card.Body>
                        <h4 className="mt-2">Công thức đã đăng ({recipes.length}) </h4>
                        <div className="filters">
                            <input className="search_input"
                                type="text"
                                placeholder="Tìm kiếm"
                                value={nameFilter}
                                onChange={handleNameFilterChange}
                            />
                            <select className="form-select" onChange={handleSortOrderChange} value={sortOrder}>
                                <option value="date↑">Mới nhất</option>
                                <option value="date↓">Cũ nhất</option>
                            </select>
                        </div>
                        <Form>                                      
                        {
                        filteredRecipe.length === 0 ? (
                            <tr>
                            <td colSpan="6" className="text-center">Không có công thức nào</td>
                            </tr>
                        ) : (
                            filteredRecipe.map(recipe => (
                                <Card key={recipe._id} className="recipe-card">
                                    <Card.Body>
                                        <div className="info_box">
                                            <h5>{recipe.recipename}
                                                <p>Ngày tạo: <span className="mb-4">{new Date(recipe.createdAt).toLocaleDateString()}   </span></p>
                                            </h5>
                                            <div className="recipe-ingredients-instructions">
                                                <Button variant="success" className="user__action__button" href={`/recipe/${recipe._id}`}>Xem</Button>
                                                <Button variant="warning" className="user__action__button" onClick={() => navigate(`/updaterecipe/${recipe._id}`)} >Sửa!</Button>
                                                <Button variant="danger" className="user__action__button" onClick={() => handleDeleteRecipe(recipe._id)} >Xóa!</Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>

                            )))}
                        </Form>
                    </Card.Body>
                </Card>

            </div>



            <div className="reviewdetails mt-4">
                <h2>Đánh giá đã tạo ({reviews.length})</h2>
                <div className="user_review mt-4">
                    {reviews.map((review) => (
                        <Card key={review._id} className="mb-3">
                            <Card.Body>
                                <div className="info_box">
                                    <h5>{review.username}
                                        <span className="stars">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </span>
                                        <div>
                                            <small className="Date">{new Date(review.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </h5>

                                    <div className="recipe-ingredients-instructions">
                                        <Button variant="success" className="user__action__button" href={`/recipe/${review.recipeid}`}>Xem</Button>
                                        <Button variant="danger" className="user__action__button" onClick={() => handleDeleteReview(review._id)}>Xóa!</Button>
                                    </div>
                                </div>



                                <p className="mt-2">{review.description}</p>

                                <CardTitle>Công thức đánh giá: <span className="mb-4">{review.recipename}</span></CardTitle>

                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>

        </Container>
    );
};

export default UserProfile;
