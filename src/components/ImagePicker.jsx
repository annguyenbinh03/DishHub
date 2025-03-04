import { useState } from "react";
import { BsCloudUploadFill } from "react-icons/bs";

const ImagePicker = ({ setFile, exsitedUrl = null }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const limitFileSize = 5 * 1024 * 1024;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) {
      setPreviewUrl(null);
      setFile(null);
      return;
    }
    if(selectedFile.size > limitFileSize){
      toast.error('File ảnh không được lớn hơn 5Mb', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
        transition: Bounce
      });
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setFile(selectedFile); 
  };

  return (
    <div className="image-picker">
        <label htmlFor="image-input" > <BsCloudUploadFill/> Chọn ảnh</label>
        <input id="image-input" type="file" className="image-input" accept="image/png, image/jpeg" onChange={handleFileChange} />
        {previewUrl ? (
          <div className="mt-1">
            <img src={previewUrl} alt="Preview" width="100%" style={{maxWidth:'300px', maxHeight:'300px'}}/>
          </div>
        ) : (
          <div className="mt-1">
          <img src={exsitedUrl} alt="Preview" width="100%" style={{maxWidth:'300px', maxHeight:'300px'}}/>
        </div>
        )}
    </div>
  );
};

export default ImagePicker;