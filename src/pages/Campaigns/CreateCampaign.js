import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Container,
  Button,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createCampaign, updateCampaign } from "../../services/campaignService";

const ReadOnlyInput = styled(Input)`
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 1;

  &:focus {
    border-color: #ced4da;
    box-shadow: none;
  }
`;

const StyledDeleteButton = styled.button`
  width: 100%;
  background-color: #dc3545;
  border: 1px solid #ced4da;
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  text-align: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e2e6ea;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CreateCampaign = () => {
  const location = useLocation();
  const editData = location.state?.editData;

  const [campaignName, setCampaignName] = useState(editData?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const defaultColumns = [
    {
      name: "Agent Name",
      slug: "agent_name",
      type: "text",
      defaultValue: "Default",
    },
    {
      name: "First Name",
      slug: "first_name",
      type: "text",
      defaultValue: "Default",
    },
    {
      name: "Last Name",
      slug: "last_name",
      type: "text",
      defaultValue: "Default",
    },
    {
      name: "Phone Number",
      slug: "phone_number",
      type: "text",
      defaultValue: "Default",
    },
    { name: "Date", slug: "date", type: "date", defaultValue: "2025-04-21" },
    { name: "State", slug: "state", type: "text", defaultValue: "TX" },
  ];

  const [columns, setColumns] = useState(() => {
    if (editData) {
      const editColumns = editData.columns || [];
      const defaultColumnNames = defaultColumns.map((col) => col.name);
      const additionalColumns = editColumns.filter(
        (col) => !defaultColumnNames.includes(col.name)
      );
      return [...defaultColumns, ...additionalColumns];
    }
    return defaultColumns;
  });

  const [newColumn, setNewColumn] = useState({
    name: "",
    slug: "",
    type: "text",
    defaultValue: "",
    options: "Option 1 | Option 2",
  });

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (editData) {
      setCampaignName(editData.name);
    }
  }, [editData]);

  const handleNewColumnChange = (field, value) => {
    setNewColumn((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name"
        ? { slug: value.toLowerCase().replace(/\s+/g, "_") }
        : {}),
    }));
  };

  const openAddColumnModal = () => {
    setNewColumn({
      name: "",
      slug: "",
      type: "text",
      defaultValue: "",
      options: "Option 1 | Option 2",
    });
    setModalOpen(true);
  };

  const addNewColumn = () => {
    if (newColumn.name.trim() === "") {
      alert("Please enter a column name");
      return;
    }

    if (columns.some((col) => col.name === newColumn.name)) {
      alert("A column with this name already exists");
      return;
    }

    const columnToAdd =
      newColumn.type === "dropdown"
        ? { ...newColumn, options: newColumn.options, defaultValue: "" }
        : newColumn;

    setColumns([...columns, columnToAdd]);
    setModalOpen(false);
  };

  const removeColumn = (index) => {
    const defaultColumnNames = defaultColumns.map((col) => col.name);
    const columnToRemove = columns[index];

    if (defaultColumnNames.includes(columnToRemove.name)) {
      alert("Default columns cannot be removed");
      return;
    }

    if (window.confirm("Are you sure you want to delete this column?")) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  const breadcrumbItems = [
    { title: "Campaigns", link: "/" },
    { title: editData ? "Edit Campaign" : "Create Campaign", link: "#" },
  ];

  const handleSubmit = async () => {
    if (!campaignName.trim()) {
      toast.warn("Please enter a valid campaign name.");
      return;
    }

    if (columns.length === 0) {
      toast.warn("Please add at least one column.");
      return;
    }

    const payload = {
      campaignName,
      fields: columns.map((col) => ({
        col_name: col.name,
        col_slug: col.slug,
        col_type: col.type,
        default_value: col.defaultValue,
        options:
          col.type === "dropdown"
            ? col.options.split("|").map((opt) => opt.trim())
            : undefined,
        multiple: false,
      })),
    };

    console.log("Payload being sent:", payload);
    setIsLoading(true);

    try {
      let result;
      if (editData) {
        result = await updateCampaign(editData.id, payload);
        toast.success("Campaign updated successfully!");
      } else {
        result = await createCampaign(payload);
        toast.success("Campaign created successfully!");
      }

      console.log("Operation result:", result);

      if (!editData) {
        setCampaignName("");
        setColumns(defaultColumns);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Error ${editData ? "updating" : "creating"} campaign: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={editData ? "EDIT CAMPAIGN" : "CREATE CAMPAIGN"}
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <FormGroup className="mb-4" style={{ width: "40%" }}>
                <Label>Campaign Name</Label>
                <Input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter Campaign Name"
                />
              </FormGroup>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Campaign Columns</h4>
                <Button color="primary" onClick={openAddColumnModal}>
                  + Add Column
                </Button>
              </div>

              <Row className="mb-3">
                <Col md={3}>
                  <Label>Column Name</Label>
                </Col>
                <Col md={2}>
                  <Label>Column Slug</Label>
                </Col>
                <Col md={2}>
                  <Label>Column Type</Label>
                </Col>
                <Col md={3}>
                  <Label>
                    {newColumn.type === "dropdown"
                      ? "Options"
                      : "Default Value"}
                  </Label>
                </Col>
                <Col md={2}>
                  <Label>Action</Label>
                </Col>
              </Row>

              {columns.map((column, index) => (
                <Row key={index} className="mb-3 align-items-center">
                  <Col md={3}>
                    <FormGroup>
                      <ReadOnlyInput type="text" value={column.name} readOnly />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <ReadOnlyInput type="text" value={column.slug} readOnly />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <ReadOnlyInput type="text" value={column.type} readOnly />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      {column.type === "dropdown" ? (
                        <ReadOnlyInput
                          type="text"
                          value={column.options || ""}
                          readOnly
                        />
                      ) : (
                        <ReadOnlyInput
                          type={column.type === "date" ? "date" : "text"}
                          value={column.defaultValue}
                          readOnly
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <StyledDeleteButton onClick={() => removeColumn(index)}>
                        Delete
                      </StyledDeleteButton>
                    </FormGroup>
                  </Col>
                </Row>
              ))}

              <div className="mt-4">
                <Button
                  color="primary"
                  className="me-2"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : editData
                    ? "Update Campaign"
                    : "Create Campaign"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          Add New Column
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Column Name</Label>
            <Input
              type="text"
              value={newColumn.name}
              onChange={(e) => handleNewColumnChange("name", e.target.value)}
              placeholder="Enter column name"
            />
          </FormGroup>
          <FormGroup>
            <Label>Column Slug</Label>
            <Input
              type="text"
              value={newColumn.slug}
              onChange={(e) => handleNewColumnChange("slug", e.target.value)}
              placeholder="Enter Column Slug"
            />
          </FormGroup>
          <FormGroup>
            <Label>Column Type</Label>
            <Input
              type="select"
              value={newColumn.type}
              onChange={(e) => handleNewColumnChange("type", e.target.value)}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="dropdown">Dropdown</option>
            </Input>
          </FormGroup>

          {newColumn.type === "dropdown" ? (
            <FormGroup>
              <Label>Options</Label>
              <Input
                type="text"
                value={newColumn.options}
                onChange={(e) =>
                  handleNewColumnChange("options", e.target.value)
                }
                placeholder="Option 1 | Option 2"
              />
              <small className="text-muted">Separate options with |</small>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label>Default Value</Label>
              <Input
                type={newColumn.type === "date" ? "date" : "text"}
                value={newColumn.defaultValue}
                onChange={(e) =>
                  handleNewColumnChange("defaultValue", e.target.value)
                }
                placeholder="Enter default value"
              />
            </FormGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addNewColumn}>
            Add Column
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default CreateCampaign;
