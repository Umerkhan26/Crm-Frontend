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
import { useLocation } from "react-router-dom";

const AddLeads = () => {
  const location = useLocation();
  const editData = location.state?.editData;

  // Form state
  const [formData, setFormData] = useState({
    campaignType: "",
    agentName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    date: "",
    state: "Alaska",
    address: "",
    city: "",
    zipCode: "",
    app: "",
    smoke: "",
    partABStatus: "",
    supplement: "",
    callBack: "",
    localAgentName: "",
    recordingLink1: "",
    recordingLink2: "",
    custom1: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Breadcrumb items
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/AllLeads" },
    { title: editData ? "Edit Lead" : "Add Leads", link: "#" },
  ];

  useEffect(() => {
    if (editData) {
      // Initialize form with edit data
      setFormData({
        campaignType: editData.campaignType || "",
        agentName: editData.agentName || "",
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        phoneNumber: editData.phoneNumber || "",
        date: editData.date || "",
        state: editData.state || "Alaska",
        address: editData.address || "",
        city: editData.city || "",
        zipCode: editData.zipCode || "",
        app: editData.app || "",
        smoke: editData.smoke || "",
        partABStatus: editData.partABStatus || "",
        supplement: editData.supplement || "",
        callBack: editData.callBack || "",
        localAgentName: editData.localAgentName || "",
        recordingLink1: editData.recordingLink1 || "",
        recordingLink2: editData.recordingLink2 || "",
        custom1: editData.custom1 || "",
      });
      setShowForm(true);
    }
  }, [editData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle modal
  const toggleModal = () => setModal(!modal);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle campaign selection
  const handleCampaignChange = (e) => {
    handleChange(e);
    setShowForm(e.target.value !== "");
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call would go here
      console.log("Form data to submit:", formData);
      alert(
        editData ? "Lead updated successfully!" : "Lead submitted successfully!"
      );

      if (!editData) {
        // Reset form after submission only for new leads
        setFormData({
          campaignType: "",
          agentName: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          date: "",
          state: "Alaska",
          address: "",
          city: "",
          zipCode: "",
          app: "",
          smoke: "",
          partABStatus: "",
          supplement: "",
          callBack: "",
          localAgentName: "",
          recordingLink1: "",
          recordingLink2: "",
          custom1: "",
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  // US states for dropdown
  const states = [
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

  const campaignOptions = [
    {
      value: "Callback - Final Expense (Direct Mail)",
      label: "Callback - Final Expense (Direct Mail)",
    },
    { value: "Callback - Final Expense", label: "Callback - Final Expense" },
  ];

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
                value={campaignOptions.find(
                  (option) => option.value === formData.campaignType
                )}
                onChange={(selectedOption) =>
                  handleCampaignChange({
                    target: {
                      name: "campaignType",
                      value: selectedOption.value,
                    },
                  })
                }
                isSearchable
                placeholder="Select"
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
                      console.log("Uploading file:", selectedFile);
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
                  <Col md={6}>
                    <FormGroup>
                      <Label>Agent Name</Label>
                      <Input
                        type="text"
                        name="agentName"
                        value={formData.agentName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Phone Number</Label>
                      <Input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="10 digits only"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Date</Label>
                      <Input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="mm/dd/yyyy"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>State</Label>
                      <Input
                        type="select"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      >
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Address</Label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>City</Label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Zip Code</Label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="12345 or 12345-6789"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>App</Label>
                      <Input
                        type="text"
                        name="app"
                        value={formData.app}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Smoke</Label>
                      <Input
                        type="text"
                        name="smoke"
                        value={formData.smoke}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Part A & B Status</Label>
                      <Input
                        type="text"
                        name="partABStatus"
                        value={formData.partABStatus}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Supplement</Label>
                      <Input
                        type="text"
                        name="supplement"
                        value={formData.supplement}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Call Back</Label>
                      <Input
                        type="text"
                        name="callBack"
                        value={formData.callBack}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Local Agent Name</Label>
                      <Input
                        type="text"
                        name="localAgentName"
                        value={formData.localAgentName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Recording Link 1</Label>
                      <Input
                        type="text"
                        name="recordingLink1"
                        value={formData.recordingLink1}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Recording Link 2</Label>
                      <Input
                        type="text"
                        name="recordingLink2"
                        value={formData.recordingLink2}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Custom 1</Label>
                      <Input
                        type="text"
                        name="custom1"
                        value={formData.custom1}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Button
                  style={{ width: "100px" }}
                  color="primary"
                  className="mt-3"
                  disabled={isSubmitting}
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
