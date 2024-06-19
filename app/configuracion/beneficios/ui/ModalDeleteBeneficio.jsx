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

const ModalDeleteBeneficio = ({
  isOpen,
  onOpenChange,
  beneficioId,
  fetchBeneficios,
  handleDeleteSuccess,
  handleDeleteError,
}) => {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/beneficio/delete/${beneficioId}`,
      );

      handleDeleteSuccess(res.data.message);
      fetchBeneficios();
    } catch (error) {
      handleDeleteError(
        error.response?.data || "Error al eliminar el beneficio",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={beneficioId}
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
              Eliminar Beneficio
            </ModalHeader>
            <ModalBody>
              <p>¿Estás seguro que deseas eliminar este beneficio?</p>
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

export default ModalDeleteBeneficio;
