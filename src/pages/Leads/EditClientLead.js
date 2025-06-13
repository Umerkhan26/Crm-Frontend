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
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getClientLeadById,
  updateClientLead,
} from "../../services/ClientleadService";

const EditClientLead = () => {
  const location = useLocation();
  const { lead } = location.state || {};
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Client Leads", link: "/client-leads" },
    { title: "Edit Client Lead", link: "#" },
  ];

  useEffect(() => {
    if (lead) {
      // If lead is passed via navigation state
      setFormData({
        ...lead.leadData,
        id: lead.id,
        order_id: lead.order_id,
        campaign_id: lead.campaign_id,
      });
    } else {
      const leadId = window.location.pathname.split("/").pop();
      fetchLead(leadId);
    }
  }, [lead]);

  const fetchLead = async (id) => {
    try {
      const response = await getClientLeadById(id);
      setFormData({
        ...response.data.leadData,
        id: response.data.id,
        order_id: response.data.order_id,
        campaign_id: response.data.campaign_id,
      });
    } catch (error) {
      toast.error(error.message);
      navigate("/client-leads");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Extract only the leadData for update
      const leadData = { ...formData };
      delete leadData.id;
      delete leadData.order_id;
      delete leadData.campaign_id;

      const payload = {
        leadData,
        order_id: formData.order_id,
        campaign_id: formData.campaign_id,
      };

      await updateClientLead(formData.id, payload);
      toast.success("Client lead updated successfully!");
      navigate("/client-leads");
    } catch (error) {
      toast.error(error.message || "Error updating client lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="EDIT CLIENT LEAD"
          breadcrumbItems={breadcrumbItems}
        />
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Order ID</Label>
                    <Input
                      type="text"
                      name="order_id"
                      value={formData.order_id || ""}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Campaign ID</Label>
                    <Input
                      type="text"
                      name="campaign_id"
                      value={formData.campaign_id || ""}
                      disabled
                    />
                  </FormGroup>
                </Col>

                {/* Dynamic fields from leadData */}
                {Object.entries(formData).map(([key, value]) => {
                  if (["id", "order_id", "campaign_id"].includes(key))
                    return null;

                  return (
                    <Col md={6} key={key}>
                      <FormGroup>
                        <Label>
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                        <Input
                          type="text"
                          name={key}
                          value={value || ""}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  );
                })}
              </Row>

              <Button color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Lead"}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default EditClientLead;
