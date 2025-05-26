import { useState } from "react";
import { Form, Input, Label, Button } from "reactstrap";

const SendReferral = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Label for="fullName">Client Full Name:</Label>
        <Input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="mb-3" // Added margin bottom
        />
      </div>

      <div className="mb-4">
        {" "}
        {/* Increased margin bottom */}
        <Label for="email">Client Email:</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="d-flex justify-content-end gap-3 mt-4">
        <Button color="secondary" type="button" onClick={onSubmit}>
          Close
        </Button>
        <Button color="primary" type="submit">
          Send
        </Button>
      </div>
    </Form>
  );
};

export default SendReferral;
