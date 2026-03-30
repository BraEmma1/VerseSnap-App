import React, { useRef } from 'react';

const ImageUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button className="btn upload-btn" onClick={() => fileInputRef.current.click()}>
        Upload Image
      </button>
    </div>
  );
};

export default ImageUpload;
