import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";

const ModalUpdateRangoSalarial = ({
  isOpen,
  onOpenChange,
  rangoSalarial,
  fetchRangosSalariales,
  handleUpdateSuccess,
  handleUpdateError,
}) => {
  const [salarioMinimo, setSalarioMinimo] = useState("");
  const [salarioMaximo, setSalarioMaximo] = useState("");
  const [salarioMinimoError, setSalarioMinimoError] = useState("");
  const [salarioMaximoError, setSalarioMaximoError] = useState("");

  useEffect(() => {
    if (rangoSalarial) {
      setSalarioMinimo(rangoSalarial.salarioMinimo);
      setSalarioMaximo(rangoSalarial.salarioMaximo);
    }
  }, [rangoSalarial]);

  const handleUpdate = async () => {
    if (!salarioMinimo || isNaN(salarioMinimo) || salarioMinimo <= 0) {
      setSalarioMinimoError("Debe ingresar un salario mínimo válido");

      return;
    }

    if (!salarioMaximo || isNaN(salarioMaximo) || salarioMaximo <= 0) {
      setSalarioMaximoError("Debe ingresar un salario máximo válido");

      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/rangosSalariales/update/${rangoSalarial.id_rango_salarial}`,
        {
          salarioMinimo: parseFloat(salarioMinimo),
          salarioMaximo: parseFloat(salarioMaximo),
        },
      );

      handleUpdateSuccess(res.data.message);
      fetchRangosSalariales();
    } catch (error) {
      handleUpdateError(
        error.response?.data || "Error al actualizar el rango salarial",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={rangoSalarial?.id_rango_salarial}
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
              Actualizar Rango Salarial
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                errorMessage={salarioMinimoError}
                isInvalid={!!salarioMinimoError}
                label="Salario Mínimo"
                labelPlacement="outside"
                placeholder="Ingrese el salario mínimo"
                startContent={<span>$</span>}
                type="number"
                value={salarioMinimo}
                onChange={(e) => {
                  setSalarioMinimo(e.target.value);
                  if (e.target.value && e.target.value > 0) {
                    setSalarioMinimoError("");
                  }
                }}
              />
              <Input
                isRequired
                errorMessage={salarioMaximoError}
                isInvalid={!!salarioMaximoError}
                label="Salario Máximo"
                labelPlacement="outside"
                placeholder="Ingrese el salario máximo"
                startContent={<span>$</span>}
                type="number"
                value={salarioMaximo}
                onChange={(e) => {
                  setSalarioMaximo(e.target.value);
                  if (e.target.value && e.target.value > 0) {
                    setSalarioMaximoError("");
                  }
                }}
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

export default ModalUpdateRangoSalarial;
