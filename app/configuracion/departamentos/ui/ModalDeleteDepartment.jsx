import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";

const ModalDeleteDepartment = ({
  isOpen,
  onOpenChange,
  departmentId,
  fetchDepartments,
  handleDeleteSuccess,
  handleDeleteError,
}) => {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/departamento/delete/${departmentId}`,
      );

      handleDeleteSuccess(res.data.message);
      fetchDepartments();
    } catch (error) {
      handleDeleteError(
        error.response?.data || "Error al eliminar el departamento",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={departmentId}
      backdrop="blur"
      isOpen={isOpen}
      placement="auto"
      size="xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Eliminar Departamento
            </ModalHeader>
            <ModalBody>
              <p>¿Estás seguro que deseas eliminar este departamento?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleDelete}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDeleteDepartment;
