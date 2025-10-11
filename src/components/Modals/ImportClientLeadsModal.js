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
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const ImportClientLeadsModal = ({
  isOpen,
  toggle,
  onFileUpload,
  onMapping,
  selectedOrder,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        onFileUpload(file, data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && selectedOrder) {
      onMapping(selectedFile); // Pass file to mapping modal
    } else {
      toast.error("Please select a file and order");
    }
  };

  const downloadSample = () => {
    const campaignFields = selectedOrder?.campaign?.fields
      ? JSON.parse(selectedOrder.campaign.fields)
      : [];
    // const leadDataSample = campaignFields.reduce(
    //   (acc, field) => ({ ...acc, [field.col_slug]: "sample_value" }),
    //   {}
    // );

    const sampleData = [
      ["Order ID", "Campaign ID", ...campaignFields.map((f) => f.col_name)],
      [
        selectedOrder?.id || 1,
        selectedOrder?.campaign_id || 1,
        ...campaignFields.map(() => "sample_value"),
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.write(wb, "sample_leads.xlsx");
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} style={{ fontSize: "0.9rem" }}>
      <ModalHeader
        toggle={toggle}
        style={{ padding: "0.8rem 1rem", fontSize: "1.1rem" }}
      >
        Import Lead
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody style={{ padding: "0.8rem 1rem" }}>
          <FormGroup>
            <Label
              for="fileUpload"
              style={{ fontSize: "0.85rem", marginBottom: "0.3rem" }}
            >
              Upload File
            </Label>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="file"
                name="fileUpload"
                id="fileUpload"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="w-75"
                style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter
          style={{ padding: "0.6rem 1rem" }}
          className="d-flex justify-content-between"
        >
          <Button
            color="primary"
            onClick={downloadSample}
            style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
          >
            <FaFileDownload
              style={{ fontSize: "0.8rem", marginRight: "0.3rem" }}
            />
            Download Sample
          </Button>
          <div>
            <Button
              color="secondary"
              onClick={toggle}
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              style={{
                fontSize: "0.85rem",
                padding: "0.4rem 0.8rem",
                marginLeft: "0.5rem",
              }}
              disabled={!selectedFile || !selectedOrder}
            >
              <FaFileImport
                style={{ fontSize: "0.8rem", marginRight: "0.3rem" }}
              />
              Upload
            </Button>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ImportClientLeadsModal;
