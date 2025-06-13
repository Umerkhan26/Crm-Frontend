// hooks/useBlockUnblockConfirmation.js
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const useBlockUnblockConfirmation = () => {
  const confirmBlockUnblock = async (
    actionFn,
    onSuccess,
    isBlocked = false,
    entityName = "user"
  ) => {
    const action = isBlocked ? "Unblock" : "Block";

    const result = await Swal.fire({
      title: `Confirm ${action}`,
      html: `
        <style>
          .swal2-popup {
            width: 300px !important;
            height: 160px !important;
            padding: 10px !important;
            font-size: 14px !important;
          }
          .swal2-title {
            font-size: 18px !important;
          }
          .swal2-html-container {
            font-size: 14px !important;
          }
          .swal2-actions {
            margin-top: 8px !important;
          }
          .swal2-confirm,
          .swal2-cancel {
            padding: 5px 10px !important;
            font-size: 14px !important;
          }
        </style>
        <p style="color: red;">Are you sure you want to ${action.toLowerCase()} this ${entityName}?</p>
      `,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "No, Cancel",
    });

    if (result.isConfirmed) {
      try {
        await actionFn();
        toast.success(
          `${entityName} has been ${action.toLowerCase()}ed successfully!`
        );
        onSuccess?.();
      } catch (err) {
        console.error(`${action} failed:`, err);
        toast.error(`${action} failed: ${err.message}`);
      }
    }
  };

  return { confirmBlockUnblock };
};

export default useBlockUnblockConfirmation;
