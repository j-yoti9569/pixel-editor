import React, { useRef } from "react";

const colors = ["#ffc0cb","#ffecb3","#c8e6c9","#b3e5fc","#f8bbd0","#f3e5f5","#ffe0b2","#ffd7e9","#ffffff"];

export default function Toolbar({
  bg, setBg, filter, setFilter, textStyle, setTextStyle, dateText, setDateText, onUpload, resetAll
}) {

  const uploadRef = useRef();

  function handleFile(e){
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
  }

  return (
    <aside className="toolbar">
      <h3>Colors</h3>
      <div className="colors">
        {colors.map(c => (
          <button
            key={c}
            className="colorBtn"
            style={{background: c, border: c===bg ? "2px solid #000" : "1px solid #ccc"}}
            onClick={()=> setBg(c)}
          />
        ))}
      </div>

      <h3>Filters</h3>
      <select value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="none">None</option>
        <option value="grayscale(100%)">Grayscale</option>
        <option value="sepia(70%)">Sepia</option>
        <option value="contrast(150%)">High Contrast</option>
        <option value="blur(2px)">Blur</option>
      </select>

      <h3>Text Style</h3>
      <button onClick={()=> setTextStyle(s=>({...s, bold: !s.bold}))}><b>B</b></button>
      <button onClick={()=> setTextStyle(s=>({...s, italic: !s.italic}))}><i>I</i></button>
      <button onClick={()=> setTextStyle(s=>({...s, underline: !s.underline}))}><u>U</u></button>

      <h3>Date</h3>
      <input type="date" value={dateText} onChange={(e)=> setDateText(e.target.value)} />

      <h3>Upload</h3>
      <input type="file" accept="image/*" ref={uploadRef} onChange={handleFile} />

      <button className="reset" onClick={resetAll}>Reset</button>
    </aside>
  );
}
