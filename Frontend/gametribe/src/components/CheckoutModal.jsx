// CheckoutModal.jsx - Checkout modal component
import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const CheckoutModal = ({ show, onHide, onPlaceOrder, cartItems, totals }) => {
  const [validated, setValidated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      onPlaceOrder();
    }
    
    setValidated(true);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <h5>Shipping Information</h5>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" required />
                <Form.Control.Feedback type="invalid">
                  Please provide your full name.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" required />
                <Form.Control.Feedback type="invalid">
                  Please provide your address.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" required />
                    <Form.Control.Feedback type="invalid">
                      Please provide your city.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" required />
                    <Form.Control.Feedback type="invalid">
                      Please provide your state.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="zip">
                    <Form.Label>ZIP</Form.Label>
                    <Form.Control type="text" required />
                    <Form.Control.Feedback type="invalid">
                      Please provide your ZIP code.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <h5>Payment Method</h5>
              <div className="card mb-3">
                <div className="card-body">
                  <Form.Check
                    type="radio"
                    id="creditCard"
                    label="Credit Card"
                    name="paymentMethod"
                    checked={paymentMethod === 'creditCard'}
                    onChange={() => setPaymentMethod('creditCard')}
                    className="mb-2"
                  />
                  
                  {paymentMethod === 'creditCard' && (
                    <div id="creditCardForm">
                      <Form.Group className="mb-3" controlId="cardNumber">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="XXXX XXXX XXXX XXXX" 
                          required={paymentMethod === 'creditCard'} 
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid card number.
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="expDate">
                            <Form.Label>Expiration Date</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="MM/YY" 
                              required={paymentMethod === 'creditCard'} 
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide an expiration date.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="cvv">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="XXX" 
                              required={paymentMethod === 'creditCard'} 
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a CVV.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <Form.Check
                    type="radio"
                    id="paypal"
                    label="PayPal"
                    name="paymentMethod"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cartItems.length})</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Place Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;