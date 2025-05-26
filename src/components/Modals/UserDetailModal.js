import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const UserDetailModal = ({ user, isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>User Details</ModalHeader>
      <ModalBody>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>First Name</strong>
              </Label>
              <Input type="text" value={user?.firstName || ""} readOnly />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Last Name</strong>
              </Label>
              <Input type="text" value={user?.lastName || ""} readOnly />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Email</strong>
              </Label>
              <Input type="text" value={user?.email || ""} readOnly />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Password</strong>
              </Label>
              <Input type="text" value={user?.password || ""} readOnly />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Phone</strong>
              </Label>
              <Input type="text" value={user?.phone || ""} readOnly />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Role</strong>
              </Label>
              <Input type="text" value={user?.role || ""} readOnly />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Website</strong>
              </Label>
              <Input type="text" value={user?.website || ""} readOnly />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Coverage Area</strong>
              </Label>
              <Input type="text" value={user?.coverageArea || ""} readOnly />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>LinkedIn</strong>
              </Label>
              <Input type="text" value={user?.linkedIn || ""} readOnly />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label>
                <strong>Address</strong>
              </Label>
              <Input type="text" value={user?.address || ""} readOnly />
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default UserDetailModal;
