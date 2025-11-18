import React from 'react'
import "./DescriptionBox.scss";

const DescriptionBox = ({description}) => {
  return (
    <div className='description'>
      <div className='description_icon'>
        <i class="fa-regular fa-circle-question"></i>
      </div>
      <div className='description_container'>
          <p className='description_text'>{description}</p>
      </div>
    </div>
  )
}

export default DescriptionBox
