import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Alert,
  Container,
} from "reactstrap";
import { saveSettings } from "../../store/settingsReducer/settingsActions";
import Breadcrumb from "../../components/Common/Breadcrumb";

const SystemSettingsForm = () => {
  const settings = useSelector((state) => state.settings || {});
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    companyName: "LeadGenerationCRM",
    aboutCompany: "Lead Generation",
    contactEmail: "admin@ttmg.biz",
    logo: null,
    logoMaxHeight: 60,
    logoMaxWidth: 206,
    loginBgColor: "rgba(140, 232, 71, 0.357)",
    navbarBgColor: "#5b7388",
    navbarTextColor: "#7b8190",
    navbarTextHover: "#5b7388",
    navbarBg: "white",
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData((prev) => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "logo") {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    dispatch(saveSettings(formDataToSend));
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: " Settings", link: "#" },
    { title: " System Settings", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="System Settings" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            {settings?.error && <Alert color="danger">{settings.error}</Alert>}
            {settings?.loading && (
              <Alert color="info">Saving settings...</Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>Company Name *</Label>
                    <Input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>Contact Details</Label>
                    <Input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Label>About Company</Label>
                <Input
                  type="textarea"
                  name="aboutCompany"
                  value={formData.aboutCompany}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="mb-3">
                <Label>Company Logo</Label>
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="img-thumbnail mb-2"
                    style={{
                      maxHeight: `${formData.logoMaxHeight}px`,
                      maxWidth: `${formData.logoMaxWidth}px`,
                    }}
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Row className="mt-2">
                  <Col md={6}>
                    <Label>Logo Height (max {formData.logoMaxHeight}px)</Label>
                    <Input
                      type="range"
                      name="logoMaxHeight"
                      min="20"
                      max="200"
                      value={formData.logoMaxHeight}
                      onChange={handleChange}
                    />
                    <span>{formData.logoMaxHeight}px</span>
                  </Col>
                  <Col md={6}>
                    <Label>Logo Width (max {formData.logoMaxWidth}px)</Label>
                    <Input
                      type="range"
                      name="logoMaxWidth"
                      min="50"
                      max="300"
                      value={formData.logoMaxWidth}
                      onChange={handleChange}
                    />
                    <span>{formData.logoMaxWidth}px</span>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <Label>Login Page Background</Label>
                    <Input
                      type="color"
                      name="loginBgColor"
                      value={formData.loginBgColor}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="loginBgColor"
                      value={formData.loginBgColor}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <Label>Header Color</Label>
                    <Input
                      type="color"
                      name="navbarBgColor"
                      value={formData.navbarBgColor}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="navbarBgColor"
                      value={formData.navbarBgColor}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <Label>NavBar Background Color</Label>
                    <Input
                      type="color"
                      name="navbarBg"
                      value={formData.navbarBg}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="navbarBg"
                      value={formData.navbarBg}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>Nav Text Color</Label>
                    <Input
                      type="color"
                      name="navbarTextColor"
                      value={formData.navbarTextColor}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="navbarTextColor"
                      value={formData.navbarTextColor}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>Nav Text Hover</Label>
                    <Input
                      type="color"
                      name="navbarTextHover"
                      value={formData.navbarTextHover}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="navbarTextHover"
                      value={formData.navbarTextHover}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </Col>
              </Row>

              <div className="text-end mt-4">
                <Button
                  type="submit"
                  color="primary"
                  disabled={settings?.loading}
                >
                  {settings?.loading ? "Saving..." : "Submit"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default SystemSettingsForm;
