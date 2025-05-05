// OrderConfirmationModal.jsx - Order confirmation modal
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderConfirmationModal = ({ show, onHide }) => {
  const navigate = useNavigate();
  
  const handleContinueShopping = () => {
    onHide();
    navigate('/'); // Navigate back to home page
  };
  
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Order Placed!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <i className="fas fa-check-circle fa-5x text-success mb-4"></i>
        <h4>Thank you for your purchase!</h4>
        <p>Your order has been received and is being processed.</p>
        <p>Order confirmation #GTE2025-{Math.floor(1000 + Math.random() * 9000)}</p>
        <p>A confirmation email has been sent to your email address.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleContinueShopping}>Continue Shopping</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderConfirmationModal;