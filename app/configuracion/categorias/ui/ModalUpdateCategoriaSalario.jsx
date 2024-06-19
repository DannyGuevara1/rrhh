import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";

const ModalUpdateCategoriaSalario = ({
  isOpen,
  onOpenChange,
  categoriaSalario,
  fetchCategoriasSalariales,
  handleUpdateSuccess,
  handleUpdateError,
}) => {
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [rangoSalarialId, setRangoSalarialId] = useState("");
  const [rangosSalariales, setRangosSalariales] = useState([]);
  const [nombreError, setNombreError] = useState("");
  const [rangoSalarialError, setRangoSalarialError] = useState("");

  useEffect(() => {
    const fetchRangosSalariales = async () => {
      try {
        let res = await fetch(
          "http://localhost:8080/api/v1/rangosSalariales/all",
        );
        let json = await res.json();

        setRangosSalariales(json.rangosSalariales);
      } catch (error) {
        console.error("Error al cargar rangos salariales:", error);
      }
    };

    fetchRangosSalariales();

    if (categoriaSalario) {
      setNombreCategoria(categoriaSalario.nombreCategoria);
      setDescripcion(categoriaSalario.descripcion);
      setRangoSalarialId(categoriaSalario.rangoSalarial.idRangoSalarial);
    }
  }, [categoriaSalario]);

  const handleUpdate = async () => {
    if (!nombreCategoria) {
      setNombreError("Debe ingresar un nombre de categoría");

      return;
    }

    if (!rangoSalarialId) {
      setRangoSalarialError("Debe seleccionar un rango salarial");

      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/categoriaSalario/update/${categoriaSalario.idCategoriaSalario}`,
        {
          nombreCategoria,
          descripcion,
          rangoSalarial: {
            idRangoSalarial: parseInt(rangoSalarialId),
          },
        },
      );

      handleUpdateSuccess(res.data.message);
      fetchCategoriasSalariales();
    } catch (error) {
      handleUpdateError(
        error.response?.data || "Error al actualizar la categoría salarial",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={categoriaSalario?.idCategoriaSalario}
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
              Actualizar Categoría Salarial
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                errorMessage={nombreError}
                isInvalid={!!nombreError}
                label="Nombre de la Categoría"
                labelPlacement="outside"
                placeholder="Ingrese el nombre de la categoría"
                type="text"
                value={nombreCategoria}
                onChange={(e) => {
                  setNombreCategoria(e.target.value);
                  if (e.target.value) {
                    setNombreError("");
                  }
                }}
              />
              <Input
                label="Descripción"
                labelPlacement="outside"
                placeholder="Ingrese la descripción de la categoría"
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <Select
                errorMessage={rangoSalarialError}
                isInvalid={!!rangoSalarialError}
                label="Rango Salarial"
                placeholder="Seleccione el rango salarial"
                value={rangoSalarialId}
                onChange={(e) => {
                  setRangoSalarialId(e.target.value);
                  if (e.target.value) {
                    setRangoSalarialError("");
                  }
                }}
              >
                {rangosSalariales.map((rango) => (
                  <SelectItem
                    key={rango.id_rango_salarial}
                    value={rango.id_rango_salarial}
                  >
                    {`$${rango.salarioMinimo} - $${rango.salarioMaximo}`}
                  </SelectItem>
                ))}
              </Select>
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

export default ModalUpdateCategoriaSalario;
