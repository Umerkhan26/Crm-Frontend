import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, Container, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import io from "socket.io-client";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadCount,
} from "../../services/notificationService";
import { withTranslation } from "react-i18next";

const Notification = ({ t }) => {
  const breadcrumbItems = [
    { title: t("Dashboard"), link: "/" },
    { title: t("Settings"), link: "#" },
    { title: t("Notification"), link: "#" },
  ];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [username, setUsername] = useState();

  const formatTime = useCallback(
    (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.round(diffMs / 60000);

      if (diffMins < 60) {
        return `${diffMins} ${t("min ago")}`;
      } else if (diffMins < 1440) {
        return `${Math.floor(diffMins / 60)} ${t("hours ago")}`;
      } else {
        return date.toLocaleDateString();
      }
    },
    [t]
  );
  const fetchNotifications = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error(t("User ID not found"));

        const limit = 15;
        // 👇 Ensure backend accepts page + limit
        const response = await getNotifications(userId, pageNum, limit);
        console.log("notication", response);

        let data = Array.isArray(response) ? response : response.data || [];
        let total = Number.isFinite(response.total) ? response.total : null;

        setNotifications((prev) => {
          const newNotifications = pageNum === 1 ? data : [...prev, ...data];
          if (total !== null) {
            setHasMore(newNotifications.length < total);
            setTotalNotifications(total);
          } else {
            setHasMore(data.length >= limit);
            setTotalNotifications((prevTotal) => prevTotal + data.length);
          }
          return newNotifications;
        });

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    },
    [t]
  );

  const fetchUnreadCount = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error(t("User ID not found"));
      }
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      setUnreadCount(0);
    }
  }, [t]);

  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notif) => !notif.isRead
      );
      await Promise.all(
        unreadNotifications.map((notif) => markNotificationAsRead(notif.id))
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, [notifications]);

  const handleLoadMore = () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      fetchNotifications(nextPage);
      return nextPage;
    });
  };

  useEffect(() => {
    const authUserString = localStorage.getItem("authUser");
    if (authUserString) {
      const authUser = JSON.parse(authUserString);

      // Set full name
      if (authUser.firstname && authUser.lastname) {
        const fullName =
          authUser.firstname.charAt(0).toUpperCase() +
          authUser.firstname.slice(1) +
          " " +
          authUser.lastname.charAt(0).toUpperCase() +
          authUser.lastname.slice(1);
        setUsername(fullName);
      }

      // Set user image
      if (authUser.userImage) {
        setUserImage(authUser.userImage);
      }
    }
  }, []);

  // useEffect(() => {
  //   // Initialize Socket.IO connection
  //   const newSocket = io("http://localhost:3000");
  //   setSocket(newSocket);
  //   const userId = localStorage.getItem("userId");

  //   if (userId) {
  //     newSocket.emit("join", `user_${userId}`);
  //     newSocket.on("notification", (notification) => {
  //       setNotifications((prev) => [notification, ...prev]);
  //       setUnreadCount((prev) => prev + 1);
  //       setTotalNotifications((prev) => prev + 1);
  //     });
  //   }

  //   setPage(1);
  //   setNotifications([]);
  //   fetchUnreadCount();
  //   fetchNotifications(1);

  //   // Cleanup
  //   return () => {
  //     if (newSocket) {
  //       newSocket.disconnect();
  //     }
  //   };
  // }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    // Initialize Socket.IO connection with environment variable
    const socketServerUrl =
      process.env.REACT_APP_SOCKET_SERVER_URL || "http://localhost:3000";
    const newSocket = io(socketServerUrl);
    setSocket(newSocket);
    const userId = localStorage.getItem("userId");

    if (userId) {
      newSocket.emit("join", `user_${userId}`);
      newSocket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        setTotalNotifications((prev) => prev + 1);
      });
    }

    setPage(1);
    setNotifications([]);
    fetchUnreadCount();
    fetchNotifications(1);

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [fetchNotifications, fetchUnreadCount]);
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title={t("NOTIFICATION")}
          breadcrumbItems={breadcrumbItems}
        />
        <Card>
          <CardBody style={{ padding: 0 }}>
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{t("All Notifications")}</h5>
                {unreadCount > 0 && (
                  <Button
                    color="link"
                    className="p-0 text-primary"
                    onClick={handleMarkAllAsRead}
                  >
                    {t("Mark All as Read")}
                  </Button>
                )}
              </div>
            </div>
            <div className="notification-list">
              {loading && !notifications.length ? (
                <div className="text-center p-3">{t("Loading...")}</div>
              ) : error ? (
                <div className="text-center p-3 text-danger">{error}</div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-3">
                  {t("No notifications available")}
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to="#"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={`notification-item ${
                      notification.isRead ? "" : "unread"
                    }`}
                    style={{
                      padding: "12px 20px",
                      borderBottom: "1px solid #f1f1",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: notification.isRead
                        ? "white"
                        : "#dee4e5",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        flexShrink: 0,
                      }}
                    >
                      {userImage ? (
                        <img
                          src={userImage}
                          alt="User Profile"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            objectPosition: "top",
                          }}
                        />
                      ) : (
                        <span
                          className={`avatar-title ${
                            notification.isRead ? "bg-secondary" : "bg-primary"
                          } rounded-circle font-size-16`}
                        >
                          <i className="ri-notification-line"></i>
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
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
                          {notification.sender || username || t("System")}
                        </span>
                        <span
                          style={{
                            color: "#888",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            marginLeft: "10px",
                          }}
                        >
                          {formatTime(notification.created_at)}
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
                        {!notification.isRead && (
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
                            {t("unread")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", padding: "15px" }}>
                <Button
                  color="primary"
                  outline
                  onClick={handleLoadMore}
                  disabled={loading || !hasMore}
                  style={{
                    padding: "8px 20px",
                    fontSize: "14px",
                    borderRadius: "20px",
                    opacity: !hasMore ? 0.5 : 1,
                    cursor: !hasMore ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? t("Loading...") : t("Load More")}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default withTranslation()(Notification);
