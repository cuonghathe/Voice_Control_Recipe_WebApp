import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light mt-5 pt-4 pb-2">
      <Container>
        <Row>
          <Col md={4} sm={12} className="mb-3">
            <h4 className="footer-title">TastyEcho</h4>
            <p className="footer-description">
              Nơi chia sẻ, khám phá và đánh giá những công thức nấu ăn độc đáo từ cộng đồng yêu bếp Việt.
            </p>
          </Col>

          <Col md={4} sm={12} className="mb-3">
            <h5>Trang web</h5>
            <ul className="footer-links list-unstyled">
              <li><NavLink to="/">Trang chủ</NavLink></li>
              <li><NavLink to="/Recipes">Công thức</NavLink></li>
              <li><NavLink to="/Recipe/Create">Tạo công thức</NavLink></li>
              <li><NavLink to="/recipes/leaderboard">Bảng xếp hạng công thức</NavLink></li>
              <li><NavLink to="/users/leaderboard">Bảng xếp hạng người dùng</NavLink></li>
            </ul>
          </Col>

          <Col md={4} sm={12} className="mb-3">
            <h5>Liên hệ</h5>
            <p>Email: <a href="mailto:support@tastyecho.com" className="text-light">support@tastyecho.com</a></p>
            <div className="footer-social">
              <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/"><i className="fa-brands fa-facebook"></i></a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/"><i className="fa-brands fa-instagram"></i></a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/"><i className="fa-brands fa-youtube"></i></a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.pinterest.com/"><i className="fa-brands fa-pinterest"></i></a>
              <a target="_blank" rel="noopener noreferrer" href="https://x.com/"><i className="fa-brands fa-x-twitter"></i></a>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/cuonghathe/Voice_Control_Recipe_WebApp"><i className="fa-brands fa-github"></i></a>
            </div>
          </Col>
        </Row>

        <hr className="bg-secondary" />
        <div className="text-center">
          <small>@ {new Date().getFullYear()} TastyEcho</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
