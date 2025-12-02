import React, { useRef } from "react";

const colors = [
  "#ffc0cb", "#ffecb3", "#c8e6c9", "#b3e5fc",
  "#f8bbd0", "#f3e5f5", "#ffe0b2", "#ffd7e9", "#ffffff"
];

export default function Toolbar({
  bg, setBg, filter, setFilter,
  textStyle, setTextStyle, dateText, setDateText,
  onUpload, resetAll
}) {

  const uploadRef = useRef();

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
  }

  return (
    <aside className="toolbar">

      {/* Colors */}
      <div className="tool-section">
        <h3 className="section-title">Colors</h3>

        <div className="colors color-grid">
          {colors.map(c => (
            <button
              key={c}
              className="colorBtn"
              style={{
                background: c,
                border: c === bg ? "2px solid #000" : "1px solid #ccc"
              }}
              onClick={() => setBg(c)}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="tool-section">
        <h3>Filters</h3>
        <select
          className="inputBox"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="none">None</option>
          <option value="grayscale(100%)">Grayscale</option>
          <option value="sepia(70%)">Sepia</option>
          <option value="contrast(150%)">High Contrast</option>
          <option value="blur(2px)">Blur</option>
        </select>
      </div>

      {/* Text Style */}
      <div className="tool-section">
        <h3>Text Style</h3>
        <div className="text-buttons">
          <button onClick={() => setTextStyle(s => ({ ...s, bold: !s.bold }))}><b>B</b></button>
          <button onClick={() => setTextStyle(s => ({ ...s, italic: !s.italic }))}><i>I</i></button>
          <button onClick={() => setTextStyle(s => ({ ...s, underline: !s.underline }))}><u>U</u></button>
        </div>
      </div>

      {/* Date */}
      <div className="tool-section">
        <h3>Date</h3>
        <input
          className="inputBox"
          type="date"
          value={dateText}
          onChange={(e) => setDateText(e.target.value)}
        />
      </div>

      {/* Upload */}
      <div className="tool-section">
        <h3>Upload</h3>

        {/* Custom upload button */}
        <label className="uploadBtn" htmlFor="uploadInput">
          Upload Image
        </label>

        {/* Hidden real input */}
        <input
          id="uploadInput"
          type="file"
          accept="image/*"
          ref={uploadRef}
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>

      {/* Reset */}
      <div className="reset-wrap">
        <button className="reset" onClick={resetAll}>Reset</button>
      </div>

    </aside>
  );
}
