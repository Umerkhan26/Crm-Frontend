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
import { getCampaignFields } from "../../services/campaignService";
import { fetchCampaigns } from "../../services/orderService";
import { createLead, updateLead } from "../../services/leadService";
import { toast } from "react-toastify";

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
    { title: editData ? "Edit Lead" : "Add Leads", link: "#" },
  ];

  const initializeForm = (fields) => {
    const initialFormData = {};
    fields.forEach((field) => {
      const cleanFieldName = field.col_slug.replace(/[^a-zA-Z0-9]/g, "_");
      let value = findMatchingFieldValue(editData, cleanFieldName);
      if (value === null) {
        value = findMatchingFieldValue(
          editData,
          field.col_name.replace(/[^a-zA-Z0-9]/g, "_")
        );
      }
      switch (field.col_type) {
        case "checkbox":
          initialFormData[field.col_slug] = Boolean(value);
          break;
        case "date":
          initialFormData[field.col_slug] = value
            ? new Date(value).toISOString().split("T")[0]
            : "";
          break;
        case "number":
          initialFormData[field.col_slug] = value !== null ? Number(value) : "";
          break;
        default:
          initialFormData[field.col_slug] = value !== null ? String(value) : "";
      }
    });
    return initialFormData;
  };

  const findMatchingFieldValue = (leadData, fieldName) => {
    if (leadData[fieldName] !== undefined) return leadData[fieldName];
    const variations = [
      fieldName,
      fieldName.toLowerCase(),
      fieldName.replace(/_/g, ""),
      camelCase(fieldName),
      snakeCase(fieldName),
      fieldName.replace(/[^a-zA-Z0-9]/g, ""),
    ];
    const searchObjects = [leadData];
    if (leadData.fullLeadData) searchObjects.push(leadData.fullLeadData);
    if (leadData.leadData) searchObjects.push(leadData.leadData);
    for (const obj of searchObjects) {
      for (const variation of variations) {
        if (obj[variation] !== undefined) {
          return obj[variation];
        }
      }
    }
    return null;
  };

  const camelCase = (str) =>
    str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  const snakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const campaigns = await fetchCampaigns();
        setCampaignOptions(campaigns);
        if (editData) {
          const selected = campaigns.find(
            (c) => c.label === editData.campaignType
          );
          if (selected) {
            const fields = await getCampaignFields(selected.value);
            setCampaignFields(fields);
            setFormData(initializeForm(fields));
            setSelectedCampaign(selected);
            setShowForm(true);
          } else {
            toast.error("The campaign for this lead is no longer available.");
            navigate("/lead-index");
          }
        }
      } catch (error) {
        toast.error("Failed to load campaign data.");
        setShowForm(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaigns();
  }, [editData, navigate]);

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
        const fields = await getCampaignFields(selectedOption.value);
        setCampaignFields(fields);
        setFormData(initializeForm(fields));
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    } catch (error) {
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
      if (editData) {
        const payload = { ...formData };
        const response = await updateLead(editData.id, payload);
        toast.success(response.message || "Lead updated successfully!");

        // Option 1: Update local state if leads are stored in a parent component
        // Assuming you have a context or prop to update the leads list
        // updateLeadsList(response.lead); // Example: Update parent state

        // Option 2: Re-fetch the leads list
        const updatedCampaigns = await fetchCampaigns(); // Or fetch leads specifically
        setCampaignOptions(updatedCampaigns); // Update campaigns or leads as needed
      } else {
        const payload = {
          campaignName: selectedCampaign.label,
          leadData: formData,
        };
        const response = await createLead(payload);
        toast.success(response.message || "Lead created successfully!");
      }
      navigate("/lead-index");
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
    if (field.col_slug.toLowerCase() === "state") {
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
          title={editData ? "EDIT LEAD" : "ADD LEADS"}
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
                isDisabled={isLoading || editData}
              />
            </FormGroup>
            <Modal isOpen={modal} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>Add Bulk Lead</ModalHeader>
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
                    Import Leads
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
