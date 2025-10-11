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
// import { updateClientLead } from "../../services/ClientleadService";
// import { US_STATES } from "../../components/Constrant/constrant";
// import { getCampaignById } from "../../services/campaignService";

// const AddLeads = () => {
//   const location = useLocation();
//   const editData = location.state?.editData;
//   const isClientLead = editData?.isClientLead || false;
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
//     {
//       title: editData
//         ? isClientLead
//           ? "Edit Client Lead"
//           : "Edit Lead"
//         : isClientLead
//         ? "Add Client Lead"
//         : "Add Leads",
//       link: "#",
//     },
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

//         if (!Array.isArray(campaigns)) {
//           throw new Error("Invalid campaigns data format");
//         }

//         const formattedCampaigns = campaigns.map((campaign) => ({
//           value: campaign.id || campaign.value,
//           label: campaign.name || campaign.label,
//           ...campaign,
//         }));

//         setCampaignOptions(formattedCampaigns);

//         if (editData) {
//           // Normalize campaign matching
//           const campaignMatch = formattedCampaigns.find(
//             (c) =>
//               c.value === editData.campaign_id ||
//               c.label === editData.campaignType ||
//               c.value === editData.campaignType ||
//               c.label.toLowerCase() ===
//                 (editData.campaignType || "").toLowerCase()
//           );

//           if (!campaignMatch) {
//             console.warn("Campaign not found for edit data:", editData);
//             toast.error(
//               "Selected campaign not found. Please select a campaign."
//             );
//             setIsLoading(false);
//             return;
//           }

//           // Set the selected campaign
//           setSelectedCampaign(campaignMatch);

//           // Fetch campaign fields
//           const response = await getCampaignById(campaignMatch.value);
//           if (!response || !response.length || !response[0].fields) {
//             throw new Error("Invalid campaign fields response");
//           }

//           let fields = response[0].fields;

//           // Handle both stringified JSON and already-parsed arrays
//           if (typeof fields === "string") {
//             try {
//               fields = JSON.parse(fields);
//             } catch (e) {
//               console.error("Failed to parse campaign fields:", e);
//               fields = [];
//             }
//           }

//           setCampaignFields(fields);

//           // Initialize form data with editData
//           const initialFormData = {};
//           fields.forEach((field) => {
//             let value = editData[field.col_slug];

//             if (value === undefined) {
//               const normalizedFieldName = normalizeFieldName(field.col_slug);
//               for (const [key, val] of Object.entries(
//                 editData.leadData || editData.fullLeadData || {}
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
//               value !== undefined
//                 ? value
//                 : field.col_type === "checkbox"
//                 ? false
//                 : field.options?.length
//                 ? field.options[0]
//                 : field.default_value || "";
//           });

//           setFormData(initialFormData);
//           setShowForm(true); // Show the form after setting fields and form data
//         }
//       } catch (error) {
//         console.error("Error loading campaigns:", error);
//         toast.error(error.message || "Failed to load campaign data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCampaigns();
//   }, [editData, isClientLead]);

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
//         const response = await getCampaignById(selectedOption.value);
//         let fields = response[0].fields;

//         if (typeof fields === "string") {
//           try {
//             fields = JSON.parse(fields);
//           } catch (e) {
//             console.error("Failed to parse campaign fields:", e);
//             fields = [];
//           }
//         }
//         setCampaignFields(fields);

//         if (editData) {
//           const initialFormData = {};
//           fields.forEach((field) => {
//             let value;

//             if (editData[field.col_slug] !== undefined) {
//               value = editData[field.col_slug];
//             } else {
//               const normalizedFieldName = normalizeFieldName(field.col_slug);
//               for (const [key, val] of Object.entries(
//                 isClientLead
//                   ? editData.leadData || {}
//                   : editData.fullLeadData || {}
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
//       if (isClientLead) {
//         const payload = {
//           campaign_id: selectedCampaign.value,
//           leadData: formData,
//           order_id: editData.orderId || null,
//         };
//         if (editData) {
//           const response = await updateClientLead(editData.id, payload);
//           toast.success(
//             response.message || "Client lead updated successfully!"
//           );
//         } else {
//           toast.error("Create client lead API not implemented yet");
//         }
//         navigate("/lead-index");
//       } else {
//         const payload = {
//           campaignName: selectedCampaign.label,
//           leadData: formData,
//         };
//         if (editData) {
//           const response = await updateLead(editData.id, payload);
//           toast.success(response.message || "Lead updated successfully!");
//         } else {
//           const response = await createLead(payload);
//           toast.success(response.message || "Lead created successfully!");
//           setFormData(initializeForm(campaignFields));
//         }
//         navigate("/master-lead-index");
//       }
//     } catch (error) {
//       toast.error(error.message || "Error submitting form");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderStateField = (field) => {
//     const stateOptions = US_STATES.map((state) => ({
//       value: state,
//       label: state,
//     }));

//     const selectedState = stateOptions.find(
//       (option) => option.value === formData[field.col_slug]
//     );

//     return (
//       <Select
//         name={field.col_slug}
//         options={stateOptions}
//         value={selectedState}
//         onChange={(selectedOption) =>
//           setFormData((prev) => ({
//             ...prev,
//             [field.col_slug]: selectedOption ? selectedOption.value : "",
//           }))
//         }
//         isClearable
//         isSearchable
//         placeholder="Select a state"
//       />
//     );
//   };

//   const renderField = (field) => {
//     if (!field) return null;

//     const fieldName = field.col_slug;
//     const fieldValue = formData[fieldName] || "";

//     if (fieldName?.toLowerCase?.() === "state") {
//       return renderStateField(field);
//     }

//     const commonProps = {
//       name: fieldName,
//       value: fieldValue,
//       onChange: handleChange,
//       required: true,
//     };

//     switch (field.col_type) {
//       case "text":
//       case "number":
//       case "date":
//         return (
//           <Input
//             type={field.col_type}
//             {...commonProps}
//             placeholder={field.default_value || ""}
//           />
//         );

//       case "dropdown":
//         const dropdownOptions =
//           field.options?.map((opt) => ({
//             label: opt,
//             value: opt,
//           })) || [];

//         const selectedDropdown = dropdownOptions.find(
//           (opt) => opt.value === fieldValue
//         );

//         return (
//           <Select
//             name={fieldName}
//             options={dropdownOptions}
//             value={selectedDropdown}
//             onChange={(selectedOption) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 [fieldName]: selectedOption ? selectedOption.value : "",
//               }))
//             }
//             isClearable
//             isSearchable
//             placeholder="Select an option"
//           />
//         );

//       case "radio":
//         return (
//           <FormGroup tag="fieldset">
//             <legend>{field.col_label}</legend>
//             {field.options?.map((option, idx) => (
//               <FormGroup check inline key={idx}>
//                 <Label check>
//                   <Input
//                     type="radio"
//                     name={fieldName}
//                     value={option}
//                     checked={fieldValue === option}
//                     onChange={handleChange}
//                   />{" "}
//                   {option}
//                 </Label>
//               </FormGroup>
//             ))}
//           </FormGroup>
//         );

//       case "checkbox":
//         return (
//           <FormGroup check>
//             <Label check>
//               <Input
//                 name={fieldName}
//                 type="checkbox"
//                 checked={!!fieldValue}
//                 onChange={handleChange}
//               />{" "}
//               {field.col_label}
//             </Label>
//           </FormGroup>
//         );

//       default:
//         return (
//           <Input
//             type="text"
//             {...commonProps}
//             placeholder={field.col_placeholder || ""}
//           />
//         );
//     }
//   };

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs
//           title={
//             editData
//               ? isClientLead
//                 ? "EDIT CLIENT LEAD"
//                 : "EDIT LEAD"
//               : isClientLead
//               ? "ADD CLIENT LEAD"
//               : "ADD LEADS"
//           }
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
//               <ModalHeader toggle={toggleModal}>
//                 {isClientLead ? "Add Bulk Client Lead" : "Add Bulk Lead"}
//               </ModalHeader>
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
//                     {isClientLead ? "Import Client Leads" : "Import Leads"}
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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCampaigns } from "../../services/orderService";
import { createLead, updateLead } from "../../services/leadService";
import { toast } from "react-toastify";
import { updateClientLead } from "../../services/ClientleadService";
import { US_STATES } from "../../components/Constrant/constrant";
import { getCampaignById } from "../../services/campaignService";
import { FaFileImport } from "react-icons/fa";
import ColumnMappingModal from "../../components/Modals/LeadColumnMappingModal";
import ImportLeadsModal from "../../components/Modals/ImportLeadsModal";
import * as XLSX from "xlsx";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Import states
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [excelColumns, setExcelColumns] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

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

        if (!Array.isArray(campaigns)) {
          throw new Error("Invalid campaigns data format");
        }

        const formattedCampaigns = campaigns.map((campaign) => ({
          value: campaign.id || campaign.value,
          label: campaign.name || campaign.label,
          ...campaign,
        }));

        setCampaignOptions(formattedCampaigns);

        if (editData) {
          // ... (existing edit data logic remains the same)
          const campaignMatch = formattedCampaigns.find(
            (c) =>
              c.value === editData.campaign_id ||
              c.label === editData.campaignType ||
              c.value === editData.campaignType ||
              c.label.toLowerCase() ===
                (editData.campaignType || "").toLowerCase()
          );

          if (!campaignMatch) {
            console.warn("Campaign not found for edit data:", editData);
            toast.error(
              "Selected campaign not found. Please select a campaign."
            );
            setIsLoading(false);
            return;
          }

          setSelectedCampaign(campaignMatch);
          const response = await getCampaignById(campaignMatch.value);

          if (!response || !response.length || !response[0].fields) {
            throw new Error("Invalid campaign fields response");
          }

          let fields = response[0].fields;
          if (typeof fields === "string") {
            try {
              fields = JSON.parse(fields);
            } catch (e) {
              console.error("Failed to parse campaign fields:", e);
              fields = [];
            }
          }

          setCampaignFields(fields);

          // Initialize form data with editData
          const initialFormData = {};
          fields.forEach((field) => {
            let value = editData[field.col_slug];

            if (value === undefined) {
              const normalizedFieldName = normalizeFieldName(field.col_slug);
              for (const [key, val] of Object.entries(
                editData.leadData || editData.fullLeadData || {}
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
              value !== undefined
                ? value
                : field.col_type === "checkbox"
                ? false
                : field.options?.length
                ? field.options[0]
                : field.default_value || "";
          });

          setFormData(initialFormData);
          setShowForm(true);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
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
        const response = await getCampaignById(selectedOption.value);
        let fields = response[0].fields;

        if (typeof fields === "string") {
          try {
            fields = JSON.parse(fields);
          } catch (e) {
            console.error("Failed to parse campaign fields:", e);
            fields = [];
          }
        }
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

  // Import Modal Functions
  const toggleImportModal = () => setImportModalOpen(!importModalOpen);
  const toggleMappingModal = () => setMappingModalOpen(!mappingModalOpen);

  const handleFileUpload = (file, data) => {
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (jsonData.length > 0) {
      setExcelColumns(jsonData[0]);
      setExcelFile(file);
    }
  };

  const handleMapping = (file) => {
    setExcelFile(file);
    toggleImportModal();
    toggleMappingModal();
  };

  const handleMappingComplete = (response) => {
    const imported = response.imported || 0;
    const skipped = response.skipped || [];
    toast.success(
      `${imported} leads imported successfully. Skipped: ${skipped.length}`
    );
    toggleMappingModal();
    navigate("/master-lead-index");
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
        navigate("/lead-index");
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

  const renderStateField = (field) => {
    // ... (existing renderStateField implementation)
    const stateOptions = US_STATES.map((state) => ({
      value: state,
      label: state,
    }));

    const selectedState = stateOptions.find(
      (option) => option.value === formData[field.col_slug]
    );

    return (
      <Select
        name={field.col_slug}
        options={stateOptions}
        value={selectedState}
        onChange={(selectedOption) =>
          setFormData((prev) => ({
            ...prev,
            [field.col_slug]: selectedOption ? selectedOption.value : "",
          }))
        }
        isClearable
        isSearchable
        placeholder="Select a state"
      />
    );
  };

  const renderField = (field) => {
    // ... (existing renderField implementation)
    if (!field) return null;

    const fieldName = field.col_slug;
    const fieldValue = formData[fieldName] || "";

    if (fieldName?.toLowerCase?.() === "state") {
      return renderStateField(field);
    }

    const commonProps = {
      name: fieldName,
      value: fieldValue,
      onChange: handleChange,
      required: true,
    };

    switch (field.col_type) {
      case "text":
      case "number":
      case "date":
        return (
          <Input
            type={field.col_type}
            {...commonProps}
            placeholder={field.default_value || ""}
          />
        );

      case "dropdown":
        const dropdownOptions =
          field.options?.map((opt) => ({
            label: opt,
            value: opt,
          })) || [];

        const selectedDropdown = dropdownOptions.find(
          (opt) => opt.value === fieldValue
        );

        return (
          <Select
            name={fieldName}
            options={dropdownOptions}
            value={selectedDropdown}
            onChange={(selectedOption) =>
              setFormData((prev) => ({
                ...prev,
                [fieldName]: selectedOption ? selectedOption.value : "",
              }))
            }
            isClearable
            isSearchable
            placeholder="Select an option"
          />
        );

      case "radio":
        return (
          <FormGroup tag="fieldset">
            <legend>{field.col_label}</legend>
            {field.options?.map((option, idx) => (
              <FormGroup check inline key={idx}>
                <Label check>
                  <Input
                    type="radio"
                    name={fieldName}
                    value={option}
                    checked={fieldValue === option}
                    onChange={handleChange}
                  />{" "}
                  {option}
                </Label>
              </FormGroup>
            ))}
          </FormGroup>
        );

      case "checkbox":
        return (
          <FormGroup check>
            <Label check>
              <Input
                name={fieldName}
                type="checkbox"
                checked={!!fieldValue}
                onChange={handleChange}
              />{" "}
              {field.col_label}
            </Label>
          </FormGroup>
        );

      default:
        return (
          <Input
            type="text"
            {...commonProps}
            placeholder={field.col_placeholder || ""}
          />
        );
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

            {showForm && (
              <Form onSubmit={handleSubmit} className="mt-4">
                {!editData && (
                  <Button
                    color="primary"
                    className="mb-4"
                    onClick={toggleImportModal}
                  >
                    <FaFileImport className="me-2" />
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

      {/* Import Leads Modal */}
      <ImportLeadsModal
        isOpen={importModalOpen}
        toggle={toggleImportModal}
        onFileUpload={handleFileUpload}
        onMapping={handleMapping}
        selectedCampaign={selectedCampaign}
      />

      {/* Column Mapping Modal */}
      <ColumnMappingModal
        isOpen={mappingModalOpen}
        toggle={toggleMappingModal}
        onImport={handleMappingComplete}
        selectedCampaign={selectedCampaign}
        excelColumns={excelColumns}
        selectedFile={excelFile}
      />
    </div>
  );
};

export default AddLeads;
