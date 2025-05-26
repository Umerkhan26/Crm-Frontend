import React from "react";
import Select from "react-select";
import { Row, Col, Label } from "reactstrap";

const VendorForm = ({
  formData,
  handleChange,
  selectedSubVendors,
  handleSubVendorChange,
  subVendoptions,
  customStyles,
}) => {
  return (
    <>
      <Row>
        <Col md="12">
          <div className="mb-3">
            <Label className="form-label">Select Sub-Vendor</Label>
            <Select
              isMulti
              name="subVendor"
              options={subVendoptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedSubVendors}
              onChange={handleSubVendorChange}
              styles={customStyles}
              placeholder="Select Sub-Vendor"
              closeMenuOnSelect={false}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <h5 className="mt-4 fw-bold">Mail Setting</h5>
        </Col>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              SMTP Email / Username <span className="text-danger">*</span>
            </Label>
            <input
              name="smtpemail"
              value={formData.smtpemail}
              onChange={handleChange}
              placeholder="SMTP Email/Username"
              type="text"
              className="form-control"
              required
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              SMTP Password <span className="text-danger">*</span>
            </Label>
            <input
              name="smtppassword"
              value={formData.smtppassword}
              onChange={handleChange}
              placeholder="SMTP Password"
              type="password"
              className="form-control"
              required
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              SMTP Incoming Server <span className="text-danger">*</span>
            </Label>
            <input
              name="smtpincomingserver"
              value={formData.smtpincomingserver}
              onChange={handleChange}
              placeholder="e.g., abc.example.com"
              type="text"
              className="form-control"
              required
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              SMTP Outgoing Server <span className="text-danger">*</span>
            </Label>
            <input
              name="smtpoutgoingserver"
              value={formData.smtpoutgoingserver}
              onChange={handleChange}
              placeholder="e.g., abc.example.com"
              type="text"
              className="form-control"
              required
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              SMTP Port <span className="text-danger">*</span>
            </Label>
            <input
              name="smtpport"
              value={formData.smtpport}
              onChange={handleChange}
              placeholder="SMTP Port"
              type="number"
              className="form-control"
              required
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <h5 className="mt-4 fw-bold">Branch Details</h5>
        </Col>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              Branch Name <span className="text-danger">*</span>
            </Label>
            <input
              name="branchname"
              value={formData.branchname}
              onChange={handleChange}
              placeholder="Branch Name"
              type="text"
              className="form-control"
              required
            />
          </div>
        </Col>

        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              Slug <span className="text-danger">*</span>
            </Label>
            <input
              name="branchslug"
              value={formData.branchslug}
              onChange={handleChange}
              placeholder="Slug"
              type="text"
              className="form-control"
              required
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              Country <span className="text-danger">*</span>
            </Label>
            <input
              type="text"
              name="branchcountry"
              value={formData.branchcountry}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Country"
              required
            />
          </div>
        </Col>

        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">
              Address <span className="text-danger">*</span>
            </Label>
            <input
              name="branchaddress"
              value={formData.branchaddress}
              onChange={handleChange}
              placeholder="Address"
              type="text"
              className="form-control"
              required
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">Header Color</Label>
            <div className="d-flex align-items-center">
              <input
                name="brancheader"
                value={formData.brancheader}
                onChange={handleChange}
                type="color"
                className="form-control-color"
                style={{ width: "50px", height: "40px" }}
              />
              <span className="ms-2">{formData.brancheader}</span>
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">NavBar Background Color</Label>
            <div className="d-flex align-items-center">
              <input
                name="branchnavbar"
                value={formData.branchnavbar}
                onChange={handleChange}
                type="color"
                className="form-control-color"
                style={{ width: "50px", height: "40px" }}
              />
              <span className="ms-2">{formData.branchnavbar}</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">Nav Text Color</Label>
            <div className="d-flex align-items-center">
              <input
                name="branchnavtext"
                value={formData.branchnavtext}
                onChange={handleChange}
                type="color"
                className="form-control-color"
                style={{ width: "50px", height: "40px" }}
              />
              <span className="ms-2">{formData.branchnavtext}</span>
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">NavTextHover</Label>
            <div className="d-flex align-items-center">
              <input
                name="branchnavhover"
                value={formData.branchnavhover}
                onChange={handleChange}
                type="color"
                className="form-control-color"
                style={{ width: "50px", height: "40px" }}
              />
              <span className="ms-2">{formData.branchnavhover}</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <div className="mb-3">
            <Label className="form-label">Branch Logo</Label>
            <div className="custom-file">
              <input
                type="file"
                name="branchlogo"
                onChange={handleChange}
                className="custom-file-input rounded"
                style={{
                  border: "1px solid #ced4da",
                  padding: "0.375rem 0.75rem",
                  width: "100%",
                }}
                id="branchLogo"
              />
              <Label className="custom-file-label" htmlFor="branchLogo">
                {/* {formData.branchlogo?.name || "Choose file"} */}
              </Label>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">Logo Height</Label>
            <input
              name="branchlogoheight"
              value={formData.branchlogoheight}
              onChange={handleChange}
              placeholder="Logo Height"
              type="text"
              className="form-control"
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-3">
            <Label className="form-label">Logo Width</Label>
            <input
              name="branchlogowidth"
              value={formData.branchlogowidth}
              onChange={handleChange}
              placeholder="Logo Width"
              type="text"
              className="form-control"
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default VendorForm;
