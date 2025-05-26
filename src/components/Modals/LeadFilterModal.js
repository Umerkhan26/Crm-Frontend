import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Row,
  Col,
  Input,
  Label,
} from "reactstrap";
import { FaTimes } from "react-icons/fa";

const LeadFilterModal = ({ isOpen, toggle, leads = [] }) => {
  const agentOptions = [
    ...new Set(leads.map((lead) => lead?.agentName).filter(Boolean)),
  ];

  // Define field types and their condition options
  const fieldTypes = {
    Agent: {
      conditions: [
        "is",
        "is not",
        "contains",
        "does not contain",
        "is blank",
        "is not blank",
      ],
      inputType: "select",
      options: agentOptions,
    },
    Name: {
      conditions: [
        "is",
        "is not",
        "contains",
        "does not contain",
        "is blank",
        "is not blank",
      ],
      inputType: "text",
    },
    "Phone Number": {
      conditions: [
        "is",
        "is not",
        "contains",
        "does not contain",
        "is blank",
        "is not blank",
      ],
      inputType: "text",
    },
    Address: {
      conditions: ["contains", "does not contain", "is blank", "is not blank"],
      inputType: "text",
    },
    State: {
      conditions: ["is", "is not", "is blank", "is not blank"],
      inputType: "text",
    },
    "Callback - Final Expense": {
      conditions: ["is set", "is not set"],
      inputType: "none",
    },
  };

  const [filters, setFilters] = useState([
    { category: "Agent", condition: "is", value: "Default", joinType: "AND" },
  ]);
  const [entries, setEntries] = useState(10);

  const addFilter = () => {
    setFilters([
      ...filters,
      { category: "Agent", condition: "is", value: "Default", joinType: "AND" },
    ]);
  };

  const removeFilter = (index) => {
    if (index === 0) return;
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const updateFilter = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;

    if (field === "category") {
      const fieldType = fieldTypes[value] || {};
      newFilters[index].condition = fieldType.conditions?.[0] || "";
      newFilters[index].value = "";
    }

    setFilters(newFilters);
  };

  const renderValueInput = (filter, index) => {
    const fieldType = fieldTypes[filter.category] || {};

    if (fieldType.inputType === "select") {
      return (
        <Input
          type="select"
          value={filter.value}
          onChange={(e) => updateFilter(index, "value", e.target.value)}
          className="form-select-sm"
        >
          <option value="">Type to Search</option>
          {filter.category === "Agent" && (
            <>
              <option value="Default">Default</option>
              <option value="Default">Default</option>
              <option value="Default">Default</option>
              <option value="Default">gg</option>
              <option value="Default">gg</option>
            </>
          )}
          {fieldType.options?.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </Input>
      );
    } else if (fieldType.inputType === "text") {
      return (
        <Input
          type="text"
          value={filter.value}
          onChange={(e) => updateFilter(index, "value", e.target.value)}
          className="form-control-sm"
          placeholder="Type to search"
        />
      );
    }
    return null;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Lead Filter</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <h5>WHERE</h5>

          {filters.map((filter, index) => (
            <Row key={index} className="mb-3 align-items-center">
              {index > 0 && (
                <Col md={1}>
                  <Input
                    type="select"
                    value={filter.joinType}
                    onChange={(e) =>
                      updateFilter(index, "joinType", e.target.value)
                    }
                    className="form-select-sm"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </Input>
                </Col>
              )}
              <Col md={index > 0 ? 3 : 4}>
                <Input
                  type="select"
                  value={filter.category}
                  onChange={(e) =>
                    updateFilter(index, "category", e.target.value)
                  }
                  className="form-select-sm"
                >
                  {Object.keys(fieldTypes).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={3}>
                <Input
                  type="select"
                  value={filter.condition}
                  onChange={(e) =>
                    updateFilter(index, "condition", e.target.value)
                  }
                  className="form-select-sm"
                >
                  {(fieldTypes[filter.category]?.conditions || []).map(
                    (condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    )
                  )}
                </Input>
              </Col>
              <Col md={index > 0 ? 3 : 4}>
                {renderValueInput(filter, index)}
              </Col>
              {index > 0 && (
                <Col md={1}>
                  <Button
                    color="link"
                    onClick={() => removeFilter(index)}
                    className="p-0"
                  >
                    <FaTimes className="text-danger" />
                  </Button>
                </Col>
              )}
            </Row>
          ))}

          <Button color="primary" onClick={addFilter} className="px-4 mt-2">
            Add filter
          </Button>
        </div>

        <Row className="align-items-center">
          <Col md={12}>
            <Label> AND Category</Label>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="select"
                value={entries}
                onChange={(e) => setEntries(e.target.value)}
                className="form-select-sm"
              >
                <option>Select Category</option>
                <option>Callback-Final Expense</option>
                <option>Callback-Final Expense(Direct Mail)</option>
              </Input>
            </div>
          </Col>
        </Row>

        <div className="border-top pt-3">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="d-flex align-items-center gap-2">
                <span>Show</span>
                <Input
                  type="select"
                  value={entries}
                  onChange={(e) => setEntries(e.target.value)}
                  className="form-select-sm"
                >
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </Input>
                <span>entries</span>
              </div>
            </Col>
            <Col md={{ offset: 5, size: 4 }} className="text-end">
              <Button color="primary" onClick={toggle}>
                Submit
              </Button>
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default LeadFilterModal;
