import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Container,
  FormGroup,
  Input,
} from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { createProduct, updateProduct } from "../../services/productService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCampaigns } from "../../services/orderService";
import { Rss } from "react-feather";

const productStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "converted", label: "Converted" },
  { value: "cancelled", label: "Cancelled" },
];

const NewProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productType: "",
    price: "",
    notes: "",
    status: { value: "pending", label: "Pending" },
    campaign_id: null,
  });

  const [campaignOptions, setCampaignOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const existingProduct = location.state?.product || null;

  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns();
        setCampaignOptions(campaigns);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (existingProduct) {
      setIsEditMode(true);
      setProductId(existingProduct.id);
      setFormData({
        productType: existingProduct.productType,
        price: existingProduct.price,
        notes: existingProduct.notes || "",
        status: {
          value: existingProduct.status,
          label:
            productStatusOptions.find(
              (opt) => opt.value === existingProduct.status
            )?.label || existingProduct.status,
        },
        campaign_id: {
          value: existingProduct.campaignId,
          label: existingProduct.campaign?.campaignName || "", // Adjust based on structure
        },
      });
    }
  }, [existingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (name, selected) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { productType, price, status, campaign_id } = formData;

    if (!productType || !price || !campaign_id?.value) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      productType,
      price: parseFloat(price),
      notes: formData.notes || "",
      status: status.value,
      campaignId: parseInt(campaign_id.value),
    };

    try {
      setIsLoading(true);
      if (isEditMode) {
        await updateProduct(productId, payload);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully!");
      }
      navigate("/all-products");
    } catch (err) {
      toast.error(err.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs
          title="Create Product"
          breadcrumbItems={[
            { title: "Products", link: "#" },
            { title: "Create Product", link: "#" },
          ]}
        />

        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Create New Product</h4>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Product Type *</Label>
                        <Input
                          type="text"
                          name="productType"
                          value={formData.productType}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <Label>Price *</Label>
                        <Input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Status</Label>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={(selected) =>
                            handleChange("status", selected)
                          }
                          options={productStatusOptions}
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <Label>Campaign *</Label>
                        <Select
                          name="campaign_id"
                          value={formData.campaign_id}
                          onChange={(selected) =>
                            handleChange("campaign_id", selected)
                          }
                          options={campaignOptions}
                          placeholder="Select Campaign"
                          isSearchable
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Notes</Label>
                        <Input
                          type="textarea"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows="3"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <Button color="primary" type="submit" disabled={isLoading}>
                      {isLoading
                        ? "Processing..."
                        : isEditMode
                        ? "Update Product"
                        : "Create Product"}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewProduct;
