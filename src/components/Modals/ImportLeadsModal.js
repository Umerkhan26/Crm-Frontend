import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { FaFileImport, FaFileDownload } from "react-icons/fa";

const ImportLeadsModal = ({ isOpen, toggle, onImport }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onImport(selectedFile);
      toggle();
    }
  };

  const downloadSample = () => {
    // Implement sample file download logic here
    console.log("Downloading sample file...");
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Import Lead</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="fileUpload">Upload File</Label>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="file"
                name="fileUpload"
                id="fileUpload"
                onChange={handleFileChange}
                className="w-75"
              />
              {/* <span className="text-muted">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span> */}
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <Button color="primary" onClick={downloadSample}>
            <FaFileDownload className="me-2" />
            Download Sample
          </Button>
          <div>
            <Button color="primary" type="submit">
              <FaFileImport className="me-2" />
              Upload
            </Button>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ImportLeadsModal;
