// components/RecentlyActivity.js

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardBody,
//   Col,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";
// import SimpleBar from "simplebar-react";
// import { getActivitiesByUserId } from "../../services/activityService";

// const RecentlyActivity = ({ userId }) => {
//   const [menu, setMenu] = useState(false);
//   const [activities, setActivities] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const data = await getActivitiesByUserId(userId);
//         setActivities(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     if (userId) {
//       fetchActivities();
//     } else {
//       setError("No user ID provided");
//     }
//   }, [userId]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.toLocaleDateString("en-US", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     })}
//             <small className="text-muted">${date.toLocaleTimeString("en-US", {
//               hour: "2-digit",
//               minute: "2-digit",
//               hour12: true,
//             })}</small>`;
//   };

//   const getIconClass = (action) => {
//     switch (action.toLowerCase()) {
//       case "edit":
//         return "ri-edit-2-fill";
//       case "user":
//         return "ri-user-2-fill";
//       case "group":
//         return "ri-bar-chart-fill";
//       case "mail":
//         return "ri-mail-fill";
//       case "event":
//         return "ri-calendar-2-fill";
//       default:
//         return "ri-edit-2-fill";
//     }
//   };

//   return (
//     <Col lg={4}>
//       <Card>
//         <CardBody>
//           <Dropdown isOpen={menu} toggle={() => setMenu(!menu)}>
//             <DropdownToggle
//               tag="i"
//               className="darrow-none card-drop"
//               aria-expanded="false"
//             >
//               <i className="mdi mdi-dots-vertical"></i>
//             </DropdownToggle>
//             <DropdownMenu className="dropdown-menu-end">
//               <DropdownItem href="">Sales Report</DropdownItem>
//               <DropdownItem href="">Export Report</DropdownItem>
//               <DropdownItem href="">Profit</DropdownItem>
//               <DropdownItem href="">Action</DropdownItem>
//             </DropdownMenu>
//           </Dropdown>

//           <h4 className="card-title mb-4">Recent Activity Feed</h4>

//           <SimpleBar style={{ maxHeight: "330px" }}>
//             {error ? (
//               <p className="text-danger">{error}</p>
//             ) : activities.length === 0 ? (
//               <p className="text-muted">No activity logs found.</p>
//             ) : (
//               <ul className="list-unstyled activity-wid">
//                 {activities.map((activity) => (
//                   <li className="activity-list" key={activity.id}>
//                     <div className="activity-icon avatar-xs">
//                       <span className="avatar-title bg-primary-subtle text-primary rounded-circle">
//                         <i className={getIconClass(activity.action)}></i>
//                       </span>
//                     </div>
//                     <div>
//                       <div>
//                         <h5
//                           className="font-size-13"
//                           dangerouslySetInnerHTML={{
//                             __html: formatDate(activity.created_at),
//                           }}
//                         ></h5>
//                       </div>
//                       <div>
//                         <p className="text-muted mb-0">
//                           {activity.details || activity.action}
//                         </p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </SimpleBar>
//         </CardBody>
//       </Card>
//     </Col>
//   );
// };

// export default RecentlyActivity;

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { useNavigate } from "react-router-dom"; // ✅ import navigation
import {
  getActivitiesByUserId,
  getActivityLogs,
} from "../../services/activityService";

const RecentlyActivity = ({ userId, userrole }) => {
  const [menu, setMenu] = useState(false);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ hook

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let res;
        if (userrole?.toLowerCase() === "admin") {
          res = await getActivityLogs({ page: 1, limit: 40 });
        } else {
          res = await getActivitiesByUserId(userId, { page: 1, limit: 40 });
        }
        setActivities(res?.data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId && userrole) {
      fetchActivities();
    } else {
      setError("No user ID or role provided");
    }
  }, [userId, userrole]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} 
      <small className="text-muted">${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}</small>`;
  };

  const getIconClass = (action) => {
    switch (action.toLowerCase()) {
      case "edit":
        return "ri-edit-2-fill";
      case "user":
        return "ri-user-2-fill";
      case "group":
        return "ri-bar-chart-fill";
      case "mail":
        return "ri-mail-fill";
      case "event":
        return "ri-calendar-2-fill";
      default:
        return "ri-edit-2-fill";
    }
  };

  return (
    <Col lg={4}>
      <Card>
        <CardBody>
          <Dropdown isOpen={menu} toggle={() => setMenu(!menu)}>
            <DropdownToggle
              tag="i"
              className="darrow-none card-drop"
              aria-expanded="false"
            >
              <i className="mdi mdi-dots-vertical"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem href="">Sales Report</DropdownItem>
              <DropdownItem href="">Export Report</DropdownItem>
              <DropdownItem href="">Profit</DropdownItem>
              <DropdownItem href="">Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <h4 className="card-title mb-4">Recent Activity Feed</h4>

          <SimpleBar style={{ maxHeight: "330px" }}>
            {error ? (
              <p className="text-danger">{error}</p>
            ) : activities.length === 0 ? (
              <p className="text-muted">No activity logs found.</p>
            ) : (
              <ul className="list-unstyled activity-wid">
                {activities.map((activity) => (
                  <li
                    className="activity-list cursor-pointer" // ✅ make it clickable
                    key={activity.id}
                    onClick={() => navigate("/all-activities")} // ✅ go to route
                    style={{ cursor: "pointer" }}
                  >
                    <div className="activity-icon avatar-xs">
                      <span className="avatar-title bg-primary-subtle text-primary rounded-circle">
                        <i className={getIconClass(activity.action)}></i>
                      </span>
                    </div>
                    <div>
                      <div>
                        <h5
                          className="font-size-13"
                          dangerouslySetInnerHTML={{
                            __html: formatDate(activity.created_at),
                          }}
                        ></h5>
                      </div>
                      <div>
                        <p className="text-muted mb-0">
                          {activity.details || activity.action}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SimpleBar>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RecentlyActivity;
