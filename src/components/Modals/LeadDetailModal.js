import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";

const LeadDetailModal = ({ isOpen, toggle, leadData }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState({
    title: "",
    description: "",
    datetime: "2025-04-23T19:48",
  });

  // Style object for consistent borders
  const borderStyle = {
    border: "1px solid #dee2e6",
    padding: "0.375rem 0.75rem",
    backgroundColor: "#f8f9fa",
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Lead Detail</ModalHeader>
      <ModalBody>
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={`fw-bold text-dark ${
                activeTab === "details"
                  ? "active bg-light border rounded-top"
                  : ""
              }`}
              onClick={() => setActiveTab("details")}
              style={{ cursor: "pointer" }}
            >
              Lead Details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`fw-bold text-dark ${
                activeTab === "notes"
                  ? "active bg-light border rounded-top"
                  : ""
              }`}
              onClick={() => setActiveTab("notes")}
              style={{ cursor: "pointer" }}
            >
              Notes
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`fw-bold text-dark ${
                activeTab === "reminder"
                  ? "active bg-light border rounded-top"
                  : ""
              }`}
              onClick={() => setActiveTab("reminder")}
              style={{ cursor: "pointer" }}
            >
              Reminder
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab} className="p-2 border border-top-0">
          {/* Lead Details Tab */}
          <TabPane tabId="details">
            <div
              style={{ border: "1px solid #dee2e6", borderRadius: "0.25rem" }}
            >
              <Row className="m-0">
                <Col md={6} style={{ borderRight: "1px solid #dee2e6" }}>
                  <FormGroup className="p-2 border-bottom m-0">
                    <Label>Agent name</Label>
                    <Input
                      plaintext
                      value={leadData?.agentName || "Default"}
                      readOnly
                      style={borderStyle}
                    />
                  </FormGroup>

                  <FormGroup className="p-2 border-bottom m-0">
                    <Label>First name</Label>
                    <Input
                      plaintext
                      value={leadData?.firstName || "Default"}
                      readOnly
                      style={borderStyle}
                    />
                  </FormGroup>

                  <FormGroup className="p-2 m-0">
                    <Label>Last name</Label>
                    <Input
                      plaintext
                      value={leadData?.lastName || "Default"}
                      readOnly
                      style={borderStyle}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup className="p-2 border-bottom m-0">
                    <Label>Phone number</Label>
                    <Input
                      plaintext
                      value={leadData?.phoneNumber || "Default"}
                      readOnly
                      style={borderStyle}
                    />
                  </FormGroup>

                  <FormGroup className="p-2 border-bottom m-0">
                    <Label>State</Label>
                    <Input
                      plaintext
                      value={leadData?.state || "AK"}
                      readOnly
                      style={borderStyle}
                    />
                  </FormGroup>

                  <FormGroup className="p-2 m-0">
                    <Label>Date</Label>
                    <Input
                      plaintext
                      value="2024-05-21"
                      readOnly
                      style={borderStyle}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </TabPane>

          {/* Notes Tab */}
          <TabPane tabId="notes">
            <FormGroup>
              <Input
                type="textarea"
                placeholder="Enter your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  height: "150px",
                  border: "1px solid #dee2e6",
                }}
              />
              <div className="text-end mt-1">
                <small>{250 - notes.length} characters remaining</small>
              </div>
            </FormGroup>
            <Button color="primary">Post</Button>
          </TabPane>

          {/* Reminder Tab */}
          <TabPane tabId="reminder">
            <FormGroup>
              <Label>Title *</Label>
              <Input
                type="text"
                placeholder="Enter title"
                value={reminder.title}
                onChange={(e) =>
                  setReminder({ ...reminder, title: e.target.value })
                }
                style={{ border: "1px solid #dee2e6" }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                placeholder="Description..."
                value={reminder.description}
                onChange={(e) =>
                  setReminder({ ...reminder, description: e.target.value })
                }
                style={{ border: "1px solid #dee2e6" }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Date / Time</Label>
              <Input
                type="datetime-local"
                value={reminder.datetime}
                onChange={(e) =>
                  setReminder({ ...reminder, datetime: e.target.value })
                }
                style={{ border: "1px solid #dee2e6" }}
              />
            </FormGroup>
            <Button color="primary">Post</Button>
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LeadDetailModal;
