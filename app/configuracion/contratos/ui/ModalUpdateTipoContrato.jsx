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
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import axios from "axios";

const ModalUpdateTipoContrato = ({
  isOpen,
  onOpenChange,
  tipoContrato,
  fetchTipoContratos,
  handleUpdateSuccess,
  handleUpdateError,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [duracionError, setDuracionError] = useState("");

  useEffect(() => {
    if (tipoContrato) {
      setNombre(tipoContrato.nombre);
      setDescripcion(tipoContrato.descripcion);
      setDuracion(tipoContrato.duracion);
    }
  }, [tipoContrato]);

  const handleUpdate = async () => {
    if (!nombre) {
      setNombreError("Debe ingresar un nombre de contrato");

      return;
    }

    if (!duracion) {
      setDuracionError("Debe seleccionar una duración");

      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/tipoContrato/update/${tipoContrato.idTipoContrato}`,
        {
          nombre,
          descripcion,
          duracion,
        },
      );

      handleUpdateSuccess(res.data.message);
      fetchTipoContratos();
    } catch (error) {
      handleUpdateError(
        error.response?.data || "Error al actualizar el tipo de contrato",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={tipoContrato?.idTipoContrato}
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
              Actualizar Tipo de Contrato
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                errorMessage={nombreError}
                isInvalid={!!nombreError}
                label="Nombre del Tipo de Contrato"
                labelPlacement="outside"
                placeholder="Ingrese el nombre del tipo de contrato"
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
                placeholder="Ingrese la descripción del tipo de contrato"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <RadioGroup
                label="Duración del contrato"
                value={duracion}
                onChange={(e) => {
                  setDuracion(e.target.value);
                  if (e.target.value) {
                    setDuracionError("");
                  }
                }}
              >
                <Radio value="Temporal">Temporal</Radio>
                <Radio value="Indefinido">Indefinido</Radio>
              </RadioGroup>
              {duracionError && (
                <span className="text-red-500">{duracionError}</span>
              )}
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

export default ModalUpdateTipoContrato;
