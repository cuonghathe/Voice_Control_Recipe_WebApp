import axios from "axios";
import React, { useState } from "react";
import { Container, Form, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.scss";

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("authToken");
    const [searchTerm, setSearchTerm] = useState("");
    const userId = localStorage.getItem("userId");
    const userProfilePic = localStorage.getItem("userProfilePic");
    const userName = localStorage.getItem("userName");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userProfilePic");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    const handlenav = () => {
        navigate(`/userprofile/${userId}`);
    }




    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            console.warn("Search term is empty");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/recipe/api/search/${encodeURIComponent(searchTerm)}`);
            navigate("/search", { state: { results: response.data } });
        } catch (error) {
            console.error("Failed to search recipes:", error);
        }
    };



    return (
        <>
            <header>
                <Navbar bg="dark" data-bs-theme="dark" style={{ width: "100%" }}>
                    <Container>
                        <Nav className="nav__leftside">
                            <Navbar.Brand as={NavLink} to="/" className="text-light mx-2" style={{ fontSize: "24px" }}>
                                TastyEcho
                            </Navbar.Brand>
                            <Nav className="me-auto nav__option">
                                <Nav.Link as={NavLink} to="/Recipes">Công thức</Nav.Link>
                                <Nav.Link as={NavLink} to="/Recipe/Create">Tạo công thức</Nav.Link>
                                <Nav.Link as={NavLink} to="recipes/leaderboard">Bảng xếp hạng công thức</Nav.Link>
                                <Nav.Link as={NavLink} to="/users/leaderboard">Bảng xếp hạng người dùng</Nav.Link>
                            </Nav>
                        </Nav>

                        {/* mobile popup */}
                        <div className="navbar__btn">
                            <label htmlFor="mobile__input">
                            <i className="fa-solid fa-bars"></i>
                            </label>
                        </div>
                        <input type="checkbox" id="mobile__input" className="nav__input" />
                        <label htmlFor="mobile__input" className="nav-overlay"></label>
                        <div className="nav-container-mobile">
                            <div className="mobile__nav__rightside">
                                {isLoggedIn ? (
                                    <div className="ml-auto userProfile__section">
                                    <Nav className="profile__picture__container">
                                        <Nav.Link onClick={handlenav}><img className = "userProfilePic"src={userProfilePic || "/dragondancing_1200x1200.jpg"} alt = "user profile"/></Nav.Link>
                                        <Nav.Link onClick={handlenav}>@{userName}</Nav.Link>

                                    </Nav>
                                    <Nav className="user__acction">
                                        <Nav.Link onClick={handlenav}>Thông tin tài khoản</Nav.Link>
                                    </Nav>
                                    <Nav className="user__acction">
                                        <Nav.Link onClick={handleLogout}>Đăng xuất</Nav.Link>
                                    </Nav>
                                    </div>
                                ) : (
                                    <Nav className="ml-auto">
                                        <Nav className="user__acction">
                                            <Nav.Link href="/login">Đăng nhập</Nav.Link>
                                        </Nav>
                                        
                                        <Nav className="user__acction">
                                            <Nav.Link href="/register">Đăng ký</Nav.Link>
                                        </Nav>
                                    </Nav>
                                )}
                            </div>

                            <ul className="nav-container-list">
                                <Nav className="text-mid">
                                    <Form className="d-flex" style={{ maxWidth: "400px", width: "100%", marginTop: "16px", marginLeft: "-16px" }} onSubmit={handleSearch}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tìm kiếm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </Form>
                                </Nav>
                                <li className="nav">
                                    <a href="/">Home</a>
                                </li>
                                <li className="nav">
                                    <a href="/Recipes">Công thức</a>
                                </li>
                                <li className="nav">
                                    <a href="/Recipe/Create">Tạo công thức</a>
                                </li>
                                <li className="nav">
                                    <a href="recipes/leaderboard">Bảng xếp hạng công thức</a>
                                </li>
                                <li className="nav">
                                    <a href="/users/leaderboard">Bảng xếp hạng người dùng</a>
                                </li>
                            </ul>
                        </div>


                        <Nav className="nav__rightside">
                            <Nav className="text-mid">
                                <Form className="d-flex" style={{ maxWidth: "400px", width: "100%", marginTop: "auto", marginBottom: "auto" }} onSubmit={handleSearch}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Form>
                            </Nav>

                            {isLoggedIn ? (
                                <Nav className="ml-auto">
                                <div className="profile__picture__container">
                                    <Nav.Link onClick={handlenav}><img className = "userProfilePic"src={userProfilePic || "/dragondancing_1200x1200.jpg"} alt = "user profile"/></Nav.Link>
                                </div>
                                    <Nav.Link onClick={handleLogout}>Đăng xuất</Nav.Link>
                                </Nav>
                            ) : (
                                <Nav className="ml-auto">
                                    <Nav.Link href="/login">Đăng nhập</Nav.Link>
                                    <Nav.Link href="/register">Đăng ký</Nav.Link>
                                </Nav>
                            )}
                        </Nav>
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default Header;