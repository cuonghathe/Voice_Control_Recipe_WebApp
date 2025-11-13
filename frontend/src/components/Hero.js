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
        </div>
      </div>
    </div>
  );
};

export default Hero;
