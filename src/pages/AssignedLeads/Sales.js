import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { FiTrash2 } from "react-icons/fi";
import TableContainer from "../../components/Common/TableContainer";

const Sale = ({
  sales,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDelete,
  isLoading,
}) => {
  const columns = useMemo(
    () => [
      {
        Header: "Product Type",
        accessor: "productType",
        disableFilters: true,
        Cell: ({ value }) => <div>{value}</div>,
      },
      {
        Header: "Price",
        accessor: "price",
        disableFilters: true,
        Cell: ({ value }) => <div>${value.toFixed(2)}</div>,
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ value }) => (
          <span
            className={`badge ${
              value === "converted"
                ? "bg-success"
                : value === "pending"
                ? "bg-warning"
                : "bg-danger"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Lead Campaign",
        accessor: "Lead.campaignName",
        disableFilters: true,
        Cell: ({ value }) => <div>{value || "N/A"}</div>,
      },
      {
        Header: "Created By",
        accessor: "User.firstname",
        disableFilters: true,
        Cell: ({ value }) => <div>{value || "N/A"}</div>,
      },
      {
        Header: "Conversion Date",
        accessor: "conversionDate",
        disableFilters: true,
        Cell: ({ value }) => <div>{new Date(value).toLocaleDateString()}</div>,
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            {/* <Button
              color="primary"
              size="sm"
              className="px-2"
              onClick={() => onEdit(row.original)}
              title="Edit"
            >
              <FiEdit2 size={14} />
            </Button> */}
            <Button
              color="danger"
              size="sm"
              className="px-2"
              onClick={() => onDelete(row.original.id)}
              title="Delete"
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete]
  );

  return (
    <TableContainer
      columns={columns}
      data={sales}
      isPagination={true}
      iscustomPageSize={false}
      isBordered={false}
      customPageSize={pagination.pageSize}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      className="custom-table"
      isLoading={isLoading}
    />
  );
};

export default Sale;
