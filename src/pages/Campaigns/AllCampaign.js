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
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCampaign, fetchCampaigns } from "../../services/campaignService";
// import { hasPermission } from "../../utils/permissionUtils";

const AllCampaigns = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("authuser"));

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchCampaigns();
        console.log("all Campaign", data);
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    loadCampaigns();
  }, []);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

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
          options: field.options
            ? field.options.join(" | ")
            : "Option 1 | Option 2",
        })) || [],
    };

    navigate("/create-campaign", { state: { editData } });
  };

  const filteredData = campaigns.filter((campaign) =>
    campaign.campaignName.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleDelete = async (campaignId) => {
    // if (!hasPermission(user, "campaign", "delete")) {
    //   toast.error("You do not have permission to delete campaigns.");
    //   return;
    // }
    try {
      await deleteCampaign(campaignId);
      toast.success("Campaign deleted successfully");
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (error) {
      toast.error("Error deleting campaign");
    }
  };

  const breadcrumbItems = [
    { title: "Campaigns", link: "/" },
    { title: "All Campaigns", link: "#" },
  ];

  const formatColumns = (fields) => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {fields.map((field, index) => (
          <span
            key={index}
            style={{
              backgroundColor: "#d6d8db",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
              fontWeight: "500",
              color: "#333",
            }}
          >
            {field.col_name}
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
                <table className="table table-bordered table-nowrap">
                  <thead className="table-light">
                    <tr>
                      <th>Campaign Name</th>
                      <th>Campaign Columns</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, entriesPerPage).map((row) => (
                      <tr key={row.id}>
                        <td style={{ color: "blue" }}>{row.campaignName}</td>
                        <td>{formatColumns(row.parsedFields || [])}</td>
                        <td>
                          <Button color="link" size="sm" className="p-0 me-2">
                            <FiEdit2
                              style={{ cursor: "pointer", marginRight: "10px" }}
                              onClick={() => handleEdit(row)}
                            />
                          </Button>
                          <Button
                            color="link"
                            size="sm"
                            className="p-0 text-danger"
                            onClick={() => handleDelete(row.id)}
                          >
                            <FiTrash2 size={16} />
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
