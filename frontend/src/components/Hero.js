import React from 'react';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero__left">
        <div className="hero__content">
          <div className="hero__tag">
            <p className="hero__line"></p>
            <p className="hero__label">Tasty echo</p>
          </div>

          <h1 className="hero__title">
            Nấu ăn thông minh hơn
            <br/>
            với điều khiển giọng nói
          </h1>

          <div className="hero__cta">
            <a className="hero__more" href="/Recipes">Tìm hiểu thêm</a>
            <a className="hero__more" href="/Recipes">Xem công thức </a>
          </div>

          <div class="social_icon">
            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/" ><i class="fa-brands fa-facebook"></i></a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/"><i class="fa-brands fa-instagram"></i></a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/"><i class="fa-brands fa-youtube"></i></a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.pinterest.com/"><i class="fa-brands fa-pinterest"></i></a>
            <a target="_blank" rel="noopener noreferrer" href="https://x.com/"><i class="fa-brands fa-x-twitter"></i></a>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/cuonghathe/Voice_Control_Recipe_WebApp"><i class="fa-brands fa-github" rel="noopener noreferrer"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
