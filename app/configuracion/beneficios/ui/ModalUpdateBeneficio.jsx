import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";

const ModalUpdateBeneficio = ({
  isOpen,
  onOpenChange,
  beneficio,
  fetchBeneficios,
  handleUpdateSuccess,
  handleUpdateError,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombreError, setNombreError] = useState("");

  useEffect(() => {
    if (beneficio) {
      setNombre(beneficio.nombre);
      setDescripcion(beneficio.descripcion);
    }
  }, [beneficio]);

  const handleUpdate = async () => {
    if (!nombre) {
      setNombreError("Debe ingresar un nombre de beneficio");

      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/beneficio/update/${beneficio.id_beneficio}`,
        {
          nombre,
          descripcion,
        },
      );

      handleUpdateSuccess(res.data.message);
      fetchBeneficios();
    } catch (error) {
      handleUpdateError(
        error.response?.data || "Error al actualizar el beneficio",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={beneficio?.id_beneficio}
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
              Actualizar Beneficio
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                errorMessage={nombreError}
                isInvalid={!!nombreError}
                label="Nombre del Beneficio"
                labelPlacement="outside"
                placeholder="Ingrese el nombre del beneficio"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (e.target.value) {
                    setNombreError("");
                  }
                }}
              />
              <Textarea
                label="Descripción"
                labelPlacement="outside"
                placeholder="Ingrese la descripción del beneficio"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleUpdate}>
                Actualizar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalUpdateBeneficio;
