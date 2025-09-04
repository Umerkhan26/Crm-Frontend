import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Card, CardBody, Spinner, Badge, Button } from "reactstrap";
import { deleteProduct, fetchAllProducts } from "../../services/productService";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasAnyPermission } from "../../utils/permissions";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const { confirmDelete } = useDeleteConfirmation();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.Login?.user);
  const reduxPermissions = useSelector(
    (state) => state.Permissions?.permissions
  );

  const canUpdateProduct = hasAnyPermission(
    currentUser,
    ["product:update"],
    reduxPermissions
  );
  const canDeleteProduct = hasAnyPermission(
    currentUser,
    ["product:delete"],
    reduxPermissions
  );

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllProducts({
        page: pagination.currentPage,
        limit: pagination.pageSize,
      });

      const records = response.data || [];
      setProducts(records);

      setPagination((prev) => ({
        ...prev,
        currentPage: response.currentPage || 1,
        totalItems: response.totalItems || 0,
        totalPages: response.totalPages || 1,
      }));
    } catch (error) {
      toast.error(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEdit = (product) => {
    navigate("/create-product", { state: { product } });
  };

  const handleDelete = async (id) => {
    await confirmDelete(
      async () => {
        await deleteProduct(id);
      },
      async () => {
        await loadProducts();
      },
      "product"
    );
  };

  const showActionColumn = canUpdateProduct || canDeleteProduct;

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

  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "ID",
  //       accessor: "",
  //       Cell: ({ row }) => <div>{row.index + 1}</div>,
  //       disableFilters: true,
  //     },
  //     { Header: "Product Type", accessor: "productType", disableFilters: true },
  //     { Header: "Price", accessor: "price", disableFilters: true },
  //     { Header: "Notes", accessor: "notes", disableFilters: true },
  //     {
  //       Header: "Status",
  //       accessor: "status",
  //       disableFilters: true,
  //       Cell: ({ value }) => (
  //         <Badge color={value === "pending" ? "secondary" : "secondary"}>
  //           {value}
  //         </Badge>
  //       ),
  //     },
  //     {
  //       Header: "Campaign Name",
  //       accessor: "campaign.campaignName",
  //       disableFilters: true,
  //       Cell: ({ value }) => (
  //         <div style={{ maxWidth: "120px" }}>{value || "N/A"}</div>
  //       ),
  //     },
  //     {
  //       Header: "Action",
  //       disableFilters: true,
  //       Cell: ({ row }) => (
  //         <div className="d-flex gap-2">
  //           <Button
  //             color="primary"
  //             size="sm"
  //             className="px-2 py-1"
  //             onClick={() => handleEdit(row.original)}
  //           >
  //             <FiEdit2 size={14} />
  //           </Button>
  //           <Button
  //             color="danger"
  //             size="sm"
  //             className="px-2 py-1"
  //             onClick={() => handleDelete(row.original.id)}
  //           >
  //             <FaTrash size={14} />
  //           </Button>
  //         </div>
  //       ),
  //       width: 120,
  //     },
  //   ],
  //   []
  // );

  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "ID",
        accessor: "",
        Cell: ({ row }) => <div>{row.index + 1}</div>,
        disableFilters: true,
      },
      { Header: "Product Type", accessor: "productType", disableFilters: true },
      { Header: "Price", accessor: "price", disableFilters: true },
      { Header: "Notes", accessor: "notes", disableFilters: true },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ value }) => (
          <Badge color={value === "pending" ? "secondary" : "secondary"}>
            {value}
          </Badge>
        ),
      },
      {
        Header: "Campaign Name",
        accessor: "campaign.campaignName",
        disableFilters: true,
        Cell: ({ value }) => (
          <div style={{ maxWidth: "120px" }}>{value || "N/A"}</div>
        ),
      },
    ];

    if (showActionColumn) {
      baseColumns.push({
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            {canUpdateProduct && (
              <Button
                color="primary"
                size="sm"
                className="px-2 py-1"
                onClick={() => handleEdit(row.original)}
              >
                <FiEdit2 size={14} />
              </Button>
            )}
            {canDeleteProduct && (
              <Button
                color="danger"
                size="sm"
                className="px-2 py-1"
                onClick={() => handleDelete(row.original.id)}
              >
                <FaTrash size={14} />
              </Button>
            )}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [canUpdateProduct, canDeleteProduct, showActionColumn]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Products", link: "#" },
    { title: "All Products", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ALL PRODUCTS" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            {loading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h4>No products available</h4>
                <p>
                  No pending products found. Create a new product to get
                  started.
                </p>
              </div>
            ) : (
              <TableContainer
                columns={columns}
                data={products}
                isPagination={true}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={pagination.pageSize}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                className="custom-table"
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AllProducts;
