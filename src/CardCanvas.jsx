import React, { forwardRef, useImperativeHandle, useState } from "react";

const CardCanvas = forwardRef(({ bg, filter, textStyle, dateText, uploaded }, ref) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const [size, setSize] = useState({ w: 600, h: 520 });

  useImperativeHandle(ref, () => ({
    reset() {
      setPos({ x: 0, y: 0 });
      setSize({ w: 600, h: 520 });
    }
  }));

  return (
    <div className="canvas-area">
      <div className="canvas">
        
        <div
          className="card"
          style={{
            width: size.w,
            height: size.h,
            background: bg,
            filter: filter,
            margin: "0 auto"
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
    </div>
  );
});

export default CardCanvas;
