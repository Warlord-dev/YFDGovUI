import React from "react";
import {
    Button,
    Modal,
} from "react-bootstrap";

export default function AlertModal({
    open,
    toggle,
    children,
}) {
    return (
        <Modal
            show={open}
            onHide={toggle}
        >
            <Modal.Header closeButton>
                <Modal.Title>Opps!! Error...</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button variant="outline-success"
                    onClick={toggle}
                >
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
