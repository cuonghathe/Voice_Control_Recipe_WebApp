import React from 'react'
import "./DescriptionBox.scss";

const DescriptionBox = ({description, link}) => {
  return (
    <div className='description'>
      <div className='description_icon'>
        <i class="fa-regular fa-circle-question"></i>
      </div>
      <div className='description_container'>
          <p className='description_text'>{description}</p>
          {link ? 
          <a href={link} target="_blank" rel="noopener noreferrer">Xem thêm</a>
          : <p></p>
        }
      </div>
    </div>
  )
}

export default DescriptionBox
