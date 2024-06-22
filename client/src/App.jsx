import { useState } from "react";
import "./App.css";
import axios from "axios";
import "./styles/styles.css";
import "./styles/image-box.css";

const URL = "http://127.0.0.1:8000/";

function App() {
  const [imgObj, setImgObj] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgRes, setImgRes] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    handleFileInput(file);
  };

  function handleFileInput(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImgSrc(dataUrl);
        setImgObj(file);
      };

      reader.readAsDataURL(file);
    }
  }

  function handleImageSubmit(file) {
    const newImage = new FormData();
    newImage.append("file", file);

    axios
      .post(`${URL}uploadimage/`, newImage, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: "image/png" });
        const reader = new FileReader();

        reader.onload = () => {
          setImgRes(reader.result);
        };

        reader.readAsDataURL(blob);
      });
  }

  return (
    <>
      <div className="main-box">
        <div className="info-box">
          <h1>Fourier Image Analysis</h1>
          <p>
            The Fourier Transform is an important image processing tool which is
            used to decompose an image into its sine and cosine components. The
            output of the transformation represents the image in the Fourier or
            frequency domain, while the input image is the spatial domain
            equivalent. In the Fourier domain image, each point represents a
            particular frequency contained in the spatial domain image.The
            Fourier Transform is used in a wide range of applications, such as
            image analysis, image filtering, image reconstruction and image
            compression.
          </p>
        </div>
        <div
          className="form-box"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="image-box">
            <label
              htmlFor="images"
              className="drop-container"
              id="dropcontainer"
            >
              <span className="drop-title">Drop Image here</span>
              or
              <input
                type="file"
                id="images"
                accept="image/*"
                required
                onChange={(e) => handleFileInput(e.target.files[0])}
              />
            </label>
          </div>
          <button onClick={() => handleImageSubmit(imgObj)}>
            Upload Image
          </button>
        </div>
        <div className="result-box">
          <div className="left">
            <h2>Uploaded Image</h2>
            {imgSrc ? (
              <img src={imgSrc} alt="Result" className="img-box" />
            ) : (
              <div className="img-box"></div>
            )}
          </div>
          <div className="right">
            <h2>Generated Image</h2>
            {imgRes ? (
              <img src={imgRes} alt="Result" className="img-box" />
            ) : (
              <div className="img-box"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
