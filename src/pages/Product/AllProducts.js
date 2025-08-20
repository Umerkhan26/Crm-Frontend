import React, { useEffect, useState, useMemo } from "react";
import { Container, Card, CardBody, Spinner, Badge, Button } from "reactstrap";
import { deleteProduct, fetchAllProducts } from "../../services/productService";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";

import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirmDelete } = useDeleteConfirmation();
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      console.log("Alll", data);
      setProducts(data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);
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
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "",
        Cell: ({ row }) => <div>{row.index + 1}</div>,
        disableFilters: true,
      },
      {
        Header: "Product Type",
        accessor: "productType",
        disableFilters: true,
      },
      {
        Header: "Price",
        accessor: "price",
        disableFilters: true,
      },
      {
        Header: "Notes",
        accessor: "notes",
        disableFilters: true,
      },
      //   {
      //     Header: "Status",
      //     accessor: "status",
      //     disableFilters: true,
      //     Cell: ({ value }) => (
      //       <Badge
      //         color={
      //           value === "pending"
      //             ? "warning"
      //             : value === "converted"
      //             ? "success"
      //             : "danger"
      //         }
      //       >
      //         {value}
      //       </Badge>
      //     ),
      //   },
      {
        Header: "Campaign Name",
        accessor: "campaign.campaignName",
        disableFilters: true,
        Cell: ({ value }) => (
          <div
            style={{
              maxWidth: "120px",
            }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              className="px-2 py-1"
              onClick={() => handleEdit(row.original)}
            >
              <FiEdit2 size={14} />
            </Button>

            <Button
              color="danger"
              size="sm"
              className="px-2 py-1"
              onClick={() => handleDelete(row.original.id)}
            >
              <FaTrash size={14} />
            </Button>
          </div>
        ),
        width: 120,
      },
    ],
    []
  );

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
            ) : (
              <TableContainer
                columns={columns}
                data={products}
                isPagination={true}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
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
