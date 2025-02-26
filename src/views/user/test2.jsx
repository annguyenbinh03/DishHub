import ImagePicker from 'components/ImagePicker';
import useCloudinaryUpload from 'hooks/useCloudinaryUpload';
import { useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Test2 = () => {
  const [file, setFile] = useState(null); //
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        toast.success(`Upload thành công! ${uploadedUrl}`, {
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
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
           tên: <input  type='text'/>
           Avatar <ImagePicker setFile={setFile} /></Modal.Body>
        <Modal.Footer>
        <button className="mt-5" onClick={handleSubmitForm} disabled={loading}>
        {loading ? 'Uploading...' : 'Submit Form'}
      </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Test2;
