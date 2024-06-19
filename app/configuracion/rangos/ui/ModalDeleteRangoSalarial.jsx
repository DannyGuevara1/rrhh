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

const ModalDeleteRangoSalarial = ({
  isOpen,
  onOpenChange,
  rangoSalarialId,
  fetchRangosSalariales,
  handleDeleteSuccess,
  handleDeleteError,
}) => {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/rangosSalariales/delete/${rangoSalarialId}`,
      );

      handleDeleteSuccess(res.data.message);
      fetchRangosSalariales();
    } catch (error) {
      handleDeleteError(
        error.response?.data || "Error al eliminar el rango salarial",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={rangoSalarialId}
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
              Eliminar Rango Salarial
            </ModalHeader>
            <ModalBody>
              <p>¿Estás seguro que deseas eliminar este rango salarial?</p>
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

export default ModalDeleteRangoSalarial;
