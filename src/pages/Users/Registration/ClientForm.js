import React from "react";
import Select from "react-select";
import { Row, Col, Label } from "reactstrap";

const ClientForm = ({
  selectedSubVendors,
  handleSubVendorChange,
  subVendoptions,
  customStyles,
}) => {
  return (
    <Row>
      <Col md="12">
        <div className="mb-3">
          <Label className="form-label">Select Vendor</Label>
          <Select
            isMulti
            name="Vendor"
            options={subVendoptions}
            className="вало-multi-select"
            classNamePrefix="select"
            value={selectedSubVendors}
            onChange={handleSubVendorChange}
            styles={customStyles}
            placeholder="Select Vendor"
            closeMenuOnSelect={false}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ClientForm;
