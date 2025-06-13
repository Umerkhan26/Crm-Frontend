// import React, { Fragment } from "react";
// import PropTypes from "prop-types";
// import {
//   useTable,
//   useGlobalFilter,
//   useAsyncDebounce,
//   useSortBy,
//   useFilters,
//   useExpanded,
//   usePagination,
// } from "react-table";
// import { Table, Row, Col, Button, Input } from "reactstrap";
// import { Filter, DefaultColumnFilter } from "./filters";
// import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter";

// // Define a default UI for filtering
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
//   isJobListGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length;
//   const [value, setValue] = React.useState(globalFilter);
//   const onChange = useAsyncDebounce((value) => {
//     setGlobalFilter(value || undefined);
//   }, 200);

//   return (
//     <React.Fragment>
//       <Col md={4}>
//         <div className="search-box me-xxl-2 my-3 my-xxl-0 d-inline-block">
//           <div className="position-relative">
//             <label htmlFor="search-bar-0" className="search-label">
//               <span id="search-bar-0-label" className="sr-only">
//                 Search this table
//               </span>
//               <input
//                 onChange={(e) => {
//                   setValue(e.target.value);
//                   onChange(e.target.value);
//                 }}
//                 id="search-bar-0"
//                 type="text"
//                 className="form-control"
//                 placeholder={`${count} records...`}
//                 value={value || ""}
//               />
//             </label>
//             <i className="bx bx-search-alt search-icon"></i>
//           </div>
//         </div>
//       </Col>
//       {isJobListGlobalFilter && <JobListGlobalFilter />}
//     </React.Fragment>
//   );
// }

// const TableContainer = ({
//   columns,
//   data,
//   isGlobalFilter,
//   isJobListGlobalFilter,
//   isAddOptions,
//   isAddUserList,
//   handleOrderClicks,
//   handleUserClick,
//   handleCustomerClick,
//   isAddCustList,
//   customPageSize,
//   className,
//   customPageSizeOptions,
// }) => {
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state,
//     preGlobalFilteredRows,
//     setGlobalFilter,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn: { Filter: DefaultColumnFilter },
//       initialState: {
//         pageIndex: 0,
//         pageSize: customPageSize,
//         // sortBy: [
//         //   {
//         //     desc: false,
//         //   },
//         // ],
//       },
//     },
//     useGlobalFilter,
//     useFilters,
//     useSortBy,
//     useExpanded,
//     usePagination
//   );

//   const generateSortingIndicator = (column) => {
//     return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
//   };

//   const onChangeInSelect = (event) => {
//     setPageSize(Number(event.target.value));
//   };

//   const onChangeInInput = (event) => {
//     const page = event.target.value ? Number(event.target.value) - 1 : 0;
//     gotoPage(page);
//   };

//   return (
//     <Fragment>
//       <div className="table-responsive react-table">
//         <Table bordered hover {...getTableProps()} className={className}>
//           <thead className="table-light table-nowrap">
//             {headerGroups.map((headerGroup) => {
//               const headerGroupProps = headerGroup.getHeaderGroupProps();
//               const { key, ...restHeaderGroupProps } = headerGroupProps;

//               return (
//                 <tr key={key} {...restHeaderGroupProps}>
//                   {headerGroup.headers.map((column) => (
//                     <th key={column.id}>
//                       <div className="mb-2" {...column.getSortByToggleProps()}>
//                         {column.render("Header")}
//                         {generateSortingIndicator(column)}
//                       </div>
//                       <Filter column={column} />
//                     </th>
//                   ))}
//                 </tr>
//               );
//             })}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {page.map((row) => {
//               prepareRow(row);
//               const rowProps = row.getRowProps();
//               const { key, ...restRowProps } = rowProps;

//               return (
//                 <Fragment key={key}>
//                   <tr {...restRowProps}>
//                     {row.cells.map((cell) => {
//                       const cellProps = cell.getCellProps();
//                       const { key, ...restCellProps } = cellProps;

//                       return (
//                         <td key={key} {...restCellProps}>
//                           {cell.render("Cell")}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 </Fragment>
//               );
//             })}
//           </tbody>
//         </Table>
//       </div>

//       <Row className="justify-content-md-end justify-content-center align-items-center">
//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button
//               color="primary"
//               onClick={() => gotoPage(0)}
//               disabled={!canPreviousPage}
//             >
//               {"<<"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={previousPage}
//               disabled={!canPreviousPage}
//             >
//               {"<"}
//             </Button>
//           </div>
//         </Col>
//         <Col className="col-md-auto d-none d-md-block">
//           Page{" "}
//           <strong>
//             {pageIndex + 1} of {pageOptions.length}
//           </strong>
//         </Col>
//         <Col className="col-md-auto">
//           <Input
//             type="number"
//             min={1}
//             style={{ width: 70 }}
//             max={pageOptions.length}
//             defaultValue={pageIndex + 1}
//             onChange={onChangeInInput}
//           />
//         </Col>

//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
//               {">"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={() => gotoPage(pageCount - 1)}
//               disabled={!canNextPage}
//             >
//               {">>"}
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Fragment>
//   );
// };

// TableContainer.propTypes = {
//   preGlobalFilteredRows: PropTypes.any,
// };

// export default TableContainer;

// import React, { Fragment } from "react";
// import PropTypes from "prop-types";
// import {
//   useTable,
//   useGlobalFilter,
//   useSortBy,
//   useFilters,
//   useExpanded,
//   usePagination,
// } from "react-table";
// import { Table, Row, Col, Button, Input } from "reactstrap";
// import { Filter, DefaultColumnFilter } from "./filters";

// const TableContainer = ({ columns, data, customPageSize, className }) => {
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     state: { pageIndex },
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn: { Filter: DefaultColumnFilter },
//       initialState: {
//         pageIndex: 0,
//         pageSize: customPageSize,
//       },
//     },
//     useGlobalFilter,
//     useFilters,
//     useSortBy,
//     useExpanded,
//     usePagination
//   );

//   const generateSortingIndicator = (column) => {
//     return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
//   };

//   const onChangeInInput = (event) => {
//     const page = event.target.value ? Number(event.target.value) - 1 : 0;
//     gotoPage(page);
//   };

//   return (
//     <Fragment>
//       <div className="table-responsive react-table">
//         <Table
//           bordered
//           hover
//           {...getTableProps()}
//           className={className}
//           style={{ fontSize: "0.825rem", tableLayout: "auto" }}
//         >
//           <thead className="table-light table-nowrap">
//             {headerGroups.map((headerGroup) => (
//               <tr {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map((column) => (
//                   <th
//                     key={column.id}
//                     style={{ fontSize: "0.725rem", fontWeight: "bold" }}
//                   >
//                     <div
//                       className="mb-2"
//                       {...column.getSortByToggleProps()}
//                       style={{
//                         padding: "0.1rem 0.1rem",
//                       }}
//                     >
//                       {column.render("Header")}
//                       {generateSortingIndicator(column)}
//                     </div>
//                     <Filter column={column} />
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {page.map((row) => {
//               prepareRow(row);
//               return (
//                 <tr {...row.getRowProps()}>
//                   {row.cells.map((cell) => (
//                     <td
//                       key={cell.column.id}
//                       {...cell.getCellProps()}
//                       style={{
//                         padding: "0.4rem 0.4rem",
//                       }}
//                     >
//                       {cell.render("Cell")}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       </div>

//       <Row className="justify-content-md-end justify-content-center align-items-center">
//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button
//               color="primary"
//               onClick={() => gotoPage(0)}
//               disabled={!canPreviousPage}
//             >
//               {"<<"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={previousPage}
//               disabled={!canPreviousPage}
//             >
//               {"<"}
//             </Button>
//           </div>
//         </Col>
//         <Col className="col-md-auto d-none d-md-block">
//           Page{" "}
//           <strong>
//             {pageIndex + 1} of {pageOptions.length}
//           </strong>
//         </Col>
//         <Col className="col-md-auto">
//           <Input
//             type="number"
//             min={1}
//             style={{ width: 60 }}
//             max={pageOptions.length}
//             defaultValue={pageIndex + 1}
//             onChange={onChangeInInput}
//           />
//         </Col>
//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
//               {">"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={() => gotoPage(pageCount - 1)}
//               disabled={!canNextPage}
//             >
//               {">>"}
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Fragment>
//   );
// };

// TableContainer.propTypes = {
//   columns: PropTypes.array.isRequired,
//   data: PropTypes.array.isRequired,
//   isJobListGlobalFilter: PropTypes.bool,
//   customPageSize: PropTypes.number,
//   className: PropTypes.string,
// };

// TableContainer.defaultProps = {
//   isJobListGlobalFilter: false,
//   customPageSize: 10,
//   className: "",
// };

// export default TableContainer;

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
} from "react-table";
import {
  Table,
  Row,
  Col,
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";

const TableContainer = ({
  columns,
  data,
  isPagination,
  iscustomPageSize,
  className,
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn: { Filter: DefaultColumnFilter },
      },
      useGlobalFilter,
      useFilters,
      useSortBy,
      useExpanded
    );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) : 1;
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange(page);
    }
  };

  const [pageSizeDropdownOpen, setPageSizeDropdownOpen] = React.useState(false);
  const togglePageSizeDropdown = () =>
    setPageSizeDropdownOpen((prevState) => !prevState);

  const pageSizes = [10, 25, 50, 100];

  return (
    <Fragment>
      <div className="table-responsive react-table">
        <Table
          bordered
          hover
          {...getTableProps()}
          className={className}
          style={{ fontSize: "0.825rem", tableLayout: "auto" }}
        >
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    style={{ fontSize: "0.725rem", fontWeight: "bold" }}
                  >
                    <div
                      className="mb-2"
                      {...column.getSortByToggleProps()}
                      style={{
                        padding: "0.1rem 0.1rem",
                      }}
                    >
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      key={cell.column.id}
                      {...cell.getCellProps()}
                      style={{
                        padding: "0.4rem 0.4rem",
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {isPagination && (
        <Row className="justify-content-md-end justify-content-center align-items-center mt-3">
          <Col md={3} className="d-flex align-items-center">
            <span className="me-2">Show:</span>
            <Dropdown
              isOpen={pageSizeDropdownOpen}
              toggle={togglePageSizeDropdown}
            >
              <DropdownToggle caret color="light" className="py-1 px-2">
                {pagination.pageSize}
              </DropdownToggle>
              <DropdownMenu>
                {pageSizes.map((size) => (
                  <DropdownItem
                    key={size}
                    active={pagination.pageSize === size}
                    onClick={() => {
                      onPageSizeChange(size);
                      onPageChange(1); // Reset to first page when changing page size
                    }}
                  >
                    {size}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <span className="ms-2">entries</span>
          </Col>

          <Col md={6} className="d-flex justify-content-center">
            <div className="d-flex align-items-center gap-2">
              <Button
                color="primary"
                onClick={() => onPageChange(1)}
                disabled={pagination.currentPage === 1}
                size="sm"
              >
                {"<<"}
              </Button>
              <Button
                color="primary"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                size="sm"
              >
                {"<"}
              </Button>

              <div className="mx-2 d-flex align-items-center">
                <span className="me-2">Page</span>
                <Input
                  type="number"
                  min={1}
                  max={pagination.totalPages}
                  value={pagination.currentPage}
                  onChange={onChangeInInput}
                  style={{ width: "60px" }}
                  bsSize="sm"
                />
                <span className="ms-2">of {pagination.totalPages}</span>
              </div>

              <Button
                color="primary"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  pagination.totalPages === 0
                }
                size="sm"
              >
                {">"}
              </Button>
              <Button
                color="primary"
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  pagination.totalPages === 0
                }
                size="sm"
              >
                {">>"}
              </Button>
            </div>
          </Col>

          <Col md={3} className="text-md-end">
            <span>Total: {pagination.totalItems} items</span>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  isPagination: PropTypes.bool,
  iscustomPageSize: PropTypes.bool,
  className: PropTypes.string,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }),
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

TableContainer.defaultProps = {
  isPagination: false,
  iscustomPageSize: false,
  className: "",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  },
  onPageChange: () => {},
  onPageSizeChange: () => {},
};

export default TableContainer;
