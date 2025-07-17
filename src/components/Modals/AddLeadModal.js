// import React, { useState, useEffect } from "react";
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
//   Alert,
// } from "reactstrap";
// import { createClientLead } from "../../services/ClientleadService";
// import { toast } from "react-toastify";
// import { US_STATES } from "../Constrant/constrant";
// import Select from "react-select";

// const AddLeadModal = ({ isOpen, toggle, onSubmit, selectedOrder }) => {
//   const [formData, setFormData] = useState({});
//   const [fields, setFields] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     if (selectedOrder && selectedOrder.campaign) {
//       try {
//         const parsedFields = JSON.parse(selectedOrder.campaign.fields);
//         setFields(parsedFields);
//         const initialData = {};
//         parsedFields.forEach((field) => {
//           initialData[field.col_slug] = "";
//         });
//         setFormData(initialData);
//       } catch (error) {
//         console.error("Error parsing campaign fields:", error);
//         setFields([]);
//       }
//     }
//   }, [selectedOrder]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     console.log("selectedOrder:", selectedOrder);

//     if (!selectedOrder || !selectedOrder.id || !selectedOrder.campaign_id) {
//       toast.error("Invalid order data. Please select a valid order.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const leadData = {
//         order_id: selectedOrder.id,
//         campaign: {
//           id: selectedOrder.campaign_id,
//         },
//         leadData: formData,
//       };

//       const response = await createClientLead(leadData);

//       toast.success("Lead created successfully!");
//       if (onSubmit) {
//         onSubmit(response.data);
//       }

//       setFormData({});

//       setTimeout(() => {
//         toggle();
//       }, 2000);
//     } catch (error) {
//       toast.error(error.message || "Failed to create lead");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderField = (field) => {
//     const inputStyle = {
//       marginBottom: "0.1rem",
//       padding: "0.2rem 0.5rem",
//       height: "35px",
//       fontSize: "0.875rem",
//     };
//     if (
//       field.col_slug === "state" ||
//       field.col_type?.toLowerCase() === "state"
//     ) {
//       const stateOptions = US_STATES.map((state) => ({
//         value: state,
//         label: state,
//       }));

//       return (
//         <Select
//           name={field.col_slug}
//           id={field.col_slug}
//           options={stateOptions}
//           value={
//             stateOptions.find(
//               (opt) => opt.value === formData[field.col_slug]
//             ) || null
//           }
//           onChange={(selectedOption) =>
//             handleInputChange({
//               target: {
//                 name: field.col_slug,
//                 value: selectedOption ? selectedOption.value : "",
//               },
//             })
//           }
//           isClearable
//           placeholder="Select a state"
//           styles={{
//             control: (base) => ({
//               ...base,
//               minHeight: "35px",
//               fontSize: "0.875rem",
//               marginBottom: "0.1rem",
//             }),
//           }}
//         />
//       );
//     }

//     const colType = field.col_type?.toLowerCase();

//     const normalizeOptions = (options) => {
//       if (!options || !Array.isArray(options)) return [];

//       return options.map((option, index) => {
//         if (typeof option === "string") {
//           return { value: option, label: option };
//         } else if (option && typeof option === "object") {
//           return {
//             value: option.value || option.id || option.key || String(index),
//             label:
//               option.label ||
//               option.name ||
//               option.title ||
//               option.value ||
//               String(option),
//           };
//         }
//         return { value: String(index), label: String(option) };
//       });
//     };

//     switch (colType) {
//       case "date":
//         return (
//           <Input
//             type="date"
//             name={field.col_slug}
//             id={field.col_slug}
//             value={formData[field.col_slug] || ""}
//             onChange={handleInputChange}
//             required={field.required}
//             style={inputStyle}
//           />
//         );
//       case "select":
//       case "dropdown":
//         const normalizedSelectOptions = normalizeOptions(field.options);
//         if (normalizedSelectOptions.length === 0) {
//           console.warn(
//             `Field ${field.col_slug} has invalid or missing options:`,
//             field.options
//           );
//           return (
//             <Input
//               type="text"
//               name={field.col_slug}
//               id={field.col_slug}
//               value={formData[field.col_slug] || ""}
//               onChange={handleInputChange}
//               required={field.required}
//               style={inputStyle}
//               placeholder="No options available"
//               disabled
//             />
//           );
//         }
//         return (
//           <Select
//             name={field.col_slug}
//             id={field.col_slug}
//             value={
//               formData[field.col_slug]
//                 ? normalizedSelectOptions.find(
//                     (opt) => opt.value === formData[field.col_slug]
//                   )
//                 : null
//             }
//             onChange={(selectedOption) =>
//               handleInputChange({
//                 target: {
//                   name: field.col_slug,
//                   value: selectedOption?.value || "",
//                 },
//               })
//             }
//             options={normalizedSelectOptions}
//             placeholder="Select an option"
//             isClearable
//             required={field.required}
//           />
//         );
//       case "radio":
//         const normalizedRadioOptions = normalizeOptions(field.options);
//         if (normalizedRadioOptions.length === 0) {
//           console.warn(
//             `Field ${field.col_slug} has invalid or missing options:`,
//             field.options
//           );
//           return (
//             <Input
//               type="text"
//               name={field.col_slug}
//               id={field.col_slug}
//               value={formData[field.col_slug] || ""}
//               onChange={handleInputChange}
//               required={field.required}
//               style={inputStyle}
//               placeholder="No options available"
//               disabled
//             />
//           );
//         }
//         return (
//           <div>
//             {normalizedRadioOptions.map((option, index) => (
//               <FormGroup check key={index}>
//                 <Input
//                   type="radio"
//                   name={field.col_slug}
//                   id={`${field.col_slug}_${index}`}
//                   value={option.value}
//                   checked={formData[field.col_slug] === option.value}
//                   onChange={handleInputChange}
//                   required={field.required && index === 0}
//                 />
//                 <Label for={`${field.col_slug}_${index}`} check>
//                   {option.label}
//                 </Label>
//               </FormGroup>
//             ))}
//           </div>
//         );
//       default:
//         return (
//           <Input
//             type="text"
//             name={field.col_slug}
//             id={field.col_slug}
//             value={formData[field.col_slug] || ""}
//             onChange={handleInputChange}
//             required={field.required}
//             style={inputStyle}
//           />
//         );
//     }
//   };
//   return (
//     <Modal
//       isOpen={isOpen}
//       toggle={toggle}
//       size="lg"
//       style={{
//         maxWidth: "800px", // Control width
//       }}
//       contentClassName="p-0"
//     >
//       <ModalHeader toggle={toggle} className="py-2 px-3">
//         Add Lead to {selectedOrder?.campaign?.campaign_name || "Order"}
//       </ModalHeader>
//       <Form onSubmit={handleSubmit}>
//         <ModalBody className="px-2 py-3">
//           {error && <Alert color="danger">{error}</Alert>}
//           {success && <Alert color="success">Lead created successfully!</Alert>}
//           <Row className="g-1 mx-0">
//             {fields.map((field, index) => (
//               <Col md={6} key={index} className="px-1">
//                 <FormGroup className="mb-1">
//                   <Label for={field.col_slug}>
//                     {field.col_name}
//                     {field.required && <span className="text-danger">*</span>}
//                   </Label>
//                   {renderField(field)}
//                 </FormGroup>
//               </Col>
//             ))}
//           </Row>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={toggle} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button color="primary" type="submit" disabled={isLoading}>
//             {isLoading ? "Submitting..." : "Submit"}
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
  Alert,
} from "reactstrap";
import { createClientLead } from "../../services/ClientleadService";
import { toast } from "react-toastify";
import { US_STATES } from "../Constrant/constrant";
import Select from "react-select";

const AddLeadModal = ({ isOpen, toggle, onSubmit, selectedOrder }) => {
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedOrder && selectedOrder.campaign) {
      try {
        const parsedFields = JSON.parse(selectedOrder.campaign.fields);
        setFields(parsedFields);
        const initialData = {};
        parsedFields.forEach((field) => {
          initialData[field.col_slug] = "";
        });
        setFormData(initialData);
      } catch (error) {
        console.error("Error parsing campaign fields:", error);
        setFields([]);
      }
    }
  }, [selectedOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("selectedOrder:", selectedOrder);

    if (!selectedOrder || !selectedOrder.id || !selectedOrder.campaign_id) {
      toast.error("Invalid order data. Please select a valid order.");
      setIsLoading(false);
      return;
    }

    try {
      const leadData = {
        order_id: selectedOrder.id,
        campaign: {
          id: selectedOrder.campaign_id,
        },
        leadData: formData,
      };

      const response = await createClientLead(leadData);

      toast.success("Lead created successfully!");
      if (onSubmit) {
        onSubmit(response.data);
      }

      setFormData({});

      setTimeout(() => {
        toggle();
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to create lead");
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field) => {
    const inputStyle = {
      marginBottom: "0.05rem",
      padding: "0.1rem 0.3rem",
      height: "33px",
      fontSize: "0.75rem",
      minHeight: "33px",
    };
    if (
      field.col_slug === "state" ||
      field.col_type?.toLowerCase() === "state"
    ) {
      const stateOptions = US_STATES.map((state) => ({
        value: state,
        label: state,
      }));

      return (
        <Select
          name={field.col_slug}
          id={field.col_slug}
          options={stateOptions}
          value={
            stateOptions.find(
              (opt) => opt.value === formData[field.col_slug]
            ) || null
          }
          onChange={(selectedOption) =>
            handleInputChange({
              target: {
                name: field.col_slug,
                value: selectedOption ? selectedOption.value : "",
              },
            })
          }
          isClearable
          placeholder="Select a state"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "33px",
              height: "33px",
              fontSize: "0.75rem",
              marginBottom: "0.05rem",
              padding: "0",
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0.1rem 0.3rem",
              height: "28px",
            }),
            menu: (base) => ({
              ...base,
              fontSize: "0.75rem",
            }),
            placeholder: (base) => ({
              ...base,
              fontSize: "0.75rem",
            }),
          }}
        />
      );
    }

    const colType = field.col_type?.toLowerCase();

    const normalizeOptions = (options) => {
      if (!options || !Array.isArray(options)) return [];

      return options.map((option, index) => {
        if (typeof option === "string") {
          return { value: option, label: option };
        } else if (option && typeof option === "object") {
          return {
            value: option.value || option.id || option.key || String(index),
            label:
              option.label ||
              option.name ||
              option.title ||
              option.value ||
              String(option),
          };
        }
        return { value: String(index), label: String(option) };
      });
    };

    switch (colType) {
      case "date":
        return (
          <Input
            type="date"
            name={field.col_slug}
            id={field.col_slug}
            value={formData[field.col_slug] || ""}
            onChange={handleInputChange}
            required={field.required}
            style={inputStyle}
          />
        );
      case "select":
      case "dropdown":
        const normalizedSelectOptions = normalizeOptions(field.options);
        if (normalizedSelectOptions.length === 0) {
          console.warn(
            `Field ${field.col_slug} has invalid or missing options:`,
            field.options
          );
          return (
            <Input
              type="text"
              name={field.col_slug}
              id={field.col_slug}
              value={formData[field.col_slug] || ""}
              onChange={handleInputChange}
              required={field.required}
              style={inputStyle}
              placeholder="No options available"
              disabled
            />
          );
        }
        return (
          <Select
            name={field.col_slug}
            id={field.col_slug}
            value={
              formData[field.col_slug]
                ? normalizedSelectOptions.find(
                    (opt) => opt.value === formData[field.col_slug]
                  )
                : null
            }
            onChange={(selectedOption) =>
              handleInputChange({
                target: {
                  name: field.col_slug,
                  value: selectedOption?.value || "",
                },
              })
            }
            options={normalizedSelectOptions}
            placeholder="Select an option"
            isClearable
            required={field.required}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "33px",
                height: "33px",
                fontSize: "0.75rem",
                marginBottom: "0.05rem",
                padding: "0",
              }),
              menu: (base) => ({
                ...base,
                fontSize: "0.75rem",
              }),
            }}
          />
        );
      case "radio":
        const normalizedRadioOptions = normalizeOptions(field.options);
        if (normalizedRadioOptions.length === 0) {
          console.warn(
            `Field ${field.col_slug} has invalid or missing options:`,
            field.options
          );
          return (
            <Input
              type="text"
              name={field.col_slug}
              id={field.col_slug}
              value={formData[field.col_slug] || ""}
              onChange={handleInputChange}
              required={field.required}
              style={inputStyle}
              placeholder="No options available"
              disabled
            ></Input>
          );
        }
        return (
          <div style={{ marginBottom: "0.05rem" }}>
            {normalizedRadioOptions.map((option, index) => (
              <FormGroup check key={index}>
                <Input
                  type="radio"
                  name={field.col_slug}
                  id={`${field.col_slug}_${index}`}
                  value={option.value}
                  checked={formData[field.col_slug] === option.value}
                  onChange={handleInputChange}
                  required={field.required && index === 0}
                />
                <Label
                  for={`${field.col_slug}_${index}`}
                  check
                  style={{ fontSize: "0.75rem" }}
                >
                  {option.label}
                </Label>
              </FormGroup>
            ))}
          </div>
        );
      default:
        return (
          <Input
            type="text"
            name={field.col_slug}
            id={field.col_slug}
            value={formData[field.col_slug] || ""}
            onChange={handleInputChange}
            required={field.required}
            style={inputStyle}
          />
        );
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="md"
      style={{
        maxWidth: "700px",
      }}
      contentClassName="p-0"
    >
      <ModalHeader
        toggle={toggle}
        className="py-1 px-2"
        style={{ fontSize: "0.95rem" }}
      >
        Add Lead to {selectedOrder?.campaign?.campaign_name || "Order"}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="px-1 py-1">
          {error && (
            <Alert
              color="error"
              style={{ fontSize: "0.75rem", padding: "0.2rem" }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              color="success"
              style={{ fontSize: "0.75rem", padding: "0.2rem" }}
            >
              Lead created successfully!
            </Alert>
          )}
          <Row className="g-0 mx-0">
            {fields.map((field, index) => (
              <Col md={6} key={index} className="px-1">
                <FormGroup className="mb-0.05">
                  <Label for={field.col_slug} style={{ fontSize: "0.75rem" }}>
                    {field.col_name}
                    {field.required && <span className="text-danger">*</span>}
                  </Label>
                  {renderField(field)}
                </FormGroup>
              </Col>
            ))}
          </Row>
        </ModalBody>
        <ModalFooter style={{ padding: "0.3rem" }}>
          <Button
            color="secondary"
            onClick={toggle}
            disabled={isLoading}
            style={{ fontSize: "1rem", padding: "0.3rem 0.6rem" }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={isLoading}
            style={{ fontSize: "1rem", padding: "0.3rem 0.6rem" }}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddLeadModal;
