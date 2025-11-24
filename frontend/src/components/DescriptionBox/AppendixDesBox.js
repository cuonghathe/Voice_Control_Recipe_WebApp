import React from "react"

const AppendixDesBox = ({keyWord, defintion, link}) => {
  return (
    <div className="appendices">
      <div className="appendices_keyWord">
        <p>{keyWord}</p>
      </div>
      <div className="description_container">
          <p className="description_text">{defintion}</p>
          {link ? 
          <a href={link} target="_blank" rel="noopener noreferrer">Xem thêm</a>
          : <p></p>
        }
      </div>
    </div>
  )
}

export default AppendixDesBox
