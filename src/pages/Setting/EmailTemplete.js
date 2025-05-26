import React, { useMemo, useState } from "react";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Button,
  Card,
  CardBody,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import { FiEdit2 } from "react-icons/fi";
import UserDetailModal from "../../components/Modals/UserDetailModal";

const EmailTemplate = () => {
  // State for modal and form
  const [modal, setModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [userDetailModal, setUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleRowClick = (row) => {
    setSelectedUser({
      firstName: "admin",
      lastName: "crm",
      email: "admin@eraxon.com",
      password: "123456789",
      phone: "",
      address: "",
      website: "",
      coverageArea: "",
      linkedIn: "",
      role: "Admin",
    });
    setUserDetailModal(true);
  };

  const templatesData = [
    {
      id: 1,
      subject: "Add Lead By Admin",
      message: "A New lead has been added please check.",
      userType: "Admin",
      event: "Add Lead",
      action: "active",
    },
    {
      id: 2,
      subject: "Add Lead By Vendor",
      message: "A New lead has been added by Vendor.",
      userType: "Vendor",
      event: "Add Lead",
      action: "active",
    },
    {
      id: 3,
      subject: "Deleted Lead By Admin",
      message: "Lead deleted by Admin",
      userType: "Admin",
      event: "Delete Lead",
      action: "active",
    },
    {
      id: 4,
      subject: "Deleted Lead By Vendor",
      message: "Lead Deleted By Vendor",
      userType: "Vendor",
      event: "Delete Lead",
      action: "active",
    },
    {
      id: 5,
      subject: "Updates Lead By Admin",
      message: "Lead updated by admin",
      userType: "Admin",
      event: "Update Lead",
      action: "active",
    },
    {
      id: 6,
      subject: "Updates Lead By Vendor",
      message: "Lead updated by vendor",
      userType: "Vendor",
      event: "Update Lead",
      action: "active",
    },
    {
      id: 7,
      subject: "Lead accepts by client",
      message: "Lead accepted by client",
      userType: "Client",
      event: "Accept Lead",
      action: "active",
    },
    {
      id: 8,
      subject: "Lead Rejected by Client",
      message: "Lead Rejected by Client.",
      userType: "Client",
      event: "Reject Lead",
      action: "active",
    },
    {
      id: 9,
      subject: "New Order Created by Admin",
      message: "New Order Created by Admin.",
      userType: "Admin",
      event: "Add Order",
      action: "active",
    },
    {
      id: 10,
      subject: "Order deleted by Admin",
      message: "Order deleted by Admin",
      userType: "Admin",
      event: "Delete Order",
      action: "active",
    },
    {
      id: 11,
      subject: "Order Updated by Admin",
      message: "Order Updated by Admin",
      userType: "Admin",
      event: "Update Campaign",
      action: "active",
    },
    {
      id: 12,
      subject: "Lead In-Review by Client",
      message: "Lead In-Review by Client.",
      userType: "Client",
      event: "In-Review Lead",
      action: "active",
    },
    {
      id: 13,
      subject: "Add Campaign By Admin",
      message: "A new Campaign Added By Admin",
      userType: "Admin",
      event: "Add Campaign",
      action: "active",
    },
  ];

  const toggleModal = () => setModal(!modal);

  const handleEditClick = (template) => {
    setCurrentTemplate(template);

    // Convert HTML to editor state
    const blocksFromHTML = convertFromHTML(template.message || "");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));

    toggleModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedTemplate = {
      ...currentTemplate,
      message: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };

    console.log("Updated template:", updatedTemplate);
    toggleModal();

    // In a real app, you would update the templatesData state here
    // with the updated template and possibly make an API call
  };

  const columns = useMemo(
    () => [
      {
        Header: "Subject",
        accessor: "subject",
        disableFilters: true,
        Cell: ({ row }) => (
          <div
            onClick={() => handleRowClick(row)}
            style={{ cursor: "pointer" }}
          >
            {row.original.subject}
          </div>
        ),
      },
      {
        Header: "Message",
        accessor: "message",
        disableFilters: true,
        Cell: ({ value, row }) => (
          <div
            onClick={() => handleRowClick(row)}
            style={{ cursor: "pointer" }}
            dangerouslySetInnerHTML={{
              __html: value.includes("<p>") ? value : `<p>${value}</p>`,
            }}
          />
        ),
      },
      {
        Header: "User Type",
        accessor: "userType",
        disableFilters: true,
        Cell: ({ row }) => (
          <div
            onClick={() => handleRowClick(row)}
            style={{ cursor: "pointer" }}
          >
            {row.original.userType}
          </div>
        ),
      },
      {
        Header: "Event",
        accessor: "event",
        disableFilters: true,

        Cell: ({ row }) => (
          <div
            onClick={() => handleRowClick(row)}
            style={{ cursor: "pointer" }}
          >
            {row.original.event}
          </div>
        ),
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              className="px-2 py-1"
              onClick={() => handleEditClick(row.original)}
            >
              <FiEdit2 size={14} />
            </Button>
          </div>
        ),
        width: 100,
      },
    ],
    []
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "#" },
    { title: "Email Templates", link: "#" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="EMAIL TEMPLATES"
            breadcrumbItems={breadcrumbItems}
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <span className="me-2">Show</span>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: "80px" }}
                      >
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                      <span className="ms-2">entries</span>
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>

                  <TableContainer
                    columns={columns}
                    data={templatesData}
                    isPagination={true}
                    iscustomPageSize={true}
                    isBordered={false}
                    customPageSize={10}
                    className="custom-table"
                    // onRowClick={(row) => handleRowClick(row)}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          <div>
            <h5 className="modal-title">Edit Email Template</h5>
            {/* <p className="mb-0 text-muted">Settings / Edit Email Templates</p> */}
          </div>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="subject">Subject *</Label>
              <Input
                type="text"
                name="subject"
                id="subject"
                value={currentTemplate?.subject || ""}
                onChange={(e) =>
                  setCurrentTemplate({
                    ...currentTemplate,
                    subject: e.target.value,
                  })
                }
                required
                placeholder="Enter email subject"
              />
            </FormGroup>

            <FormGroup>
              <Label for="message">Message *</Label>
              <div
                style={{
                  border: "1px solid #f1f1f1",
                  padding: "5px",
                  borderRadius: "2px",
                  minHeight: "200px",
                }}
              >
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "fontSize",
                      "list",
                      "textAlign",
                      "link",
                      "emoji",
                      "remove",
                      "history",
                    ],
                    inline: {
                      inDropdown: true,
                      options: ["bold", "italic", "underline", "strikethrough"],
                    },
                    blockType: {
                      inDropdown: true,
                      options: ["Normal", "H1", "H2", "H3", "Blockquote"],
                    },
                    fontSize: {
                      options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48],
                    },
                    list: {
                      inDropdown: true,
                      options: ["unordered", "ordered"],
                    },
                    textAlign: {
                      inDropdown: true,
                      options: ["left", "center", "right", "justify"],
                    },
                    link: {
                      inDropdown: true,
                      options: ["link", "unlink"],
                    },
                  }}
                  editorStyle={{
                    minHeight: "200px",
                    padding: "0 10px",
                  }}
                />
              </div>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Submit
            </Button>{" "}
          </ModalFooter>
        </Form>
      </Modal>

      <UserDetailModal
        user={selectedUser}
        isOpen={userDetailModal}
        toggle={() => setUserDetailModal(!userDetailModal)}
      />
    </React.Fragment>
  );
};

export default EmailTemplate;
