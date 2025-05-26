import { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

const ModalWrapper = ({ title, children, triggerComponent, size = "md" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      {triggerComponent ? (
        <div onClick={toggle}>{triggerComponent}</div>
      ) : (
        <Button color="primary" onClick={toggle}>
          Open Modal
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size={size}
        style={{ maxWidth: "500px" }}
      >
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody style={{ padding: "1.5rem" }}> {children}</ModalBody>
      </Modal>
    </>
  );
};

export default ModalWrapper;
