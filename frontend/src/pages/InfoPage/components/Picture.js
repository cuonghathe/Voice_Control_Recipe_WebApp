import React from 'react';

const Picture = ({pictureLink, alt = "Article image"}) => {
  if (!pictureLink) return null;

  return (
    <div className="picture">
      <img src={pictureLink} alt={alt} />
    </div>
  )
}

export default Picture
