import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Container,
  Input,
  Label,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCampaign, fetchCampaigns } from "../../services/campaignService";
import { FaTrash } from "react-icons/fa";
import { fetchAllOrders } from "../../services/orderService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

const AllCampaigns = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const { confirmDelete } = useDeleteConfirmation();

  // const user = JSON.parse(localStorage.getItem("authuser"));

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Orders
        const ordersData = await fetchAllOrders();
        setOrders(ordersData.data || []);

        // Load Campaigns
        const campaignsData = await fetchCampaigns();
        console.log("all Campaign", campaignsData);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const isCampaignLinked = (campaignId) => {
    if (!Array.isArray(orders)) return false;
    return orders.some((order) => order.campaign_id === campaignId);
  };

  const handleEdit = (campaign) => {
    const editData = {
      id: campaign.id,
      name: campaign.campaignName,
      columns:
        campaign.parsedFields.map((field) => ({
          name: field.col_name,
          slug: field.col_slug,
          type: field.col_type,
          defaultValue: field.default_value,
          options: field.options ? field.options.join(" | ") : " | ",
        })) || [],
    };

    navigate("/create-campaign", { state: { editData } });
  };

  const filteredData = campaigns.filter((campaign) =>
    campaign.campaignName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (campaignId) => {
    const isLinkedToOrder = orders.some(
      (order) => order.campaign_id === campaignId
    );

    if (isLinkedToOrder) {
      toast.error("Cannot delete: Campaign is linked to an order.");
      return;
    }

    const deleteFn = () => deleteCampaign(campaignId);
    const onSuccess = () =>
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));

    confirmDelete(deleteFn, onSuccess, "campaign");
  };

  const breadcrumbItems = [
    { title: "Campaigns", link: "/" },
    { title: "All Campaigns", link: "#" },
  ];

  const formatColumns = (fields) => {
    if (!Array.isArray(fields)) return <span>No columns</span>;

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {fields.map((field, index) => (
          <span
            key={index}
            style={{
              backgroundColor: "#d6d8db",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "0.6rem",
              whiteSpace: "nowrap",
              fontWeight: "500",
              color: "#333",
            }}
          >
            {field.col_name || "Unnamed Column"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="ALL CAMPAIGNS"
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="d-flex align-items-center">
                    <Label className="me-2">Show</Label>
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="btn-sm">
                        {entriesPerPage}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => setEntriesPerPage(10)}>
                          10
                        </DropdownItem>
                        <DropdownItem onClick={() => setEntriesPerPage(25)}>
                          25
                        </DropdownItem>
                        <DropdownItem onClick={() => setEntriesPerPage(50)}>
                          50
                        </DropdownItem>
                        <DropdownItem onClick={() => setEntriesPerPage(100)}>
                          100
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Label className="ms-2">entries</Label>
                  </div>
                </Col>
                <Col md={6} className="text-md-end">
                  <div className="d-inline-block">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: "200px" }}
                      className="form-control-sm"
                    />
                  </div>
                </Col>
              </Row>

              <div className="table-responsive">
                <table className="table table-bordered table-nowrap ">
                  <thead className="table-light">
                    <tr style={{ fontSize: "14px" }}>
                      <th>Campaign Name</th>
                      <th>Campaign Columns</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, entriesPerPage).map((row) => (
                      <tr key={row.id}>
                        <td style={{ fontSize: "13px" }}>
                          <button
                            onClick={() =>
                              navigate(`/order-index?campaign=${row.id}`)
                            }
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              padding: 0,
                              font: "inherit",
                            }}
                          >
                            {row.campaignName}
                          </button>
                        </td>

                        <td style={{ fontSize: "12px" }}>
                          {formatColumns(row.parsedFields || [])}
                        </td>
                        <td>
                          <Button
                            color="primary"
                            size="sm"
                            className="px-2 py-1 p-0 me-2"
                            onClick={() =>
                              !isCampaignLinked(row.id) && handleEdit(row)
                            }
                            disabled={isCampaignLinked(row.id)}
                            style={{
                              opacity: isCampaignLinked(row.id) ? 0.5 : 1,
                              cursor: isCampaignLinked(row.id)
                                ? "not-allowed"
                                : "pointer",
                            }}
                            title={
                              isCampaignLinked(row.id)
                                ? "Cannot edit: Campaign is linked to an order"
                                : "Edit campaign"
                            }
                          >
                            <FiEdit2 size={14} />
                          </Button>

                          <Button
                            color="danger"
                            size="sm"
                            className="px-2 py-1"
                            onClick={() => handleDelete(row.id)}
                          >
                            <FaTrash size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Showing{" "}
                  {filteredData.length > entriesPerPage
                    ? entriesPerPage
                    : filteredData.length}{" "}
                  of {filteredData.length} entries
                </div>
                <div>
                  <Button color="light" size="sm" className="me-1" disabled>
                    Previous
                  </Button>
                  <Button color="primary" size="sm" className="me-1">
                    1
                  </Button>
                  <Button color="light" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AllCampaigns;
