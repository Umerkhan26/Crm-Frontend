// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   Table,
//   Button,
//   Input,
// } from "reactstrap";
// import { FaFileImport } from "react-icons/fa";

// const ColumnMappingModal = ({
//   isOpen,
//   toggle,
//   onImport,
//   selectedOrder,
//   excelColumns = [], // Receive columns from parent component
// }) => {
//   const [mapping, setMapping] = useState({});
//   const [fields, setFields] = useState([]);

//   useEffect(() => {
//     if (selectedOrder && selectedOrder.campaign) {
//       try {
//         const parsedFields = JSON.parse(selectedOrder.campaign.fields);
//         setFields(parsedFields);

//         // Initialize mapping with empty values
//         const initialMapping = {};
//         parsedFields.forEach((field) => {
//           initialMapping[field.col_slug] = "";
//         });
//         setMapping(initialMapping);
//       } catch (error) {
//         console.error("Error parsing campaign fields:", error);
//         setFields([]);
//       }
//     }
//   }, [selectedOrder]);

//   const handleMappingChange = (field, value) => {
//     setMapping((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedOrder) {
//       onImport({
//         file: null,
//         mapping,
//         fields, // Pass the fields structure along with mapping
//       });
//       toggle();
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       toggle={toggle}
//       size="md"
//       style={{ maxWidth: "550px" }}
//     >
//       <ModalHeader
//         toggle={toggle}
//         style={{ fontSize: "1.1rem", padding: "0.6rem" }}
//       >
//         Column Mapping
//       </ModalHeader>
//       <Form onSubmit={handleSubmit}>
//         <ModalBody style={{ padding: "0.6rem" }}>
//           {fields.length > 0 ? (
//             <Table bordered style={{ fontSize: "0.9rem" }}>
//               <thead>
//                 <tr>
//                   <th style={{ padding: "0.3rem", marginLeft: "-5px" }}>
//                     Fields
//                   </th>
//                   <th style={{ padding: "0.3rem" }}>Mapping Fields</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fields.map((field) => (
//                   <tr key={field.col_slug}>
//                     <td style={{ padding: "0.3rem" }}>
//                       {field.col_name}
//                       {/* <small className="text-muted d-block">
//                         {field.col_slug}
//                       </small> */}
//                     </td>
//                     <td style={{ padding: "0.3rem" }}>
//                       <Input
//                         type="select"
//                         value={mapping[field.col_slug] || ""}
//                         onChange={(e) =>
//                           handleMappingChange(field.col_slug, e.target.value)
//                         }
//                         style={{
//                           fontSize: "0.9rem",
//                           padding: "0.3rem",
//                           height: "30px",
//                         }}
//                       >
//                         <option value=""> Blink </option>
//                         {excelColumns.map((col, index) => (
//                           <option key={index} value={col}>
//                             {col}
//                           </option>
//                         ))}
//                         {/* Option to keep original field name if not found in Excel */}
//                         {!excelColumns.includes(field.col_slug) && (
//                           <option value={field.col_slug}>
//                             Use default ({field.col_slug})
//                           </option>
//                         )}
//                       </Input>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <div className="text-center py-3">
//               No fields available for mapping. Please check your campaign
//               configuration.
//             </div>
//           )}
//         </ModalBody>
//         <ModalFooter style={{ padding: "0.6rem" }}>
//           <Button
//             color="secondary"
//             onClick={toggle}
//             style={{ fontSize: "0.9rem", padding: "0.3rem 0.6rem" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             color="primary"
//             type="submit"
//             style={{ fontSize: "0.9rem", padding: "0.3rem 0.6rem" }}
//             disabled={fields.length === 0}
//           >
//             <FaFileImport className="me-2" style={{ fontSize: "1rem" }} />
//             Confirm Mapping
//           </Button>
//         </ModalFooter>
//       </Form>
//     </Modal>
//   );
// };

// export default ColumnMappingModal;
// components/Modals/ColumnMappingModal.tsx

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
import { importClientLeads } from "../../services/orderService";

const ColumnMappingModal = ({
  isOpen,
  toggle,
  onImport,
  selectedOrder,
  excelColumns = [],
  selectedFile,
}) => {
  const [mapping, setMapping] = useState({});
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (selectedOrder && selectedOrder.campaign) {
      try {
        const parsedFields = JSON.parse(selectedOrder.campaign.fields || "[]");
        console.log("Parsed campaign fields:", parsedFields);
        // Trim excelColumns to handle trailing spaces
        const trimmedExcelColumns = excelColumns.map((col) => col.trim());
        console.log("Trimmed Excel columns:", trimmedExcelColumns);
        setFields(parsedFields);
        const initialMapping = {};
        parsedFields.forEach((field) => {
          // Auto-map if column exists in trimmedExcelColumns
          initialMapping[field.col_slug] = trimmedExcelColumns.includes(
            field.col_slug
          )
            ? field.col_slug
            : "";
        });
        console.log("Initial mapping:", initialMapping);
        setMapping(initialMapping);
      } catch (error) {
        console.error("Error parsing campaign fields:", error);
        toast.error("Failed to parse campaign fields");
        setFields([]);
      }
    }
  }, [selectedOrder, excelColumns]);

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
    if (!selectedOrder || !selectedFile) {
      toast.error("No order or file selected");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          console.log("Parsed Excel data:", jsonData);

          // Validate mapping
          const requiredFields = ["first_name", "last_name", "agent_name"];
          const missingMappings = requiredFields.filter(
            (field) => !mapping[field]
          );
          if (missingMappings.length > 0) {
            toast.error(
              `Please map required fields: ${missingMappings.join(", ")}`
            );
            return;
          }

          // Create leadData based on mapping
          const mappedData = jsonData.map((row) => {
            const leadData = {};
            fields.forEach((field) => {
              const mappedColumn = mapping[field.col_slug];
              let value =
                mappedColumn && row[mappedColumn.trim()] !== undefined
                  ? row[mappedColumn.trim()]
                  : "";
              if (field.col_slug === "date" && typeof value === "number") {
                value = excelSerialDateToDate(value);
              }
              leadData[field.col_slug] = value;
            });
            return { leadData };
          });
          console.log("Mapped data to send:", mappedData);

          // Send to backend
          const response = await importClientLeads(
            selectedFile,
            selectedOrder.id,
            mappedData
          );
          console.log("Backend response:", response);

          const imported = response.imported || 0;
          const skipped = response.skipped || [];
          toast.success(
            `${imported} client leads imported successfully. Skipped: ${skipped.length}`
          );

          onImport(response);
          toggle();
        } catch (error) {
          console.error("Error processing file:", error);
          toast.error("Failed to process file: " + error.message);
        }
      };
      reader.readAsBinaryString(selectedFile);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.message || "Failed to import leads");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="md"
      style={{ maxWidth: "550px" }}
    >
      <ModalHeader
        toggle={toggle}
        style={{ fontSize: "1.1rem", padding: "0.6rem" }}
      >
        Column Mapping
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody style={{ padding: "0.6rem" }}>
          {fields.length > 0 ? (
            <Table bordered style={{ fontSize: "0.9rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.3rem" }}>Fields</th>
                  <th style={{ padding: "0.3rem" }}>Mapping Fields</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.col_slug}>
                    <td style={{ padding: "0.3rem" }}>{field.col_name}</td>
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
                      >
                        <option value="">Select Column</option>
                        {excelColumns.map((col, index) => (
                          <option key={index} value={col}>
                            {col}
                          </option>
                        ))}
                        {!excelColumns.includes(field.col_slug) && (
                          <option value={field.col_slug}>
                            Use default ({field.col_slug})
                          </option>
                        )}
                      </Input>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-3">
              No fields available for mapping. Please check your campaign
              configuration.
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
            disabled={fields.length === 0 || !selectedFile}
          >
            <FaFileImport className="me-2" style={{ fontSize: "1rem" }} />
            Confirm Mapping
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ColumnMappingModal;
