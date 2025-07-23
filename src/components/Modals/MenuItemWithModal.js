// components/Common/MenuItemWithModal.jsx
import React from "react";
import ModalWrapper from "./ModalWrapper";

const MenuItemWithModal = ({ title, modalTitle, ModalContent }) => {
  return (
    <ModalWrapper
      title={modalTitle}
      triggerComponent={
        <div
          style={{
            display: "block",
            padding: "6px 24px 6px 52px",
            color: "#6c757d",
            cursor: "pointer",
            transition: "all 0.3s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6c757d")}
          className="waves-effect"
        >
          {title}
        </div>
      }
    >
      {ModalContent}
    </ModalWrapper>
  );
};

export default MenuItemWithModal;
