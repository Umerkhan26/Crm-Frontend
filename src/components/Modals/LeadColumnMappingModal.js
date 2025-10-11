import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Table,
  Button,
  Input,
} from "reactstrap";
import { FaFileImport } from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { ClipLoader } from "react-spinners";
import { importLeads } from "../../services/leadService";
import { getCampaignById } from "../../services/campaignService";

const ColumnMappingModal = ({
  isOpen,
  toggle,
  onImport,
  selectedCampaign,
  excelColumns = [],
  selectedFile,
}) => {
  const [mapping, setMapping] = useState({});
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCampaignFields = async () => {
      if (!selectedCampaign) {
        setFields([]);
        return;
      }

      try {
        setLoading(true);

        // Fetch campaign details to get the fields
        const response = await getCampaignById(selectedCampaign.value);

        if (!response || !response.length) {
          throw new Error("No campaign data found");
        }

        const campaignData = response[0];
        let parsedFields = [];

        // Parse fields from campaign data
        if (campaignData.fields) {
          if (typeof campaignData.fields === "string") {
            try {
              parsedFields = JSON.parse(campaignData.fields || "[]");
            } catch (e) {
              console.error("Failed to parse fields string:", e);
              parsedFields = [];
            }
          } else if (Array.isArray(campaignData.fields)) {
            parsedFields = campaignData.fields;
          }
        }

        console.log("Parsed fields:", parsedFields);
        setFields(parsedFields);

        // Initialize mapping with trimmed excel columns
        const trimmedExcelColumns = excelColumns.map((col) =>
          col ? col.toString().trim() : ""
        );

        const initialMapping = {};
        parsedFields.forEach((field) => {
          if (field && field.col_slug) {
            // Try to find matching column in Excel
            const matchedColumn = trimmedExcelColumns.find(
              (excelCol) =>
                excelCol.toLowerCase() === field.col_slug.toLowerCase() ||
                excelCol.toLowerCase() === field.col_name?.toLowerCase() ||
                excelCol.toLowerCase().includes(field.col_slug.toLowerCase()) ||
                excelCol.toLowerCase().includes(field.col_name?.toLowerCase())
            );

            initialMapping[field.col_slug] = matchedColumn || "";
          }
        });

        setMapping(initialMapping);
      } catch (error) {
        console.error("Error loading campaign fields:", error);
        toast.error("Failed to load campaign fields");
        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && selectedCampaign) {
      loadCampaignFields();
    }
  }, [selectedCampaign, excelColumns, isOpen]);

  const handleMappingChange = (field, value) => {
    setMapping((prev) => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  // Helper function to convert Excel serial date to YYYY-MM-DD
  const excelSerialDateToDate = (serial) => {
    if (!serial || isNaN(serial)) return "";
    const excelEpoch = new Date(1899, 11, 31);
    const daysInMs = serial * 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + daysInMs);
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaign || !selectedFile) {
      toast.error("No campaign or file selected");
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          console.log("Processing Excel data with mapping...");

          // Process data into the structure backend expects
          const mappedData = jsonData
            .map((row) => {
              const leadData = {};

              fields.forEach((field) => {
                const mappedColumn = mapping[field.col_slug];
                let value =
                  mappedColumn && row[mappedColumn] !== undefined
                    ? row[mappedColumn]
                    : "";

                // Handle date conversion if needed
                if (field.col_type === "date" && typeof value === "number") {
                  value = excelSerialDateToDate(value);
                }

                // Convert to proper type
                if (value !== null && value !== undefined) {
                  value = value.toString().trim();
                }

                leadData[field.col_slug] = value || "";
              });

              return {
                campaignName: selectedCampaign.label,
                leadData: leadData, // This is the key - wrap in leadData object
              };
            })
            .filter((item) => {
              // Filter out completely empty rows
              return Object.values(item.leadData).some(
                (val) => val && val.toString().trim() !== ""
              );
            });

          console.log("Mapped Data:", mappedData);

          if (mappedData.length === 0) {
            toast.error("No valid data found after processing.");
            setLoading(false);
            return;
          }

          // Create FormData and send as mappedData (like client leads endpoint)
          const formData = new FormData();
          formData.append("file", selectedFile); // Still send file for compatibility
          formData.append("mappedData", JSON.stringify(mappedData));

          console.log("Sending mappedData to backend...");
          const response = await importLeads(formData);

          console.log("Server Response:", response);

          const imported = response.imported || 0;
          const skipped = response.skipped || [];

          if (imported === 0 && skipped.length > 0) {
            const firstFewErrors = skipped
              .slice(0, 3)
              .map((skip) => `Row ${skip.row}: ${skip.reason}`)
              .join(", ");
            toast.error(
              `No leads imported. Issues: ${firstFewErrors}${
                skipped.length > 3 ? "..." : ""
              }`
            );
          } else {
            toast.success(
              `${imported} leads imported successfully. ${
                skipped.length > 0 ? `Skipped: ${skipped.length}` : ""
              }`
            );
          }

          onImport(response);
          toggle();
        } catch (error) {
          console.error("Error processing file:", error);
          toast.error("Failed to process file: " + error.message);
          setLoading(false);
        }
      };
      reader.readAsBinaryString(selectedFile);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.message || "Failed to import leads");
      setLoading(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="md"
      style={{ maxWidth: "550px" }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          <ClipLoader size={50} color="#0d6efd" />
        </div>
      )}
      <ModalHeader
        toggle={toggle}
        style={{ fontSize: "1.1rem", padding: "0.6rem" }}
      >
        Column Mapping - {selectedCampaign?.label || "No Campaign Selected"}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody style={{ padding: "0.6rem" }}>
          {fields.length > 0 ? (
            <Table bordered style={{ fontSize: "0.9rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.3rem" }}>Campaign Field</th>
                  <th style={{ padding: "0.3rem" }}>Excel Column</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.col_slug}>
                    <td style={{ padding: "0.3rem" }}>
                      <div>
                        <strong>{field.col_name}</strong>
                        {field.required && (
                          <span style={{ color: "red" }}> *</span>
                        )}
                        <br />
                        <small style={{ color: "#6c757d" }}>
                          ({field.col_slug})
                        </small>
                      </div>
                    </td>
                    <td style={{ padding: "0.3rem" }}>
                      <Input
                        type="select"
                        value={mapping[field.col_slug] || ""}
                        onChange={(e) =>
                          handleMappingChange(field.col_slug, e.target.value)
                        }
                        style={{
                          fontSize: "0.9rem",
                          padding: "0.3rem",
                          height: "30px",
                        }}
                        required={field.required}
                      >
                        <option value="">Select Column</option>
                        {excelColumns.map((col, index) => (
                          <option key={index} value={col}>
                            {col}
                          </option>
                        ))}
                      </Input>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-3">
              {selectedCampaign
                ? "No fields available for mapping. Please check your campaign configuration."
                : "Please select a campaign first."}
            </div>
          )}
        </ModalBody>
        <ModalFooter style={{ padding: "0.6rem" }}>
          <Button
            color="secondary"
            onClick={toggle}
            style={{ fontSize: "0.9rem", padding: "0.3rem 0.6rem" }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            style={{ fontSize: "0.9rem", padding: "0.3rem 0.6rem" }}
            disabled={fields.length === 0 || !selectedFile || loading}
          >
            <FaFileImport className="me-2" style={{ fontSize: "1rem" }} />
            {loading ? "Importing..." : "Confirm Mapping"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ColumnMappingModal;
