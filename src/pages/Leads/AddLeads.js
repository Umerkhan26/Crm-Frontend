// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardBody,
//   Container,
//   FormGroup,
//   Input,
//   Label,
//   Button,
//   Row,
//   Col,
//   Form,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import Select from "react-select";
// import { useLocation, useNavigate } from "react-router-dom";
// import { fetchCampaigns } from "../../services/orderService";
// import { createLead, updateLead } from "../../services/leadService";
// import { toast } from "react-toastify";
// import { getCampaignFields } from "../../services/campaignService";

// const US_STATES = [
//   "Alabama",
//   "Alaska",
//   "Arizona",
//   "Arkansas",
//   "California",
//   "Colorado",
//   "Connecticut",
//   "Delaware",
//   "Florida",
//   "Georgia",
//   "Hawaii",
//   "Idaho",
//   "Illinois",
//   "Indiana",
//   "Iowa",
//   "Kansas",
//   "Kentucky",
//   "Louisiana",
//   "Maine",
//   "Maryland",
//   "Massachusetts",
//   "Michigan",
//   "Minnesota",
//   "Mississippi",
//   "Missouri",
//   "Montana",
//   "Nebraska",
//   "Nevada",
//   "New Hampshire",
//   "New Jersey",
//   "New Mexico",
//   "New York",
//   "North Carolina",
//   "North Dakota",
//   "Ohio",
//   "Oklahoma",
//   "Oregon",
//   "Pennsylvania",
//   "Rhode Island",
//   "South Carolina",
//   "South Dakota",
//   "Tennessee",
//   "Texas",
//   "Utah",
//   "Vermont",
//   "Virginia",
//   "Washington",
//   "West Virginia",
//   "Wisconsin",
//   "Wyoming",
// ];

// const AddLeads = () => {
//   const location = useLocation();
//   const editData = location.state?.editData;
//   const [formData, setFormData] = useState({});
//   const [campaignOptions, setCampaignOptions] = useState([]);
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [campaignFields, setCampaignFields] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [modal, setModal] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Leads", link: "/AllLeads" },
//     { title: editData ? "Edit Lead" : "Add Leads", link: "#" },
//   ];

//   const initializeForm = (fields) => {
//     const initialFormData = {};
//     fields.forEach((field) => {
//       if (field.col_type === "checkbox") {
//         initialFormData[field.col_slug] = false;
//       } else if (field.col_type === "dropdown" && field.options?.length) {
//         initialFormData[field.col_slug] = field.options[0];
//       } else {
//         initialFormData[field.col_slug] = field.default_value || "";
//       }
//     });
//     return initialFormData;
//   };

//   const normalizeFieldName = (name) => {
//     if (!name) return "";
//     return name.toString().toLowerCase().replace(/_/g, "").replace(/\s/g, "");
//   };

//   useEffect(() => {
//     const loadCampaigns = async () => {
//       try {
//         setIsLoading(true);
//         const campaigns = await fetchCampaigns();
//         setCampaignOptions(campaigns);

//         if (editData) {
//           const campaignMatch = campaigns.find(
//             (c) =>
//               c.label === editData.campaignType ||
//               c.value === editData.campaignType
//           );

//           if (!campaignMatch) {
//             throw new Error(`Campaign not found: ${editData.campaignType}`);
//           }

//           const response = await getCampaignFields(campaignMatch.value);
//           const fields = JSON.parse(response[0].fields);
//           setCampaignFields(fields);

//           const fieldNameMap = {};
//           fields.forEach((field) => {
//             fieldNameMap[normalizeFieldName(field.col_slug)] = field.col_slug;
//             fieldNameMap[normalizeFieldName(field.col_name)] = field.col_slug;
//           });

//           const initialFormData = {};
//           fields.forEach((field) => {
//             let value = editData.fullLeadData?.[field.col_slug];

//             if (value === undefined) {
//               value = editData[field.col_slug];
//             }

//             if (value === undefined) {
//               const normalizedFieldName = normalizeFieldName(field.col_slug);
//               for (const [key, val] of Object.entries(
//                 editData.fullLeadData || {}
//               )) {
//                 if (normalizeFieldName(key) === normalizedFieldName) {
//                   value = val;
//                   break;
//                 }
//               }
//               if (value === undefined) {
//                 for (const [key, val] of Object.entries(editData)) {
//                   if (normalizeFieldName(key) === normalizedFieldName) {
//                     value = val;
//                     break;
//                   }
//                 }
//               }
//             }

//             initialFormData[field.col_slug] =
//               value !== undefined ? value : field.default_value || "";
//           });

//           setFormData(initialFormData);
//           setSelectedCampaign(campaignMatch);
//           setShowForm(true);
//         }
//       } catch (error) {
//         toast.error(error.message || "Failed to load campaign data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCampaigns();
//   }, [editData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCampaignChange = async (selectedOption) => {
//     try {
//       setIsLoading(true);
//       setSelectedCampaign(selectedOption);

//       if (selectedOption) {
//         const response = await getCampaignFields(selectedOption.value);
//         const fields = JSON.parse(response[0].fields);
//         setCampaignFields(fields);

//         if (editData) {
//           const initialFormData = {};
//           fields.forEach((field) => {
//             let value;

//             if (editData[field.col_slug] !== undefined) {
//               value = editData[field.col_slug];
//             } else {
//               const normalizedFieldName = normalizeFieldName(field.col_slug);
//               for (const [key, val] of Object.entries(editData)) {
//                 if (normalizeFieldName(key) === normalizedFieldName) {
//                   value = val;
//                   break;
//                 }
//               }
//             }

//             initialFormData[field.col_slug] =
//               value !== undefined ? value : field.default_value || "";
//           });
//           setFormData(initialFormData);
//         } else {
//           setFormData(initializeForm(fields));
//         }

//         setShowForm(true);
//       } else {
//         setShowForm(false);
//       }
//     } catch (error) {
//       toast.error("Failed to load campaign fields");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleModal = () => setModal(!modal);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const payload = {
//         campaignName: selectedCampaign.label,
//         leadData: formData,
//       };

//       if (editData) {
//         const response = await updateLead(editData.id, payload);
//         toast.success(response.message || "Lead updated successfully!");
//       } else {
//         const response = await createLead(payload);
//         toast.success(response.message || "Lead created successfully!");
//         setFormData(initializeForm(campaignFields));
//       }

//       navigate("/master-lead-index");
//     } catch (error) {
//       toast.error(error.message || "Error submitting form");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderStateField = (field) => (
//     <Input
//       type="select"
//       name={field.col_slug}
//       value={formData[field.col_slug] || ""}
//       onChange={handleChange}
//     >
//       <option value="">Select a state</option>
//       {US_STATES.map((state) => (
//         <option key={state} value={state}>
//           {state}
//         </option>
//       ))}
//     </Input>
//   );

//   const renderField = (field) => {
//     if (!field) return null;

//     if (field?.col_slug?.toLowerCase?.() === "state") {
//       return renderStateField(field);
//     }

//     const commonProps = {
//       key: field.id,
//       name: field.col_slug,
//       value: formData[field.col_slug] || "",
//       onChange: handleChange,
//       required: true,
//     };

//     switch (field.col_type) {
//       case "text":
//       case "number":
//       case "date":
//         return (
//           <Input
//             type={
//               field.col_type === "date"
//                 ? "date"
//                 : field.col_type === "number"
//                 ? "number"
//                 : "text"
//             }
//             {...commonProps}
//             placeholder={field.default_value || ""}
//           />
//         );
//       case "dropdown":
//       case "radio":
//         return (
//           <Input type="select" {...commonProps}>
//             <option value="">Select an option</option>
//             {field.options?.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </Input>
//         );
//       case "checkbox":
//         return (
//           <Input
//             type="checkbox"
//             checked={formData[field.col_slug] || false}
//             onChange={(e) =>
//               handleChange({
//                 target: {
//                   name: field.col_slug,
//                   value: e.target.checked,
//                 },
//               })
//             }
//           />
//         );
//       default:
//         return <Input type="text" {...commonProps} />;
//     }
//   };

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs
//           title={editData ? "EDIT LEAD" : "ADD LEADS"}
//           breadcrumbItems={breadcrumbItems}
//         />
//         <Card>
//           <CardBody>
//             <FormGroup className="mb-4" style={{ width: "50%" }}>
//               <Label for="campaignType">Campaign Type</Label>
//               <Select
//                 id="campaignType"
//                 name="campaignType"
//                 options={campaignOptions}
//                 value={selectedCampaign}
//                 onChange={handleCampaignChange}
//                 isSearchable
//                 placeholder={
//                   isLoading ? "Loading campaigns..." : "Select a campaign"
//                 }
//                 isLoading={isLoading}
//                 isDisabled={isLoading || !!editData}
//               />
//             </FormGroup>

//             <Modal isOpen={modal} toggle={toggleModal}>
//               <ModalHeader toggle={toggleModal}>Add Bulk Lead</ModalHeader>
//               <ModalBody>
//                 <FormGroup>
//                   <Label>Upload File</Label>
//                   <div className="custom-file">
//                     <Input
//                       type="file"
//                       className="custom-file-input"
//                       id="customFile"
//                       onChange={handleFileChange}
//                     />
//                   </div>
//                 </FormGroup>
//               </ModalBody>
//               <ModalFooter>
//                 <Button
//                   color="primary"
//                   style={{ width: "100px" }}
//                   onClick={() => {
//                     if (selectedFile) {
//                       alert("File uploaded successfully!");
//                       toggleModal();
//                     } else {
//                       alert("Please select a file first");
//                     }
//                   }}
//                 >
//                   Upload
//                 </Button>
//               </ModalFooter>
//             </Modal>

//             {showForm && (
//               <Form onSubmit={handleSubmit} className="mt-4">
//                 {!editData && (
//                   <Button
//                     color="primary"
//                     className="mb-4"
//                     onClick={toggleModal}
//                   >
//                     Import Leads
//                   </Button>
//                 )}

//                 <Row>
//                   {campaignFields.map((field) => (
//                     <Col md={6} key={field.id}>
//                       <FormGroup>
//                         <Label>{field.col_name}</Label>
//                         {renderField(field)}
//                       </FormGroup>
//                     </Col>
//                   ))}
//                 </Row>

//                 <Button
//                   style={{ width: "100px" }}
//                   color="primary"
//                   className="mt-3"
//                   disabled={isSubmitting || isLoading}
//                 >
//                   {isSubmitting
//                     ? "Submitting..."
//                     : editData
//                     ? "Update"
//                     : "Submit"}
//                 </Button>
//               </Form>
//             )}
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default AddLeads;

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Col,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCampaigns } from "../../services/orderService";
import { createLead, updateLead } from "../../services/leadService";
import { toast } from "react-toastify";
import { getCampaignFields } from "../../services/campaignService";
import { updateClientLead } from "../../services/ClientleadService";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const AddLeads = () => {
  const location = useLocation();
  const editData = location.state?.editData;
  const isClientLead = editData?.isClientLead || false;
  const [formData, setFormData] = useState({});
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignFields, setCampaignFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/AllLeads" },
    {
      title: editData
        ? isClientLead
          ? "Edit Client Lead"
          : "Edit Lead"
        : isClientLead
        ? "Add Client Lead"
        : "Add Leads",
      link: "#",
    },
  ];

  const initializeForm = (fields) => {
    const initialFormData = {};
    fields.forEach((field) => {
      if (field.col_type === "checkbox") {
        initialFormData[field.col_slug] = false;
      } else if (field.col_type === "dropdown" && field.options?.length) {
        initialFormData[field.col_slug] = field.options[0];
      } else {
        initialFormData[field.col_slug] = field.default_value || "";
      }
    });
    return initialFormData;
  };

  const normalizeFieldName = (name) => {
    if (!name) return "";
    return name.toString().toLowerCase().replace(/_/g, "").replace(/\s/g, "");
  };

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const campaigns = await fetchCampaigns();
        setCampaignOptions(campaigns);

        if (editData) {
          const campaignMatch = campaigns.find(
            (c) =>
              c.label === editData.campaignType ||
              c.value === editData.campaignType ||
              c.value === editData.campaign_id
          );

          if (!campaignMatch) {
            throw new Error(
              `Campaign not found: ${
                editData.campaignType || editData.campaign_id
              }`
            );
          }

          const response = await getCampaignFields(campaignMatch.value);
          const fields = JSON.parse(response[0].fields);
          setCampaignFields(fields);
          console.log("Campaign Fields:", fields);

          const fieldNameMap = {};
          fields.forEach((field) => {
            fieldNameMap[normalizeFieldName(field.col_slug)] = field.col_slug;
            fieldNameMap[normalizeFieldName(field.col_name)] = field.col_slug;
          });

          const initialFormData = {};
          fields.forEach((field) => {
            let value = isClientLead
              ? editData.leadData?.[field.col_slug]
              : editData.fullLeadData?.[field.col_slug];

            if (value === undefined) {
              value = editData[field.col_slug];
            }

            if (value === undefined) {
              const normalizedFieldName = normalizeFieldName(field.col_slug);
              const dataSource = isClientLead
                ? editData.leadData || {}
                : editData.fullLeadData || {};
              for (const [key, val] of Object.entries(dataSource)) {
                if (normalizeFieldName(key) === normalizedFieldName) {
                  value = val;
                  break;
                }
              }
              if (value === undefined) {
                for (const [key, val] of Object.entries(editData)) {
                  if (normalizeFieldName(key) === normalizedFieldName) {
                    value = val;
                    break;
                  }
                }
              }
            }

            initialFormData[field.col_slug] =
              value !== undefined ? value : field.default_value || "";
          });

          setFormData(initialFormData);
          setSelectedCampaign(campaignMatch);
          setShowForm(true);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [editData, isClientLead]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCampaignChange = async (selectedOption) => {
    try {
      setIsLoading(true);
      setSelectedCampaign(selectedOption);

      if (selectedOption) {
        const response = await getCampaignFields(selectedOption.value);
        const fields = JSON.parse(response[0].fields);
        setCampaignFields(fields);

        if (editData) {
          const initialFormData = {};
          fields.forEach((field) => {
            let value;

            if (editData[field.col_slug] !== undefined) {
              value = editData[field.col_slug];
            } else {
              const normalizedFieldName = normalizeFieldName(field.col_slug);
              for (const [key, val] of Object.entries(
                isClientLead
                  ? editData.leadData || {}
                  : editData.fullLeadData || {}
              )) {
                if (normalizeFieldName(key) === normalizedFieldName) {
                  value = val;
                  break;
                }
              }
              if (value === undefined) {
                for (const [key, val] of Object.entries(editData)) {
                  if (normalizeFieldName(key) === normalizedFieldName) {
                    value = val;
                    break;
                  }
                }
              }
            }

            initialFormData[field.col_slug] =
              value !== undefined ? value : field.default_value || "";
          });
          setFormData(initialFormData);
        } else {
          setFormData(initializeForm(fields));
        }

        setShowForm(true);
      } else {
        setShowForm(false);
      }
    } catch (error) {
      toast.error("Failed to load campaign fields");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isClientLead) {
        const payload = {
          campaign_id: selectedCampaign.value,
          leadData: formData,
          order_id: editData.orderId || null,
        };
        if (editData) {
          const response = await updateClientLead(editData.id, payload);
          toast.success(
            response.message || "Client lead updated successfully!"
          );
        } else {
          toast.error("Create client lead API not implemented yet");
        }
        navigate(
          `/lead-index${editData.orderId ? `?orderId=${editData.orderId}` : ""}`
        );
      } else {
        const payload = {
          campaignName: selectedCampaign.label,
          leadData: formData,
        };
        if (editData) {
          const response = await updateLead(editData.id, payload);
          toast.success(response.message || "Lead updated successfully!");
        } else {
          const response = await createLead(payload);
          toast.success(response.message || "Lead created successfully!");
          setFormData(initializeForm(campaignFields));
        }
        navigate("/master-lead-index");
      }
    } catch (error) {
      toast.error(error.message || "Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStateField = (field) => (
    <Input
      type="select"
      name={field.col_slug}
      value={formData[field.col_slug] || ""}
      onChange={handleChange}
    >
      <option value="">Select a state</option>
      {US_STATES.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </Input>
  );

  const renderField = (field) => {
    if (!field) return null;

    if (field?.col_slug?.toLowerCase?.() === "state") {
      return renderStateField(field);
    }

    const commonProps = {
      key: field.id,
      name: field.col_slug,
      value: formData[field.col_slug] || "",
      onChange: handleChange,
      required: true,
    };

    switch (field.col_type) {
      case "text":
      case "number":
      case "date":
        return (
          <Input
            type={
              field.col_type === "date"
                ? "date"
                : field.col_type === "number"
                ? "number"
                : "text"
            }
            {...commonProps}
            placeholder={field.default_value || ""}
          />
        );
      case "dropdown":
      case "radio":
        return (
          <Input type="select" {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Input>
        );
      case "checkbox":
        return (
          <Input
            type="checkbox"
            checked={formData[field.col_slug] || false}
            onChange={(e) =>
              handleChange({
                target: {
                  name: field.col_slug,
                  value: e.target.checked,
                },
              })
            }
          />
        );
      default:
        return <Input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={
            editData
              ? isClientLead
                ? "EDIT CLIENT LEAD"
                : "EDIT LEAD"
              : isClientLead
              ? "ADD CLIENT LEAD"
              : "ADD LEADS"
          }
          breadcrumbItems={breadcrumbItems}
        />
        <Card>
          <CardBody>
            <FormGroup className="mb-4" style={{ width: "50%" }}>
              <Label for="campaignType">Campaign Type</Label>
              <Select
                id="campaignType"
                name="campaignType"
                options={campaignOptions}
                value={selectedCampaign}
                onChange={handleCampaignChange}
                isSearchable
                placeholder={
                  isLoading ? "Loading campaigns..." : "Select a campaign"
                }
                isLoading={isLoading}
                isDisabled={isLoading || !!editData}
              />
            </FormGroup>

            <Modal isOpen={modal} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>
                {isClientLead ? "Add Bulk Client Lead" : "Add Bulk Lead"}
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label>Upload File</Label>
                  <div className="custom-file">
                    <Input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      onChange={handleFileChange}
                    />
                  </div>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  style={{ width: "100px" }}
                  onClick={() => {
                    if (selectedFile) {
                      alert("File uploaded successfully!");
                      toggleModal();
                    } else {
                      alert("Please select a file first");
                    }
                  }}
                >
                  Upload
                </Button>
              </ModalFooter>
            </Modal>

            {showForm && (
              <Form onSubmit={handleSubmit} className="mt-4">
                {!editData && (
                  <Button
                    color="primary"
                    className="mb-4"
                    onClick={toggleModal}
                  >
                    {isClientLead ? "Import Client Leads" : "Import Leads"}
                  </Button>
                )}

                <Row>
                  {campaignFields.map((field) => (
                    <Col md={6} key={field.id}>
                      <FormGroup>
                        <Label>{field.col_name}</Label>
                        {renderField(field)}
                      </FormGroup>
                    </Col>
                  ))}
                </Row>

                <Button
                  style={{ width: "100px" }}
                  color="primary"
                  className="mt-3"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : editData
                    ? "Update"
                    : "Submit"}
                </Button>
              </Form>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AddLeads;
