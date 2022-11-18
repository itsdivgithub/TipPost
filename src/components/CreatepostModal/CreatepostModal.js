import React from "react";
import styles from "./CreatepostModal.module.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const CreatepostModal = ({ children, show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
