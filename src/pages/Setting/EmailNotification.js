import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useState } from "react";

const EmailNotification = () => {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "#" },
    { title: "Email Notification", link: "#" },
  ];

  const [notifications, setNotifications] = useState({
    admin: {
      campaigns: true,
      leads: true,
      acceptReject: true,
      newClient: true,
      newOrder: true,
      orderComplete: true,
    },
    vendor: {
      leads: true,
      newClient: true,
      newOrder: true,
      orderComplete: true,
    },
    client: {
      leads: true,
      newOrder: true,
      orderComplete: true,
    },
  });

  const handleToggle = (section, key) => {
    setNotifications((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const renderSwitch = (section, key, label) => (
    <FormGroup className="form-switch d-flex justify-content-between align-items-center">
      <Label className="me-3">{label}</Label>
      <Input
        type="switch"
        role="switch"
        checked={notifications[section][key]}
        onChange={() => handleToggle(section, key)}
      />
    </FormGroup>
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="EMAIL NOTIFICATION"
          breadcrumbItems={breadcrumbItems}
        />

        <Card>
          <CardBody>
            <Row>
              {/* Admin Section */}
              <Col md={4}>
                <h5 className="mb-3 text-center fw-bold border-bottom pb-3 text-uppercase">
                  Admin
                </h5>

                {renderSwitch(
                  "admin",
                  "campaigns",
                  "Add/Update/Delete Campaigns"
                )}
                {renderSwitch("admin", "leads", "Add/Update/Delete Leads")}
                {renderSwitch(
                  "admin",
                  "acceptReject",
                  "Accept/Reject Leads (Client)"
                )}
                {renderSwitch("admin", "newClient", "New Client Add")}
                {renderSwitch("admin", "newOrder", "New Order Add")}
                {renderSwitch("admin", "orderComplete", "Order Complete")}
              </Col>

              {/* Vendor Section */}
              <Col md={4}>
                <h5 className="mb-3 text-center fw-bold border-bottom pb-3 text-uppercase">
                  VENDOR
                </h5>
                {renderSwitch("vendor", "leads", "Add/Update/Delete Leads")}
                {renderSwitch("vendor", "newClient", "New Client Add")}
                {renderSwitch("vendor", "newOrder", "New Order Add")}
                {renderSwitch("vendor", "orderComplete", "Order Complete")}
              </Col>

              {/* Client Section */}
              <Col md={4}>
                <h5 className="mb-3 text-center fw-bold border-bottom pb-3 text-uppercase">
                  CLIENT
                </h5>
                {renderSwitch("client", "leads", "Add/Update/Replace Leads")}
                {renderSwitch("client", "newOrder", "New Order Add")}
                {renderSwitch("client", "orderComplete", "Order Complete")}
              </Col>
            </Row>

            <div className="mt-4 text-start">
              <button
                className="btn btn-primary px-5 py-2"
                style={{ minWidth: "150px" }}
              >
                Save
              </button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default EmailNotification;
