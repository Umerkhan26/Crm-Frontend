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
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCampaign, updateCampaign } from "../../services/campaignService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import Swal from "sweetalert2";

const ReadOnlyInput = styled(Input)`
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 1;

  &:focus {
    border-color: #ced4da;
    box-shadow: none;
  }
`;

const EditableInput = styled(Input)`
  background-color: #ffffff;
  cursor: text;
  opacity: 1;

  &:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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
  const navigate = useNavigate();
  const editData = location.state?.editData;
  const { confirmDelete } = useDeleteConfirmation();

  const [campaignName, setCampaignName] = useState(editData?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  // Define default columns that should not be editable
  const defaultColumns = [
    {
      name: "Agent Name",
      slug: "agent_name",
      type: "text",
      defaultValue: "Default",
      isDefault: true,
    },
    {
      name: "First Name",
      slug: "first_name",
      type: "text",
      defaultValue: "Default",
      isDefault: true,
    },
    {
      name: "Last Name",
      slug: "last_name",
      type: "text",
      defaultValue: "Default",
      isDefault: true,
    },
    {
      name: "Phone Number",
      slug: "phone_number",
      type: "text",
      defaultValue: "Default",
      isDefault: true,
    },
    {
      name: "Date",
      slug: "date",
      type: "date",
      defaultValue: "2025-04-21",
      isDefault: true,
    },
    {
      name: "State",
      slug: "state",
      type: "text",
      defaultValue: "TX",
      isDefault: true,
    },
  ];

  const [columns, setColumns] = useState(() => {
    if (editData) {
      const editColumns = editData.columns || [];
      const defaultColumnNames = defaultColumns.map((col) => col.name);
      const additionalColumns = editColumns.map((col) => ({
        ...col,
        isDefault: defaultColumnNames.includes(col.name),
      }));
      return additionalColumns;
    }
    return defaultColumns;
  });

  const [newColumn, setNewColumn] = useState({
    name: "",
    slug: "",
    type: "text",
    defaultValue: "",
    options: "",
    isDefault: false,
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
      ...(field === "type" && ["checkbox", "radio", "dropdown"].includes(value)
        ? { defaultValue: value === "checkbox" ? [] : "" }
        : {}),
    }));
  };

  const openAddColumnModal = () => {
    setNewColumn({
      name: "",
      slug: "",
      type: "text",
      defaultValue: "",
      options: "",
      isDefault: false,
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

    const columnToAdd = ["dropdown", "radio", "checkbox"].includes(
      newColumn.type
    )
      ? {
          ...newColumn,
          options: newColumn.options,
          defaultValue: newColumn.type === "checkbox" ? [] : "",
        }
      : newColumn;

    setColumns([...columns, columnToAdd]);
    setModalOpen(false);
  };

  const removeColumn = (index) => {
    if (columns[index].isDefault) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        html: `
          <style>
            .swal2-popup {
              width: 280px !important;
              height: 300px !important;
              padding: 7px !important;
              font-size: 14px !important;
            }
            .swal2-title {
              font-size: 16px !important;
            }
            .swal2-content {
              font-size: 14px !important;
            }
            .swal2-confirm {
              font-size: 13px !important;
              padding: 6px 12px !important;
            }
          </style>
          <div>Default columns cannot be removed</div>
        `,
        showConfirmButton: true,
        confirmButtonColor: "#3085d6",
      });

      return;
    }

    confirmDelete(
      () => {
        // deletion logic
        return new Promise((resolve) => {
          setColumns((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            resolve();
            return updated;
          });
        });
      },
      () => {
        // optional success callback
        console.log("Column removed");
      },
      "column"
    );
  };

  const updateColumn = (index, field, value) => {
    if (columns[index].isDefault) {
      return;
    }

    const updatedColumns = [...columns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value,
    };
    setColumns(updatedColumns);
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
        options: ["dropdown", "radio", "checkbox"].includes(col.type)
          ? col.options?.split("|").map((opt) => opt.trim())
          : undefined,
        multiple: col.type === "checkbox",
      })),
    };

    setIsLoading(true);

    try {
      if (editData) {
        await updateCampaign(editData.id, payload);
        toast.success("Campaign updated successfully!");
        navigate("/campaign-index");
      } else {
        await createCampaign(payload);
        toast.success("Campaign created successfully!");
      }

      if (!editData) {
        setCampaignName("");
        setColumns(defaultColumns);
      }
    } catch (error) {
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
                <EditableInput
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
                  <Label>Default Value / Options</Label>
                </Col>
                <Col md={2}>
                  <Label>Action</Label>
                </Col>
              </Row>

              {columns.map((column, index) => (
                <Row key={index} className="mb-3 align-items-center">
                  <Col md={3}>
                    <FormGroup>
                      {column.isDefault ? (
                        <ReadOnlyInput
                          type="text"
                          value={column.name}
                          readOnly
                        />
                      ) : (
                        <EditableInput
                          type="text"
                          value={column.name}
                          onChange={(e) =>
                            updateColumn(index, "name", e.target.value)
                          }
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      {column.isDefault ? (
                        <ReadOnlyInput
                          type="text"
                          value={column.slug}
                          readOnly
                        />
                      ) : (
                        <EditableInput
                          type="text"
                          value={column.slug}
                          onChange={(e) =>
                            updateColumn(index, "slug", e.target.value)
                          }
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      {column.isDefault ? (
                        <ReadOnlyInput
                          type="text"
                          value={column.type}
                          readOnly
                        />
                      ) : (
                        <Input
                          type="select"
                          value={column.type}
                          onChange={(e) =>
                            updateColumn(index, "type", e.target.value)
                          }
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="dropdown">Dropdown</option>
                          <option value="radio">Radio</option>
                          <option value="checkbox">Checkbox</option>
                        </Input>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      {column.isDefault ? (
                        ["dropdown", "radio", "checkbox"].includes(
                          column.type
                        ) ? (
                          <ReadOnlyInput
                            type="text"
                            value={column.options || ""}
                            readOnly
                          />
                        ) : (
                          <ReadOnlyInput
                            type={column.type === "date" ? "date" : "text"}
                            value={
                              Array.isArray(column.defaultValue)
                                ? column.defaultValue.join(", ")
                                : column.defaultValue
                            }
                            readOnly
                          />
                        )
                      ) : ["dropdown", "radio", "checkbox"].includes(
                          column.type
                        ) ? (
                        <EditableInput
                          type="text"
                          value={column.options || ""}
                          onChange={(e) =>
                            updateColumn(index, "options", e.target.value)
                          }
                          placeholder=" | "
                        />
                      ) : (
                        <EditableInput
                          type={column.type === "date" ? "date" : "text"}
                          value={
                            Array.isArray(column.defaultValue)
                              ? column.defaultValue.join(", ")
                              : column.defaultValue
                          }
                          onChange={(e) =>
                            updateColumn(index, "defaultValue", e.target.value)
                          }
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
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </Input>
          </FormGroup>

          {["dropdown", "radio", "checkbox"].includes(newColumn.type) ? (
            <FormGroup>
              <Label>Options</Label>
              <Input
                type="text"
                value={newColumn.options}
                onChange={(e) =>
                  handleNewColumnChange("options", e.target.value)
                }
                placeholder=" | "
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
