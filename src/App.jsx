import React, { useState, useRef } from "react";
import Toolbar from "./Toolbar";
import CardCanvas from "./CardCanvas";

export default function App() {
  const [bg, setBg] = useState("#ffc0cb");
  const [filter, setFilter] = useState("none");
  const [textStyle, setTextStyle] = useState({ bold: false, italic: false, underline: false });
  const [dateText, setDateText] = useState("");
  const [uploaded, setUploaded] = useState(null);

  // NEW — caption text state
  const [caption, setCaption] = useState("What's on your mind?");

  const cardRef = useRef();

  const resetAll = () => {
    setBg("#ffc0cb");
    setFilter("none");
    setTextStyle({ bold: false, italic: false, underline: false });
    setDateText("");
    setUploaded(null);
    setCaption("What's on your mind?");
    if (cardRef.current) cardRef.current.reset();
  };

  return (
    <div className="app">
      <div className="layout">

        <Toolbar
          bg={bg}
          setBg={setBg}
          filter={filter}
          setFilter={setFilter}
          textStyle={textStyle}
          setTextStyle={setTextStyle}
          dateText={dateText}
          setDateText={setDateText}
          onUpload={(fileUrl) => setUploaded(fileUrl)}
          resetAll={resetAll}
        />

        <CardCanvas
          ref={cardRef}
          bg={bg}
          filter={filter}
          textStyle={textStyle}
          dateText={dateText}
          uploaded={uploaded}
          caption={caption}          // send caption text
          setCaption={setCaption}    // send setter to update
        />

      </div>
    </div>
  );
}
