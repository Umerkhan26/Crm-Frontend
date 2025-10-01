import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import io from "socket.io-client";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadCount,
} from "../../../services/notificationService";

const NotificationDropdown = ({ t }) => {
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [userImage, setUserImage] = useState(null);

  // const fetchNotifications = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     if (!userId) {
  //       throw new Error("User ID not found");
  //     }
  //     const response = await getNotifications(userId, 1, 10);
  //     setNotifications(Array.isArray(response.data) ? response.data : []);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error.message);
  //     setLoading(false);
  //     console.error("Failed to fetch notifications:", error);
  //   }
  // }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await getNotifications(userId, 1, 10);

      // Handle both formats: paginated {data: []} and direct []
      const notificationsData = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : [];

      setNotifications(notificationsData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
      console.log("Current unread count:", count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      setUnreadCount(0);
    }
  }, []);

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

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  }, []);

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (authUser && authUser.userImage) {
      setUserImage(authUser.userImage);
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
  //     });
  //   }

  //   fetchUnreadCount();
  //   fetchNotifications();

  //   // Cleanup
  //   return () => {
  //     if (newSocket) {
  //       newSocket.disconnect();
  //     }
  //   };
  // }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    // Initialize Socket.IO connection
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
      });
    }

    fetchUnreadCount();
    fetchNotifications();

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [fetchNotifications, fetchUnreadCount]);
  const toggle = () => {
    setMenu((prev) => {
      if (!prev) {
        fetchNotifications();
        fetchUnreadCount();
      }
      return !prev;
    });
  };

  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle
          tag="button"
          className="btn header-item noti-icon waves-effect position-relative"
          id="page-header-notifications-dropdown"
        >
          <i className="ri-notification-3-line fs-5"></i>
          {unreadCount > 0 && (
            <span
              className="badge bg-danger rounded-circle position-absolute"
              style={{
                top: "12px",
                right: "3px",
                fontSize: "10px",
                width: "21px",
                height: "21px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </DropdownToggle>

        <DropdownMenu
          className="dropdown-menu-end dropdown-menu-lg p-0"
          aria-labelledby="page-header-notifications-dropdown"
        >
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0">{t("Notifications")}</h6>
              </Col>
              <div className="col-auto">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="btn btn-sm btn-link p-0 text-primary"
                  >
                    {t("Mark All as Read")}
                  </button>
                )}
              </div>
            </Row>
          </div>

          <SimpleBar style={{ maxHeight: "230px" }}>
            {loading ? (
              <div className="text-center p-3">{t("Loading...")}</div>
            ) : error ? (
              <div className="text-center p-3 text-danger">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-3">{t("No notifications")}</div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to="#"
                  onClick={() => handleMarkAsRead(notification.id)}
                  style={{
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : "#f8f9fa",
                    display: "block",
                    padding: "16px 16px",
                    borderBottom: "1.3px solid #f1f1f1",
                  }}
                >
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt="User Profile"
                          className="rounded-circle"
                          style={{
                            width: "32px",
                            height: "32px",
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
                    <div className="flex-1">
                      <h6 className="mt-0 mb-1">{notification.message}</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i>{" "}
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </SimpleBar>

          <div className="p-2 border-top">
            <Link
              to="/all-notifications"
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {t("View More")}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);
