import React from 'react';

const Paragraph = ({paragraphInfo}) => {
  if (!paragraphInfo) return null;

  return (
    <div className="paragraph">
      <p>{paragraphInfo}</p>
    </div>
  )
}

export default Paragraph
