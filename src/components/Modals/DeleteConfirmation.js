// hooks/useDeleteConfirmation.js
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const useDeleteConfirmation = () => {
  const confirmDelete = async (deleteFn, onSuccess, entityName = "item") => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      html: `
        <style>
          .swal2-popup {
            width: 300px !important;
            height: 160px !important;
            padding: 10px 0px !important;
            font-size: 14px !important;
          }
          .swal2-title {
            font-size: 18px !important;
          }
          .swal2-html-container {
            font-size: 14px !important;
          }
          .swal2-actions {
            margin-top: -12px !important;
          }
          .swal2-confirm,
          .swal2-cancel {
            padding: 5px 10px !important;
            font-size: 14px !important;
          }
        </style>
        <p style="color: red;">Are you sure you want to delete this ${entityName}?</p>
      `,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteFn();
        toast.success(`${entityName} has been deleted successfully!`);
        onSuccess?.();
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error(`Delete failed: ${err.message}`);
      }
    }
  };

  return { confirmDelete };
};

export default useDeleteConfirmation;
