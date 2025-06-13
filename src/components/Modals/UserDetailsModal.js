import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
} from "reactstrap";

const UserDetailsModal = ({ isOpen, toggle, user }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        User Information - {user?.userrole?.toUpperCase()}
      </ModalHeader>
      <ModalBody style={{ maxHeight: "500px", overflowY: "auto" }}>
        {user ? (
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                {/* Common fields for all roles */}
                <tr>
                  <td width="30%">
                    <strong>First Name:</strong>
                  </td>
                  <td>{user.firstname}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Last Name:</strong>
                  </td>
                  <td>{user.lastname}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Email:</strong>
                  </td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Phone:</strong>
                  </td>
                  <td>{user.phone || "-"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Address:</strong>
                  </td>
                  <td>{user.address || "-"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Website:</strong>
                  </td>
                  <td>{user.website || "-"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Coverage Area:</strong>
                  </td>
                  <td>{user.coverage || "-"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>LinkedIn:</strong>
                  </td>
                  <td>{user.linkedin || "-"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Status:</strong>
                  </td>
                  <td>
                    <Badge color={user.block ? "danger" : "success"}>
                      {user.block ? "Blocked" : "Active"}
                    </Badge>
                  </td>
                </tr>

                <>
                  <tr className="table-primary">
                    <td colSpan="2">
                      <strong>MAIL SETTINGS</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>SMTP Email:</strong>
                    </td>
                    <td>{user.smtpemail || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>SMTP Password:</strong>
                    </td>
                    <td>••••••••</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>SMTP Incoming Server:</strong>
                    </td>
                    <td>{user.smtpincomingserver || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>SMTP Outgoing Server:</strong>
                    </td>
                    <td>{user.smtpoutgoingserver || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>SMTP Port:</strong>
                    </td>
                    <td>{user.smtpport || "-"}</td>
                  </tr>

                  <tr className="table-primary">
                    <td colSpan="2">
                      <strong>BRANCH DETAILS</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Branch Name:</strong>
                    </td>
                    <td>{user.branchname || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Branch Slug:</strong>
                    </td>
                    <td>{user.branchslug || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Branch Country:</strong>
                    </td>
                    <td>{user.branchcountry || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Branch Address:</strong>
                    </td>
                    <td>{user.branchaddress || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Header Color:</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {user.brancheader || "-"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Navbar Color:</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {user.branchnavbar || "-"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Navbar Text Color:</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {user.branchnavtext || "-"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Text Hover Color:</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {user.branchnavhover || "-"}
                      </div>
                    </td>
                  </tr>
                </>

                {/* Client specific fields */}
                {user.userrole === "client" && (
                  <tr>
                    <td>
                      <strong>Assigned Vendors:</strong>
                    </td>
                    <td>
                      {user.subVendors && user.subVendors.length > 0
                        ? user.subVendors.join(", ")
                        : "-"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading user details...</p>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UserDetailsModal;
