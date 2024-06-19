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

const ModalDeleteCategoriaSalario = ({
  isOpen,
  onOpenChange,
  categoriaSalarioId,
  fetchCategoriasSalariales,
  handleDeleteSuccess,
  handleDeleteError,
}) => {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/categoriaSalario/delete/${categoriaSalarioId}`,
      );

      handleDeleteSuccess(res.data.message);
      fetchCategoriasSalariales();
    } catch (error) {
      handleDeleteError(
        error.response?.data || "Error al eliminar la categoría salarial",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={categoriaSalarioId}
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
              Eliminar Categoría Salarial
            </ModalHeader>
            <ModalBody>
              <p>¿Estás seguro que deseas eliminar esta categoría salarial?</p>
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

export default ModalDeleteCategoriaSalario;
