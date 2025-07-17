import React, { useEffect, useMemo, useState } from "react";
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
import {
  getEmailTemplates,
  updateEmailTemplate,
} from "../../services/emailTemplateService";

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
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getEmailTemplates();
        setTemplatesData(data);
        console.log("EMAIL TEMPLETE", data);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const toggleModal = () => setModal(!modal);

  const handleEditClick = (template) => {
    setCurrentTemplate(template);

    // Convert HTML from bodyTemplate to editor state
    const blocksFromHTML = convertFromHTML(template.bodyTemplate || "");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));

    toggleModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedTemplate = {
        ...currentTemplate,
        name: currentTemplate.name, // Subject
        bodyTemplate: draftToHtml(
          convertToRaw(editorState.getCurrentContent())
        ), // Message content
      };

      // Call the update API
      await updateEmailTemplate(currentTemplate.id, updatedTemplate);

      // Update local state if needed
      setTemplatesData(
        templatesData.map((template) =>
          template.id === currentTemplate.id ? updatedTemplate : template
        )
      );

      toggleModal();
    } catch (error) {
      console.error("Failed to update template:", error);
      // You might want to show an error message to the user here
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Subject",
        accessor: "name", // Use subjectTemplate directly
        disableFilters: true,
        Cell: ({ row }) => (
          <div
            onClick={() => handleRowClick(row)}
            style={{ cursor: "pointer" }}
          >
            {row.original.name}
          </div>
        ),
      },
      {
        Header: "Message",
        accessor: "bodyTemplate",
        disableFilters: true,
        Cell: ({ value, row }) => {
          // Create a temporary div to parse the HTML
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = value || "";
          const textContent = tempDiv.textContent || tempDiv.innerText || "";

          return (
            <div
              onClick={() => handleRowClick(row)}
              style={{
                cursor: "pointer",
                minHeight: "20px",
                padding: "5px",
                whiteSpace: "pre-line",
              }}
            >
              {textContent.trim() || "No content available"}
            </div>
          );
        },
      },
      {
        Header: "Service Name",
        accessor: "serviceName",
        disableFilters: true,
        Cell: ({ row }) => (
          <div
            onClick={() => handleRowClick(row)}
            style={{ cursor: "pointer" }}
          >
            {row.original.serviceName}
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
                value={currentTemplate?.name || ""}
                onChange={(e) =>
                  setCurrentTemplate({
                    ...currentTemplate,
                    name: e.target.value,
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
