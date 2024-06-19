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

const ModalDeleteTipoContrato = ({
  isOpen,
  onOpenChange,
  tipoContratoId,
  fetchTipoContratos,
  handleDeleteSuccess,
  handleDeleteError,
}) => {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/tipoContrato/delete/${tipoContratoId}`,
      );

      handleDeleteSuccess(res.data.message);
      fetchTipoContratos();
    } catch (error) {
      handleDeleteError(
        error.response?.data || "Error al eliminar el tipo de contrato",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={tipoContratoId}
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
              Eliminar Tipo de Contrato
            </ModalHeader>
            <ModalBody>
              <p>¿Estás seguro que deseas eliminar este tipo de contrato?</p>
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

export default ModalDeleteTipoContrato;
