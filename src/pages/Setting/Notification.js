import { useState } from "react";
import { Card, CardBody, Container, Badge, Button } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";

const Notification = () => {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "#" },
    { title: "Notification", link: "#" },
  ];

  // Initial notification data with mock image URLs
  const initialNotifications = [
    {
      id: 1,
      sender: "Admin CRM",
      message: "Lead Added to Order",
      time: "6 days ago",
      unread: true,
      image: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      sender: "Umar Khan",
      message: "New Order Has Been Created",
      time: "10 months ago",
      unread: true,
      image: "https://i.pravatar.cc/40?img=5",
    },
    {
      id: 3,
      sender: "Shahid Afridi",
      message: "Payment Received Successfully",
      time: "2 days ago",
      unread: true,
      image: "https://i.pravatar.cc/40?img=7",
    },
    {
      id: 4,
      sender: "Admin CRM",
      message: "New Order Has Been Created",
      time: "1 week ago",
      unread: false,
      image: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 5,
      sender: "Umar Khan",
      message: "Meeting Scheduled for Tomorrow",
      time: "3 hours ago",
      unread: true,
      image: "https://i.pravatar.cc/40?img=5",
    },
  ];

  // Additional notifications to load when "Load More" is clicked
  const moreNotifications = [
    {
      id: 6,
      sender: "Shahid Khan",
      message: "Document Approval Required",
      time: "1 day ago",
      unread: false,
      image: "https://i.pravatar.cc/40?img=7",
    },
    {
      id: 7,
      sender: "Admin CRM",
      message: "System Maintenance Scheduled",
      time: "5 days ago",
      unread: true,
      image: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 8,
      sender: "Umar Khan",
      message: "New Client Onboarded",
      time: "2 weeks ago",
      unread: false,
      image: "https://i.pravatar.cc/40?img=5",
    },
    {
      id: 9,
      sender: "Shahid Khan",
      message: "Project Deadline Extended",
      time: "1 month ago",
      unread: false,
      image: "https://i.pravatar.cc/40?img=7",
    },
    {
      id: 10,
      sender: "Admin CRM",
      message: "New Feature Released",
      time: "Just now",
      unread: true,
      image: "https://i.pravatar.cc/40?img=3",
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [showLoadMore, setShowLoadMore] = useState(true);

  const handleLoadMore = () => {
    // Combine existing notifications with more notifications
    setNotifications([...notifications, ...moreNotifications]);
    // Hide the load more button after loading all data
    setShowLoadMore(false);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="NOTIFICATION" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody style={{ padding: 0 }}>
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      notification.unread ? "unread" : ""
                    }`}
                    style={{
                      padding: "12px 20px",
                      borderBottom: "1px solid #f1f1f1",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: notification.unread
                        ? "#f8f9fa"
                        : "white",
                    }}
                  >
                    {/* Sender Image */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#3b5de7",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        flexShrink: 0,
                        backgroundImage: `url(${notification.image})`,
                        backgroundSize: "cover",
                      }}
                    >
                      {!notification.image && "A"}
                    </div>

                    {/* Notification Content */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0, // Prevent overflow
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#333",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {notification.sender}
                        </span>
                        <span
                          style={{
                            color: "#888",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            marginLeft: "10px",
                          }}
                        >
                          {notification.time}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "#555",
                          fontSize: "13px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {notification.message}
                        </span>
                        {notification.unread && (
                          <Badge
                            color="primary"
                            pill
                            style={{
                              fontSize: "10px",
                              padding: "3px 8px",
                              fontWeight: "normal",
                              backgroundColor: "#3b5de7",
                              marginLeft: "10px",
                            }}
                          >
                            unread
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {showLoadMore && (
                <div style={{ textAlign: "center", padding: "15px 0" }}>
                  <Button
                    color="primary"
                    outline
                    onClick={handleLoadMore}
                    style={{
                      padding: "8px 25px",
                      fontSize: "14px",
                      borderRadius: "20px",
                    }}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default Notification;
