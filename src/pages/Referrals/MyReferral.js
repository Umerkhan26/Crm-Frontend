import React, { useMemo, useState } from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Container } from "reactstrap";

const MyReferrals = () => {
  const [searchText, setSearchText] = useState("");

  const referralsData = useMemo(() => [], []);

  const filteredReferrals = useMemo(() => {
    return referralsData.filter((referral) =>
      Object.values(referral).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [referralsData, searchText]);

  const columns = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "fullName",
        disableFilters: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
      },
      {
        Header: "Date",
        accessor: "date",
        disableFilters: true,
      },
      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: () => (
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-primary">Edit</button>
            <button className="btn btn-sm btn-danger">Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Referrals", link: "#" },
    { title: "MyReferrals", link: "#" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="MY REFERRALS" breadcrumbItems={breadcrumbItems} />

          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <span className="me-2">Show</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                  >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <span className="ms-2">entries</span>
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>

              <TableContainer
                columns={columns || []}
                data={filteredReferrals || []}
                isPagination={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
                className="custom-table"
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MyReferrals;
