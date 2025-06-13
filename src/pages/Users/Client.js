import React, { useMemo, useState } from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
} from "reactstrap";

// Dummy client data
const dummyClients = [
  {
    id: 1,
    "First Name": "John",
    "Last Name": "Doe",
    "Phone Number": "(123) 456-7890",
    Address: "123 Main St, Apt 4B",
    State: "California",
    Email: "john.doe@example.com",
    Status: "Active",
    Role: "client",
  },
  {
    id: 2,
    "First Name": "Jane",
    "Last Name": "Smith",
    "Phone Number": "(234) 567-8901",
    Address: "456 Oak Avenue",
    State: "New York",
    Email: "jane.smith@example.com",
    Status: "Active",
    Role: "client",
  },
  {
    id: 3,
    "First Name": "Robert",
    "Last Name": "Johnson",
    "Phone Number": "(345) 678-9012",
    Address: "789 Pine Road",
    State: "Texas",
    Email: "robert.j@example.com",
    Status: "Inactive",
    Role: "client",
  },
];

// US States list
const usStates = [
  "All States",
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  // ... (rest of your states)
];

const AllClient = () => {
  // State for dropdowns
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("All States");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form state
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   phoneNumber: "",
  //   address: "",
  //   state: "",
  //   email: "",
  // });

  // Toggle functions
  const toggleStateDropdown = () => setStateDropdownOpen((prev) => !prev);
  const toggleModal = () => setModalOpen(!modalOpen);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form input changes
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    // console.log("Form submitted:", formData);
    if (selectedFile) {
      console.log("File selected:", selectedFile.name);
    }
    toggleModal();
  };

  // Filter clients based on selected state
  const filteredClients = useMemo(() => {
    let filtered = dummyClients;
    if (selectedState !== "All States") {
      filtered = filtered.filter((client) => client.State === selectedState);
    }
    return filtered;
  }, [selectedState]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <span>{`${row.original["First Name"]} ${row.original["Last Name"]}`}</span>
        ),
        disableFilters: true,
      },
      {
        Header: "Phone Number",
        accessor: "Phone Number",
        disableFilters: true,
      },
      {
        Header: "Address",
        accessor: "Address",
        disableFilters: true,
      },
      {
        Header: "State",
        accessor: "State",
        disableFilters: true,
      },
      {
        Header: "Email",
        accessor: "Email",
        disableFilters: true,
      },
      {
        Header: "Action",
        accessor: "Action",
        Cell: () => (
          <div>
            <button className="btn btn-sm btn-primary me-2">Edit</button>
            <button className="btn btn-sm btn-danger">Delete</button>
          </div>
        ),
        disableFilters: true,
      },
    ],
    []
  );

  // Breadcrumb items
  const breadcrumbItems = [
    { title: "Clients", link: "/" },
    { title: "All Clients", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ALL CLIENTS" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            <Row className="mb-3 justify-content-between">
              <Col md={4}>
                <Label className="form-label">State</Label>
                <Dropdown
                  isOpen={stateDropdownOpen}
                  toggle={toggleStateDropdown}
                >
                  <DropdownToggle
                    caret
                    className="bg-white text-dark border w-100"
                    style={{
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {selectedState}
                  </DropdownToggle>
                  <DropdownMenu
                    className="w-100"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {usStates.map((state) => (
                      <DropdownItem
                        key={state}
                        onClick={() => setSelectedState(state)}
                        active={selectedState === state}
                      >
                        {state}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col md="auto" className="d-flex align-items-end">
                <Button color="primary" onClick={toggleModal}>
                  <i className="fas fa-plus me-2"></i> Add New
                </Button>
              </Col>
            </Row>

            <TableContainer
              columns={columns}
              data={filteredClients.length > 0 ? filteredClients : []}
              isPagination={true}
              iscustomPageSize={true}
              isBordered={false}
              customPageSize={10}
              noDataMessage="No clients found matching your criteria"
            />
          </CardBody>
        </Card>

        {/* Add Client Modal */}
        <Modal
          isOpen={modalOpen}
          toggle={toggleModal}
          style={{ maxWidth: "500px", width: "80%" }} // Adjust width here
          centered
        >
          <ModalHeader toggle={toggleModal}>Add Clients</ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <h5 className="mb-3">Upload File</h5>
              <FormGroup>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="mb-3"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Upload
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AllClient;
