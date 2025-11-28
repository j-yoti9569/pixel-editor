import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

const CardCanvas = forwardRef(({ bg, filter, textStyle, dateText, uploaded }, ref) => {
  const [pos, setPos] = useState({ x: 150, y: 80 });
  const [size, setSize] = useState({ w: 360, h: 280 });

  useImperativeHandle(ref, () => ({
    reset() {
      setPos({ x: 150, y: 80 });
      setSize({ w: 360, h: 280 });
    }
  }));

  return (
    <div className="canvas">
      <div
        className="card"
        style={{
          left: pos.x,
          top: pos.y,
          width: size.w,
          height: size.h,
          background: bg,
          filter: filter
        }}
      >
        {uploaded && (
          <img src={uploaded} className="card-img" alt="preview" />
        )}

        <div
          className="card-text"
          contentEditable
          suppressContentEditableWarning
          style={{
            fontWeight: textStyle.bold ? "bold" : "",
            fontStyle: textStyle.italic ? "italic" : "",
            textDecoration: textStyle.underline ? "underline" : ""
          }}
        >
          What's on your mind?
        </div>

        {dateText && <p className="date">{dateText}</p>}
      </div>
    </div>
  );
});

export default CardCanvas;
