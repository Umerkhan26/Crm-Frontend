// import React, { useState } from "react";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Row,
//   Col,
// } from "reactstrap";

// const AddLeadModal = ({ isOpen, toggle, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     agentName: "Default",
//     firstName: "Default",
//     lastName: "Default",
//     phoneNumber: "Default",
//     state: "Alaska",
//     date: "05/21/2024",
//   });

//   const states = [
//     "Alaska",
//     "Alabama",
//     "Arkansas",
//     "Arizona",
//     "California",
//     "Colorado",
//     "Connecticut",
//     "District of Columbia",
//     "Delaware",
//     "Florida",
//     "Georgia",
//     "Hawaii",
//     "Iowa",
//     "Idaho",
//     "Illinois",
//     "Indiana",
//     "Kansas",
//     "Kentucky",
//     "Louisiana",
//     "Massachusetts",
//     "Maryland",
//     "Maine",
//     "Michigan",
//     "Minnesota",
//     "Missouri",
//     "Mississippi",
//     "Montana",
//     "North Carolina",
//     "North Dakota",
//     "Nebraska",
//     "New Hampshire",
//     "New Jersey",
//     "New Mexico",
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//     toggle();
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} size="lg">
//       <ModalHeader toggle={toggle}>Lead Form</ModalHeader>
//       <Form onSubmit={handleSubmit}>
//         <ModalBody>
//           <Row>
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="agentName">Agent Name</Label>
//                 <Input
//                   type="text"
//                   name="agentName"
//                   id="agentName"
//                   value={formData.agentName}
//                   onChange={handleInputChange}
//                 />
//               </FormGroup>
//             </Col>
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="lastName">Last Name</Label>
//                 <Input
//                   type="text"
//                   name="lastName"
//                   id="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//           <Row>
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="firstName">First Name</Label>
//                 <Input
//                   type="text"
//                   name="firstName"
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                 />
//               </FormGroup>
//             </Col>
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="phoneNumber">Phone Number</Label>
//                 <Input
//                   type="text"
//                   name="phoneNumber"
//                   id="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//           <Row>
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="state">State *</Label>
//                 <Input
//                   type="select"
//                   name="state"
//                   id="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                 >
//                   {states.map((state) => (
//                     <option key={state} value={state}>
//                       {state}
//                     </option>
//                   ))}
//                 </Input>
//               </FormGroup>
//             </Col>
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="date">Date</Label>
//                 <Input
//                   type="date"
//                   name="date"
//                   id="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={toggle}>
//             Cancel
//           </Button>
//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </ModalFooter>
//       </Form>
//     </Modal>
//   );
// };

// export default AddLeadModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";

const AddLeadModal = ({ isOpen, toggle, onSubmit, template }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Generate empty form based on template object keys
    if (template && typeof template === "object") {
      const initialData = {};
      Object.keys(template).forEach((key) => {
        initialData[key] = "";
      });
      setFormData(initialData);
    }
  }, [template]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    toggle();
  };

  const renderInput = (key) => {
    const isDate = key.toLowerCase().includes("date");
    const isSelect = key.toLowerCase() === "state" && Array.isArray(states);

    return (
      <FormGroup key={key}>
        <Label for={key}>{key.replace(/_/g, " ").toUpperCase()}</Label>
        {isDate ? (
          <Input
            type="date"
            name={key}
            id={key}
            value={formData[key]}
            onChange={handleInputChange}
          />
        ) : isSelect ? (
          <Input
            type="select"
            name={key}
            id={key}
            value={formData[key]}
            onChange={handleInputChange}
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Input>
        ) : (
          <Input
            type="text"
            name={key}
            id={key}
            value={formData[key]}
            onChange={handleInputChange}
          />
        )}
      </FormGroup>
    );
  };

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Add Lead</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            {template &&
              Object.keys(template).map((key, idx) => (
                <Col md={6} key={idx}>
                  {renderInput(key)}
                </Col>
              ))}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddLeadModal;
