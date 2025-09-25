import { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Card, CardBody, Spinner, Button } from "reactstrap";
import { FiTrash2 } from "react-icons/fi";
import Breadcrumb from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import {
  getActivityLogs,
  getActivitiesByUserId,
  deleteActivityById,
} from "../../services/activityService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

const ActivityLog = () => {
  const { confirmDelete } = useDeleteConfirmation();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [isAdminUser, setIsAdminUser] = useState(false);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "#" },
    { title: "Activity Log", link: "#" },
  ];

  // 🔑 detect admin user
  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    setIsAdminUser(authUser?.userrole?.toLowerCase() === "admin");
  }, []);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      const userId = authUser?.id;

      let response;
      if (isAdminUser) {
        response = await getActivityLogs({
          page: pagination.currentPage,
          limit: pagination.pageSize,
        });
      } else {
        response = await getActivitiesByUserId(userId, {
          page: pagination.currentPage,
          limit: pagination.pageSize,
        });
      }

      const records = response.data || [];
      setActivities(records);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.currentPage || 1,
        totalItems: response.totalItems || 0,
        totalPages: response.totalPages || 1,
      }));
    } catch (error) {
      console.error("Failed to fetch activities:", error.message);
      setActivities([]);
      setPagination((prev) => ({
        ...prev,
        totalItems: 0,
        totalPages: 1,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, isAdminUser]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newSize, currentPage: 1 }));
  };

  const handleDeleteActivity = async (id) => {
    await confirmDelete(
      async () => {
        await deleteActivityById(id);
      },
      async () => {
        await fetchActivities();
      },
      "Activity log"
    );
  };

  const columns = useMemo(
    () => [
      { Header: "User ID", accessor: "userId", disableFilters: true },
      { Header: "Full Name", accessor: "userName", disableFilters: true },
      { Header: "Action", accessor: "action", disableFilters: true },
      { Header: "Details", accessor: "details", disableFilters: true },
      {
        Header: "Time",
        accessor: "created_at",
        disableFilters: true,
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: "Delete",
        disableFilters: true,
        Cell: ({ row }) => (
          <Button
            color="danger"
            size="sm"
            onClick={() => handleDeleteActivity(row.original.id)}
          >
            <FiTrash2 size={14} />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="ACTIVITY LOG" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
                <p>Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-5">
                <h4>No activity logs found</h4>
              </div>
            ) : (
              <TableContainer
                columns={columns}
                data={activities}
                isPagination={true}
                iscustomPageSize={false}
                customPageSize={pagination.pageSize}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ActivityLog;
