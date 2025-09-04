import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  Container,
  Card,
  CardBody,
  Spinner,
  Button,
  Badge,
  UncontrolledTooltip,
  Row,
  Col,
  Input,
} from "reactstrap";
import { FiTrash2 } from "react-icons/fi";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteSaleById, getAllSales } from "../../services/productService";
import { isAdmin } from "../../utils/permissions";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

const Sale = () => {
  const { confirmDelete } = useDeleteConfirmation();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [isAdminUser, setIsAdminUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser") || "{}");
    setIsAdminUser(isAdmin(user));
  }, []);

  const getSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSales({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: searchText,
      });

      console.log("Raw API response:", response);

      // Handle the normalized response format
      const records = response.data || [];
      const totalItems = response.totalItems || 0;
      const totalPages = response.totalPages || 1;
      const currentPage = response.currentPage || 1;

      console.log(
        "Initial records:",
        records.length,
        JSON.stringify(records, null, 2)
      );

      // Process records (no filtering needed as backend handles it)
      const processedRecords = records.map((sale, index) => {
        let parsedProducts = null;
        let parsedLeadData = {
          first_name: "N/A",
          last_name: "N/A",
          state: "N/A",
          phone_number: "N/A",
          email: "N/A",
        };
        try {
          if (sale.products && typeof sale.products === "string") {
            parsedProducts = JSON.parse(sale.products);
          }
          if (sale.Lead?.leadData && typeof sale.Lead.leadData === "string") {
            parsedLeadData = {
              ...parsedLeadData,
              ...JSON.parse(sale.Lead.leadData),
            };
          }
        } catch (error) {
          console.error(
            `Error parsing JSON for sale ID ${sale.id || index}:`,
            error
          );
          toast.warn(`Invalid data format for sale ID ${sale.id || index}`);
        }
        return {
          ...sale,
          parsedProducts: Array.isArray(parsedProducts) ? parsedProducts : null,
          parsedLeadData,
        };
      });

      console.log(
        "Processed records:",
        JSON.stringify(processedRecords, null, 2)
      );

      setSales(processedRecords);
      setPagination((prev) => ({
        ...prev,
        currentPage: currentPage, // Added currentPage update
        totalItems: totalItems,
        totalPages: totalPages, // Added totalPages update
      }));
    } catch (error) {
      console.error("Failed to fetch sales:", error.message);
      toast.error(`Failed to fetch sales: ${error.message}`);
      setSales([]);
      setPagination({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
      });
    } finally {
      setIsLoading(false);
      console.log("isLoading set to:", false);
    }
  }, [pagination.currentPage, pagination.pageSize, isAdminUser, searchText]);
  useEffect(() => {
    getSales();
  }, [getSales]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1,
    }));
  };
  const handleDelete = async (id) => {
    await confirmDelete(
      async () => {
        await deleteSaleById(id);
      },
      async () => {
        await getSales();
      },
      "sale"
    );
  };
  const navigateToSale = (id) => {
    navigate(`/sale-details/${id}`);
  };

  const renderClickableCell = (row, value, formatter) => {
    try {
      return (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigateToSale(row.original.id)}
        >
          {formatter ? formatter(value) : value || "N/A"}
        </div>
      );
    } catch (error) {
      console.error(
        `Error rendering cell for sale ID ${row.original.id}:`,
        error
      );
      return <div>Error</div>;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Customer",
        accessor: "parsedLeadData",
        disableFilters: true,
        Cell: ({ row, value }) =>
          renderClickableCell(row, value, (v) =>
            v
              ? `${v.first_name || "N/A"} ${v.last_name || "N/A"}`
              : "Unknown Customer"
          ),
      },
      {
        Header: "Product(s)",
        accessor: "productType",
        disableFilters: true,
        Cell: ({ row }) => {
          try {
            const { parsedProducts, productType } = row.original;
            let displayValue = productType || "N/A";
            let tooltipContent = productType || "N/A";
            if (parsedProducts && Array.isArray(parsedProducts)) {
              displayValue = `${parsedProducts.length} Product${
                parsedProducts.length > 1 ? "s" : ""
              }`;
              tooltipContent = parsedProducts
                .map(
                  (p) =>
                    `${p.productType || "N/A"} ($${parseFloat(
                      p.price || 0
                    ).toFixed(2)})`
                )
                .join(", ");
            }
            return (
              <>
                <div
                  id={`products-${row.original.id}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigateToSale(row.original.id)}
                >
                  {displayValue}
                </div>
                <UncontrolledTooltip target={`products-${row.original.id}`}>
                  {tooltipContent}
                </UncontrolledTooltip>
              </>
            );
          } catch (error) {
            console.error(
              `Error rendering products for sale ID ${row.original.id}:`,
              error
            );
            return <div>Error</div>;
          }
        },
      },
      {
        Header: "Total Price",
        accessor: "price",
        disableFilters: true,
        Cell: ({ row }) => {
          try {
            const { parsedProducts, price } = row.original;
            let totalPrice = price || 0;
            if (parsedProducts && Array.isArray(parsedProducts)) {
              totalPrice = parsedProducts.reduce(
                (sum, p) => sum + (parseFloat(p.price) || 0),
                0
              );
            }
            return renderClickableCell(
              row,
              totalPrice,
              (v) => `$${parseFloat(v || 0).toFixed(2)}`
            );
          } catch (error) {
            console.error(
              `Error rendering price for sale ID ${row.original.id}:`,
              error
            );
            return <div>Error</div>;
          }
        },
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ row, value }) =>
          renderClickableCell(row, value, (v) => (
            <Badge
              className={`text-uppercase ${
                v === "converted" ? "bg-success" : "bg-secondary"
              }`}
            >
              {v || "N/A"}
            </Badge>
          )),
      },
      ...(isAdminUser
        ? [
            {
              Header: "Campaign",
              accessor: "Lead.campaignName",
              disableFilters: true,
              Cell: ({ row, value }) =>
                renderClickableCell(row, value || "N/A"),
            },
            {
              Header: "Created By",
              accessor: "User.firstname",
              disableFilters: true,
              Cell: ({ row, value }) =>
                renderClickableCell(row, value || "N/A"),
            },
            {
              Header: "State",
              accessor: "parsedLeadData.state",
              disableFilters: true,
              Cell: ({ row, value }) =>
                renderClickableCell(row, value || "N/A"),
            },
          ]
        : []),
      {
        Header: "Conversion Date",
        accessor: "conversionDate",
        disableFilters: true,
        Cell: ({ row, value }) =>
          renderClickableCell(row, value, (v) =>
            v ? new Date(v).toLocaleDateString() : "N/A"
          ),
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="danger"
              size="sm"
              className="px-2 py-1"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              title="Delete"
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        ),
      },
    ],
    [isAdminUser]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Sales", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Sales" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md={3} className="ms-auto">
                <Input
                  type="text"
                  placeholder="Search sales..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  }}
                />
              </Col>
            </Row>

            {isLoading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
                <p>Loading sales...</p>
              </div>
            ) : (
              <TableContainer
                columns={columns}
                data={sales}
                isPagination={true}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={pagination.pageSize}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                className="custom-table"
                noDataMessage={
                  searchText
                    ? `No sales found for "${searchText}"`
                    : "No sales data available"
                }
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Sale;
