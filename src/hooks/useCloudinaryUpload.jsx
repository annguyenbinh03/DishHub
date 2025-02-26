const useCloudinaryUpload = async (file) => {
  if (!file) {
    setError('No file selected.');
    return;
  }
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    });
    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    setError('Upload failed!');
  }
};

export default useCloudinaryUpload;
