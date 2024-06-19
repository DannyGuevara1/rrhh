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
import { NewspaperIcon, BookOpenIcon } from "@heroicons/react/24/solid";

const ModalUpdateDepartment = ({
  isOpen,
  onOpenChange,
  department,
  fetchDepartments,
  handleUpdateSuccess,
  handleUpdateError,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombreError, setNombreError] = useState("");

  useEffect(() => {
    if (department) {
      setNombre(department.nombre);
      setDescripcion(department.descripcion);
    }
  }, [department]);

  const handleUpdate = async () => {
    if (!nombre) {
      setNombreError("Debe ingresar un nombre de departamento");

      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/departamento/update/${department.id_departamento}`,
        {
          nombre,
          descripcion,
        },
      );

      handleUpdateSuccess(res.data.message);
      fetchDepartments();
    } catch (error) {
      handleUpdateError(
        error.response?.data || "Error al actualizar el departamento",
      );
    }

    onOpenChange(false);
  };

  return (
    <Modal
      key={department?.id_departamento}
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
              Actualizar Departamento
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                defaultValue={nombre}
                errorMessage={nombreError}
                isInvalid={!!nombreError}
                label="Nombre del Departamento"
                labelPlacement="outside"
                placeholder="Ingrese el nombre del departamento"
                startContent={
                  <NewspaperIcon className="h-6 w-6 text-gray-400" />
                }
                type="text"
                width={"100%"}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (e.target.value) {
                    setNombreError("");
                  }
                }}
              />
              <Input
                defaultValue={descripcion}
                label="Descripcion del Departamento"
                labelPlacement="outside"
                placeholder="Ingrese la descripcion del departamento"
                startContent={
                  <BookOpenIcon className="h-6 w-6 text-gray-400" />
                }
                type="text"
                width={"100%"}
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

export default ModalUpdateDepartment;
