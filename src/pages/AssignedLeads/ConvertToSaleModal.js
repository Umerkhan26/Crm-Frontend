import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Input,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import {
  convertLeadToSale,
  fetchAllProducts,
} from "../../services/productService";
import { toast } from "react-toastify";

const ConvertToSaleModal = ({
  isOpen,
  toggle,
  leadId,
  campaignId,
  assigneeId,
  products,
  onSubmit,
  onError,
}) => {
  const [productNames, setProductNames] = useState([]);
  const [saleItems, setSaleItems] = useState([
    { productName: "", price: "", notes: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await fetchAllProducts({ page: 1, limit: 20 });
        const allProducts = result?.data || [];

        const names = Array.from(
          new Set(
            allProducts
              .map((item) => item.productType)
              .filter((name) => name && name.trim() !== "")
          )
        );

        setProductNames(names);

        if (
          names.length === 1 &&
          saleItems.length === 1 &&
          !saleItems[0].productName
        ) {
          setSaleItems([{ productName: names[0], price: "", notes: "" }]);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      setSaleItems([{ productName: "", price: "", notes: "" }]);
      loadProducts();
    }
  }, [isOpen]);

  const handleAddRow = () => {
    setSaleItems([...saleItems, { productName: "", price: "", notes: "" }]);
  };

  const handleRemoveRow = (index) => {
    if (saleItems.length === 1) {
      toast.warning("You need at least one product");
      return;
    }
    const newItems = [...saleItems];
    newItems.splice(index, 1);
    setSaleItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...saleItems];
    newItems[index][field] = value;
    setSaleItems(newItems);
  };

  const handleSubmit = async () => {
    // Validate all fields
    const validationErrors = [];

    saleItems.forEach((item, index) => {
      if (!item.productName?.trim()) {
        validationErrors.push(`Product #${index + 1}: Please select a product`);
      }
      if (!item.price || isNaN(Number(item.price))) {
        validationErrors.push(
          `Product #${index + 1}: Please enter a valid price`
        );
      }
      if (Number(item.price) <= 0) {
        validationErrors.push(
          `Product #${index + 1}: Price must be greater than 0`
        );
      }
    });

    if (validationErrors.length > 0) {
      toast.warning(validationErrors.join("\n"));
      return;
    }

    // Prepare payload
    const payload = {
      leadId,
      campaignId,
      assigneeId,
      products: saleItems.map((item) => ({
        productType: item.productName.trim(),
        price: Number(item.price),
        notes: item.notes?.trim() || "",
      })),
      // For backward compatibility with single-product API
      productType: saleItems[0]?.productName?.trim() || "",
      price: saleItems[0]?.price ? Number(saleItems[0].price) : 0,
    };

    try {
      setSubmitting(true);
      const result = await convertLeadToSale(payload);

      if (result.success) {
        // toast.success("Lead converted to sale successfully!");
        onSubmit({
          leadId,
          newStatus: "sold",
          result,
          targetUserId: assigneeId,
        });
        toggle();
      } else {
        throw new Error(result.message || "Conversion failed");
      }
    } catch (err) {
      console.error("Conversion error details:", {
        error: err,
        payloadSent: payload,
        time: new Date().toISOString(),
      });
      toast.error(
        err.message ||
          "Failed to convert lead to sale. Please check console for details."
      );
      if (onError) onError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader
        toggle={toggle}
        className="py-2"
        style={{ fontSize: "0.9rem" }}
      ></ModalHeader>
      <ModalBody className="p-2">
        {loading ? (
          <div className="text-center py-2">
            <Spinner size="sm" />
          </div>
        ) : (
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {saleItems.map((item, index) => (
              <div key={index} className="mb-2 p-1 border rounded">
                <Row className="g-1 align-items-center">
                  <Col xs={5}>
                    <FormGroup className="mb-0">
                      <Input
                        type="select"
                        bsSize="sm"
                        value={item.productName}
                        onChange={(e) =>
                          handleItemChange(index, "productName", e.target.value)
                        }
                      >
                        {productNames.map((name, idx) => (
                          <option key={idx} value={name}>
                            {name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs={3}>
                    <FormGroup className="mb-0">
                      <Input
                        type="number"
                        bsSize="sm"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={3}>
                    <FormGroup className="mb-0">
                      <Input
                        type="text"
                        bsSize="sm"
                        placeholder="Notes"
                        value={item.notes}
                        onChange={(e) =>
                          handleItemChange(index, "notes", e.target.value)
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={1} className="text-center">
                    <Button
                      color="link"
                      size="sm"
                      onClick={() => handleRemoveRow(index)}
                      disabled={saleItems.length === 1}
                      className="p-0"
                      style={{ color: "#dc3545" }}
                    >
                      <i className="mdi mdi-delete-outline" />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            <Button
              color="link"
              size="sm"
              onClick={handleAddRow}
              className="mt-1 p-0"
            >
              <i className="mdi mdi-plus-circle-outline me-1" />
              Add product
            </Button>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="py-2">
        <Button
          color="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={loading || submitting}
          className="px-3"
        >
          {submitting ? <Spinner size="sm" /> : "Submit"}
        </Button>
        <Button
          color="secondary"
          size="sm"
          onClick={toggle}
          disabled={submitting}
          className="px-3"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConvertToSaleModal;
