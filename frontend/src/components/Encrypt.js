// Encrypt.js

import React, { useState } from "react";
import axios from "axios";
import "./Encrypt.css";

function Encrypt() {
  const [image, setImage] = useState(null);
  const [encryptedImage, setEncryptedImage] = useState(null);

  function fileUploadHandler(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  // Updated fetch request with proxy

  async function encryptHandler(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", e.target.image.files[0]);

    try {
      const response = await fetch("/encrypt", {
        method: "POST",
        body: formData,
        headers: {
          // No need to specify 'Content-Type' header for FormData, fetch will do it automatically
        },
      });

      if (!response.ok) {
        throw new Error("Failed to encrypt image");
      }

      const data = await response.json();
      setEncryptedImage(data.encrypted_image);
    } catch (error) {
      console.error("Error encrypting image:", error);
    }
  }

  return (
    <div>
      <p>Encrypt</p>
      <form onSubmit={encryptHandler}>
        <input type="file" name="image" onChange={fileUploadHandler} />
        <button type="submit">Encrypt</button>
      </form>
      <div>{image && <img src={image} alt="Original Image" />}</div>
      <div>
        {encryptedImage && (
          <img
            src={`data:image/png;base64,${encryptedImage}`}
            alt="Encrypted Image"
          />
        )}
      </div>
    </div>
  );
}

export default Encrypt;
