// components/LeadStatusSummary.js
import React from "react";
import { Card, CardBody, Row, Col, Spinner } from "reactstrap";

const LeadStatusSummary = ({ summary, loading }) => {
  if (loading) return <Spinner color="primary" />;
  if (!summary) return null;

  const statusColors = {
    pending: "warning",
    sold: "success",
    most_interested: "primary",
    to_call: "info",
  };

  return (
    <Card>
      <CardBody>
        <h5 className="card-title mb-4">Lead Status Summary</h5>
        <Row>
          {Object.entries(summary.statusCounts).map(([status, count]) => (
            <Col key={status} md={3} className="mb-3">
              <div
                className={`border p-3 rounded bg-${statusColors[status]}-subtle`}
              >
                <h6 className="text-uppercase text-muted">
                  {status.replace(/_/g, " ")}
                </h6>
                <h4 className="mb-0">{count}</h4>
              </div>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  );
};

export default LeadStatusSummary;
