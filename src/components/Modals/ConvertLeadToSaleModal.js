import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Row,
  Col,
} from "reactstrap";

const ConvertLeadToSaleModal = ({ isOpen, toggle, lead, onConvert }) => {
  const [formData, setFormData] = useState({
    productType: "",
    price: "",
    notes: "",
    status: "converted",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.productType || !formData.price) {
      setError("Product type and price are required");
      setLoading(false);
      return;
    }

    try {
      await onConvert({
        leadId: lead.id,
        ...formData,
        price: parseFloat(formData.price),
      });
      toggle();
    } catch (err) {
      setError(err.message || "Failed to convert lead to sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Convert Lead to Sale</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {error && <div className="alert alert-danger">{error}</div>}

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="productType">Product Type *</Label>
                <Input
                  type="text"
                  name="productType"
                  id="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="price">Price *</Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input
                  type="textarea"
                  name="notes"
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="status">Status</Label>
                <Input
                  type="select"
                  name="status"
                  id="status"
                  value={formData.status}
                  style={{
                    width: "465px",
                    marginTop: "20px",
                    marginLeft: "-235px",
                    marginBottom: "20px",
                  }}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="converted">Converted</option>
                  <option value="cancelled">Cancelled</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <Button color="secondary" onClick={toggle} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Convert"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ConvertLeadToSaleModal;
