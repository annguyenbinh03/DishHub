import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';
import { useState } from 'react';
import { Bounce, toast } from 'react-toastify';

const Test2 = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitForm = async () => {
    setLoading(true);
    if (!file) {
      alert('file not found');
      setLoading(false);
      return;
    }
    try {
      const uploadedUrl = await useCloudinaryUpload(file);
      if (uploadedUrl) {
        toast.success('Upload thành công!', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
          transition: Bounce
        });
        /// check tiếp mấy trường khác, gọi api be,...
      } else {
        throw new Error('Upload thất bại!');
      }
    } catch (err) {
      toast.error(err.message || 'Lỗi khi upload ảnh!', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
        transition: Bounce
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <ImagePicker setFile={setFile} />
      </div>
      <button className="mt-5" onClick={handleSubmitForm} disabled={loading}>
        {loading ? 'Uploading...' : 'Submit Form'}
      </button>
    </>
  );
};

export default Test2;
