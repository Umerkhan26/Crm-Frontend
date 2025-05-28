// import React, { useState, useEffect } from "react";
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Button,
//   Label,
//   Container,
//   FormGroup,
//   Input,
// } from "reactstrap";
// import Select from "react-select";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { useLocation } from "react-router-dom";

// const NewOrder = () => {
//   const location = useLocation();
//   const editData = location.state?.editData;

//   const [formData, setFormData] = useState({
//     agent: "",
//     campaignType: null,
//     vendor: null,
//     assignedClient: null,
//     state: null,
//     PriorityLevel: null,
//     ageRange: "",
//     leadRequested: "",
//     fbLink: "",
//     notes: "",
//     date: "",
//   });

//   // Options for dropdowns
//   const campaignTypeOptions = [
//     {
//       value: "Callback Final Expense (Direct Mail)",
//       label: "Callback - Final Expense (Direct Mail)",
//     },
//     { value: "Callback - Final Expense", label: "Callback - Final Expense" },
//   ];

//   const vendorOptions = [
//     { value: "vender2secok", label: "Vendor2 Secok" },
//     { value: "juniadtariq", label: "Junaid Tariq" },
//   ];

//   const clientOptions = [{ value: "selectclient", label: "Select Client" }];

//   const stateOptions = [
//     { value: "AK", label: "AK" },
//     { value: "AL", label: "AL" },
//     { value: "AR", label: "AR" },
//     { value: "AZ", label: "AZ" },
//     { value: "CA", label: "CA" },
//     { value: "CO", label: "CO" },
//     { value: "CT", label: "CT" },
//     { value: "DC", label: "DC" },
//     { value: "DL", label: "DL" },
//     { value: "FL", label: "FL" },
//     { value: "GA", label: "GA" },
//     { value: "HI", label: "HI" },
//     { value: "ID", label: "ID" },
//     { value: "IL", label: "IL" },
//     { value: "IN", label: "IN" },
//     { value: "KS", label: "KS" },
//     { value: "KY", label: "KY" },
//     { value: "MA", label: "MA" },
//     { value: "MD", label: "MD" },
//     { value: "LA", label: "LA" },
//   ];

// const priorityOptions = [
//   { value: "Gold Agent", label: "Gold Agent" },
//   { value: "High", label: "High" },
//   { value: "Medium", label: "Medium" },
//   { value: "Low", label: "Low" },
//   { value: "Onhold", label: "On Hold" },
// ];

//   useEffect(() => {
//     if (editData) {
//       // Initialize form with edit data
//       setFormData({
//         agent: editData.agentName || "",
//         campaignType:
//           campaignTypeOptions.find(
//             (opt) =>
//               opt.value === editData.campaignType ||
//               opt.label === editData.campaignType
//           ) || null,
//         vendor:
//           vendorOptions.find((opt) => opt.label === editData.vendor) || null,
//         assignedClient: clientOptions[0], // Default client
//         state: stateOptions.find((opt) => opt.value === editData.state) || null,
//         PriorityLevel:
//           priorityOptions.find((opt) => opt.value === editData.PriorityLevel) ||
//           null,
//         ageRange: editData.ageRange || "",
//         leadRequested: editData.leadsRequested?.toString() || "",
//         fbLink: editData.fbLink || "",
//         notes: editData.notes || "",
//         date: editData.date || "",
//       });
//     }
//   }, [editData]);

//   const handleChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({
//       ...formData,
//       campaignType: formData.campaignType?.value,
//       vendor: formData.vendor?.value,
//       assignedClient: formData.assignedClient?.value,
//       state: formData.state?.value,
//       PriorityLevel: formData.PriorityLevel?.value,
//     });
//     // Submit logic here
//     alert(
//       editData ? "Order updated successfully!" : "Order created successfully!"
//     );
//   };

//   return (
//     <div className="page-content">
//       <Container fluid={true}>
//         <Breadcrumbs
//           title={editData ? "Edit Order" : "New Order"}
//           breadcrumbItems={[
//             { title: "Orders", link: "#" },
//             { title: editData ? "Edit Order" : "Create New Order", link: "#" },
//           ]}
//         />
//         <Row>
//           <Col xl="12">
//             <Card>
//               <CardBody>
//                 <h4 className="card-title mb-4">
//                   {editData ? "Edit Order" : "New Order"}
//                 </h4>
//                 <form onSubmit={handleSubmit}>
//                   {/* Agent and Campaign Type */}
//                   <Row>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Agent *</Label>
//                         <Input
//                           type="text"
//                           name="agent"
//                           value={formData.agent}
//                           onChange={handleInputChange}
//                           placeholder="Agent"
//                         />
//                       </FormGroup>
//                     </Col>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Campaign Type *</Label>
//                         <Select
//                           name="campaignType"
//                           value={formData.campaignType}
//                           onChange={(selected) =>
//                             handleChange("campaignType", selected)
//                           }
//                           options={campaignTypeOptions}
//                           placeholder="Select Campaign Type"
//                           isSearchable
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   <Row>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Assigned to Vendor *</Label>
//                         <Select
//                           name="vendor"
//                           value={formData.vendor}
//                           onChange={(selected) =>
//                             handleChange("vendor", selected)
//                           }
//                           options={vendorOptions}
//                           placeholder="Select Vendor"
//                           isSearchable
//                         />
//                       </FormGroup>
//                     </Col>

//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Assigned to Client *</Label>
//                         <Select
//                           name="assignedClient"
//                           value={formData.assignedClient}
//                           onChange={(selected) =>
//                             handleChange("assignedClient", selected)
//                           }
//                           options={clientOptions}
//                           placeholder="Select Client"
//                           isSearchable
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   {/* State and Priority Level */}
//                   <Row>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>State *</Label>
//                         <Select
//                           name="state"
//                           value={formData.state}
//                           onChange={(selected) =>
//                             handleChange("state", selected)
//                           }
//                           options={stateOptions}
//                           placeholder="Select State"
//                           isSearchable
//                         />
//                       </FormGroup>
//                     </Col>

//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Priority Level *</Label>
//                         <Select
//                           name="PriorityLevel"
//                           value={formData.PriorityLevel}
//                           onChange={(selected) =>
//                             handleChange("PriorityLevel", selected)
//                           }
//                           options={priorityOptions}
//                           placeholder="Select Priority Level"
//                           isSearchable
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   {/* Age Range & Lead Requested */}
//                   <Row>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Age Range</Label>
//                         <Input
//                           type="text"
//                           name="ageRange"
//                           value={formData.ageRange}
//                           onChange={handleInputChange}
//                         />
//                       </FormGroup>
//                     </Col>

//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Lead Requested</Label>
//                         <Input
//                           type="number"
//                           name="leadRequested"
//                           value={formData.leadRequested}
//                           onChange={handleInputChange}
//                           min="1"
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   {/* FB Link & Notes */}
//                   <Row>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>FB Link</Label>
//                         <Input
//                           type="text"
//                           name="fbLink"
//                           value={formData.fbLink}
//                           onChange={handleInputChange}
//                           placeholder="FB Link"
//                         />
//                       </FormGroup>
//                     </Col>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Notes & Area to Use for Order</Label>
//                         <Input
//                           type="textarea"
//                           name="notes"
//                           value={formData.notes}
//                           onChange={handleInputChange}
//                           rows="3"
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   {/* Date Input */}
//                   <Row>
//                     <Col md="6">
//                       <FormGroup>
//                         <Label>Date</Label>
//                         <Input
//                           type="date"
//                           name="date"
//                           value={formData.date}
//                           onChange={handleInputChange}
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   <hr />

//                   {/* Submit Button */}
//                   <div className="mt-4">
//                     <Button color="primary" type="submit">
//                       {editData ? "Update Order" : "Create Order"}
//                     </Button>
//                   </div>
//                 </form>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default NewOrder;

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
import { useLocation, useNavigate } from "react-router-dom";
import {
  createOrder,
  fetchCampaigns,
  updateOrder,
} from "../../services/orderService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewOrder = () => {
  const location = useLocation();
  const editData = location.state?.editData;

  const [formData, setFormData] = useState({
    agent: "",
    campaign_id: null,
    vendor: null,
    assignedClient: null,
    state: null,
    priorityLevel: null,
    ageRange: "",
    leadRequested: "",
    fbLink: "",
    notes: "",
    areaToUse: "",
    order_datetime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const navigate = useNavigate();

  const vendorOptions = [
    { value: 1, label: "Vendor2 Secok" },
    { value: 2, label: "Junaid Tariq" },
  ];

  const clientOptions = [{ value: 1, label: "Select Client" }];

  const stateOptions = [
    { value: "AK", label: "AK" },
    { value: "AL", label: "AL" },
    { value: "AR", label: "AR" },
    { value: "AZ", label: "AZ" },
    { value: "CA", label: "CA" },
    { value: "CO", label: "CO" },
    { value: "CT", label: "CT" },
    { value: "DC", label: "DC" },
    { value: "DL", label: "DL" },
    { value: "FL", label: "FL" },
    { value: "GA", label: "GA" },
    { value: "HI", label: "HI" },
    { value: "ID", label: "ID" },
    { value: "IL", label: "IL" },
    { value: "IN", label: "IN" },
    { value: "KS", label: "KS" },
    { value: "KY", label: "KY" },
    { value: "MA", label: "MA" },
    { value: "MD", label: "MD" },
    { value: "LA", label: "LA" },
  ];

  const priorityOptions = [
    { value: "Gold Agent", label: "Gold Agent" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
    { value: "Onhold", label: "On Hold" },
  ];

  // Fetch campaigns
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
    if (editData) {
      setFormData({
        agent: editData.agent || "",
        campaign_id:
          campaignOptions.find((opt) => opt.value === editData.campaign_id) ||
          null,
        vendor:
          vendorOptions.find((opt) => opt.label === editData.vendor) || null,
        assignedClient:
          clientOptions.find((opt) => opt.label === editData.assignedClient) ||
          null,
        state: stateOptions.find((opt) => opt.value === editData.state) || null,
        priorityLevel:
          priorityOptions.find((opt) => opt.value === editData.priorityLevel) ||
          null,
        ageRange: editData.ageRange || "",
        leadRequested: editData.leadRequested?.toString() || "",
        fbLink: editData.fbLink || "",
        notes: editData.notes || "",
        areaToUse: editData.area_to_use || "",
        order_datetime: editData.order_datetime
          ? editData.order_datetime.split("T")[0]
          : "",
      });
    }
  }, [editData, campaignOptions]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.agent.trim()) {
      toast.error("Please enter an agent name.");
      setIsLoading(false);
      return;
    }
    if (!formData.campaign_id) {
      toast.error("Please select a campaign.");
      setIsLoading(false);
      return;
    }
    if (!formData.state) {
      toast.error("Please select a state.");
      setIsLoading(false);
      return;
    }
    if (!formData.priorityLevel) {
      toast.error("Please select a priority level.");
      setIsLoading(false);
      return;
    }
    if (!formData.ageRange.trim()) {
      toast.error("Please enter an age range.");
      setIsLoading(false);
      return;
    }
    if (!formData.order_datetime) {
      toast.error("Please select an order date.");
      setIsLoading(false);
      return;
    }

    const payload = {
      agent: formData.agent,
      campaign_id: formData.campaign_id?.value,
      state: formData.state?.value,
      priority_level: formData.priorityLevel?.value,
      age_range: formData.ageRange,
      lead_requested: Number(formData.leadRequested),
      fb_link: formData.fbLink || undefined,
      notes: formData.notes || undefined,
      area_to_use: formData.areaToUse || undefined,
      order_datetime: new Date(formData.order_datetime).toISOString(),
      assign_to_client: formData.assignedClient
        ? {
            id: formData.assignedClient.value,
            name: formData.assignedClient.label,
          }
        : undefined,
      assign_to_vendor: formData.vendor
        ? { id: formData.vendor.value, name: formData.vendor.label }
        : undefined,
    };

    try {
      if (editData) {
        // Update existing order
        const result = await updateOrder(editData.id, payload);
        toast.success("Order updated successfully!");
        console.log("Updated Order:", result);

        navigate("/order-index");
      } else {
        const result = await createOrder(payload);
        toast.success("Order created successfully!");
        console.log("Created Order:", result);

        setFormData({
          agent: "",
          campaign_id: null,
          vendor: null,
          assignedClient: null,
          state: null,
          priorityLevel: null,
          ageRange: "",
          leadRequested: "",
          fbLink: "",
          notes: "",
          areaToUse: "",
          order_datetime: "",
        });
      }
    } catch (error) {
      console.error("Order submission error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Server error occurred";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs
          title={editData ? "Edit Order" : "New Order"}
          breadcrumbItems={[
            { title: "Orders", link: "#" },
            { title: editData ? "Edit Order" : "Create New Order", link: "#" },
          ]}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">
                  {editData ? "Edit Order" : "New Order"}
                </h4>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Agent *</Label>
                        <Input
                          type="text"
                          name="agent"
                          value={formData.agent}
                          onChange={handleInputChange}
                          placeholder="Agent"
                          required
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
                        <Label>Assigned to Vendor</Label>
                        <Select
                          name="vendor"
                          value={formData.vendor}
                          onChange={(selected) =>
                            handleChange("vendor", selected)
                          }
                          options={vendorOptions}
                          placeholder="Select Vendor"
                          isSearchable
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Assigned to Client</Label>
                        <Select
                          name="assignedClient"
                          value={formData.assignedClient}
                          onChange={(selected) =>
                            handleChange("assignedClient", selected)
                          }
                          options={clientOptions}
                          placeholder="Select Client"
                          isSearchable
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>State *</Label>
                        <Select
                          name="state"
                          value={formData.state}
                          onChange={(selected) =>
                            handleChange("state", selected)
                          }
                          options={stateOptions}
                          placeholder="Select State"
                          isSearchable
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Priority Level *</Label>
                        <Select
                          name="priorityLevel"
                          value={formData.priorityLevel}
                          onChange={(selected) =>
                            handleChange("priorityLevel", selected)
                          }
                          options={priorityOptions}
                          placeholder="Select Priority Level"
                          isSearchable
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Age Range *</Label>
                        <Input
                          type="text"
                          name="ageRange"
                          value={formData.ageRange}
                          onChange={handleInputChange}
                          placeholder="e.g., 18-25"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Lead Requested *</Label>
                        <Input
                          type="number"
                          name="leadRequested"
                          value={formData.leadRequested}
                          onChange={handleInputChange}
                          min="1"
                        ></Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>FB Link</Label>
                        <Input
                          type="text"
                          name="fbLink"
                          value={formData.fbLink}
                          onChange={handleInputChange}
                          placeholder="FB Link"
                        />
                      </FormGroup>
                    </Col>
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

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label> Date / Time *</Label>
                        <Input
                          type="date"
                          name="order_datetime"
                          value={formData.order_datetime}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <hr />

                  <div className="mt-4">
                    <Button color="primary" type="submit" disabled={isLoading}>
                      {isLoading
                        ? "Processing..."
                        : editData
                        ? "Update Order"
                        : "Create Order"}
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

export default NewOrder;
