import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";

const CardCanvas = forwardRef(({ bg, filter, textStyle, dateText, uploaded }, ref) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 600, h: 520 });

  const hiddenCanvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      setPos({ x: 0, y: 0 });
      setSize({ w: 600, h: 520 });
    }
  }));

  // draw to hidden canvas whenever inputs change
  useEffect(() => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;

    // set canvas pixel size
    canvas.width = size.w;
    canvas.height = size.h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // apply filter (ctx.filter accepts same syntax as CSS filter in modern browsers)
    ctx.filter = filter || "none";

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw background
    ctx.fillStyle = bg || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw uploaded image if present
    if (uploaded) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // to avoid tainting if possible
      img.src = uploaded;

      img.onload = () => {
        // draw image fitting the card area while preserving aspect ratio (cover-like)
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        // calculate scale to cover
        const scale = Math.max(cw / iw, ch / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const dx = (cw - nw) / 2;
        const dy = (ch - nh) / 2;

        ctx.drawImage(img, dx, dy, nw, nh);

        // after image drawn, draw text overlays
        drawTextAndDate(ctx, canvas.width, canvas.height);
      };

      img.onerror = () => {
        // if image fails, still draw text
        drawTextAndDate(ctx, canvas.width, canvas.height);
      };
    } else {
      // no image — draw text directly
      drawTextAndDate(ctx, canvas.width, canvas.height);
    }

    // helper to draw text and date
    function drawTextAndDate(ctx, cw, ch) {
      // reset filter for text so text isn't affected if you don't want — 
      // but we keep same filter so WYSIWYG; if you want text unaffected set ctx.filter = 'none'
      // ctx.filter = filter || "none";

      // Text style
      const fontSize = Math.round(Math.min(cw, ch) * 0.06); // responsive font size
      const fontParts = [];
      if (textStyle.italic) fontParts.push("italic");
      if (textStyle.bold) fontParts.push("bold");
      fontParts.push(`${fontSize}px sans-serif`);
      ctx.font = fontParts.join(" ");

      // text color (use contrast depending on bg; here we choose black for light backgrounds and white for dark)
      // simple luminance check
      const bgColor = bg || "#ffffff";
      const rgb = hexToRgb(bgColor);
      const luminance = rgb ? (0.299*rgb.r + 0.587*rgb.g + 0.114*rgb.b) : 255;
      ctx.fillStyle = luminance > 180 ? "#111" : "#fff";

      // draw main editable text at top-right-ish like your design (adjust coordinates as needed)
      const text = "What's on your mind?";
      // position: place near top-right corner with some padding
      const padding = Math.round(cw * 0.04);
      // to mimic your UI (vertical text on right), let's draw rotated vertical text if you prefer,
      // but simpler: draw horizontally near top-left. Adjust as per your CSS.
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillText(text, padding, padding);

      // Date: bottom-right
      if (dateText) {
        const dateFontSize = Math.round(fontSize * 0.6);
        const dateFont = `${dateFontSize}px sans-serif`;
        ctx.font = dateFont;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(dateText, cw - padding, ch - padding);
      }
    }

    // helper to convert hex to rgb
    function hexToRgb(hex) {
      if (!hex) return null;
      // remove # if present
      let h = hex.replace("#", "");
      if (h.length === 3) {
        h = h.split("").map(c => c + c).join("");
      }
      if (h.length !== 6) return null;
      const r = parseInt(h.slice(0,2), 16);
      const g = parseInt(h.slice(2,4), 16);
      const b = parseInt(h.slice(4,6), 16);
      return { r, g, b };
    }
  }, [bg, filter, uploaded, textStyle, dateText, size]);

  return (
    <div className="canvas-area">
      <div className="canvas">
        {/* Visible card preview (keeps your existing layout & styles) */}
        <div
          className="card"
          style={{
            width: size.w,
            height: size.h,
            background: bg,
            filter: filter,
            margin: "0 auto",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {uploaded && (
            <img src={uploaded} className="card-img" alt="preview" style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0
            }} />
          )}

          <div
            className="card-text"
            contentEditable
            suppressContentEditableWarning
            style={{
              position: "relative",
              zIndex: 2,
              padding: 16,
              fontWeight: textStyle.bold ? "bold" : "normal",
              fontStyle: textStyle.italic ? "italic" : "normal",
              textDecoration: textStyle.underline ? "underline" : "none",
              color: (() => {
                const rgb = (() => {
                  const h = (bg || "#ffffff").replace("#", "");
                  const hex = h.length === 3 ? h.split("").map(c => c+c).join("") : h;
                  const r = parseInt(hex.slice(0,2), 16);
                  const g = parseInt(hex.slice(2,4), 16);
                  const b = parseInt(hex.slice(4,6), 16);
                  return { r, g, b };
                })();
                const lum = (0.299*rgb.r + 0.587*rgb.g + 0.114*rgb.b);
                return lum > 180 ? "#111" : "#fff";
              })()
            }}
          >
            What's on your mind?
          </div>

          {dateText && (
            <p className="date" style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              margin: 0,
              zIndex: 2
            }}>{dateText}</p>
          )}
        </div>

        {/* Hidden canvas used for export/download */}
        <canvas
          id="cardCanvas"
          ref={hiddenCanvasRef}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
});

export default CardCanvas;
