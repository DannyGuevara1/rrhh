"use client";
import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import {
  NewspaperIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import ModalDeleteDepartment from "./ui/ModalDeleteDepartment";
import ModalUpdateDepartment from "./ui/ModalUpdateDepartment";

export default function DepartamentosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [departmentToUpdate, setDepartmentToUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("success");
  const [nombreError, setNombreError] = useState("");
  let list = useAsyncList({
    async load({ signal }) {
      try {
        let res = await fetch("http://localhost:8080/api/v1/departamento/all", {
          signal,
        });
        let json = await res.json();

        setIsLoading(false);

        return {
          items: json,
        };
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
        setIsLoading(false);

        return { items: [] };
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const handleCreate = async () => {
    if (!nombre) {
      setNombreError("Debe ingresar un nombre de departamento");

      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/departamento/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            descripcion,
          }),
        },
      );

      if (res.ok) {
        list.reload();
        setNombre("");
        setDescripcion("");
        setResponseMessage("Departamento creado exitosamente");
        setResponseType("success");
      } else {
        setResponseMessage("Error al crear departamento");
        setResponseType("danger");
      }
    } catch (error) {
      setResponseMessage("Error al crear departamento");
      setResponseType("danger");
    }
    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const handleEdit = (department) => {
    setDepartmentToUpdate(department);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id) => {
    setDepartmentToDelete(id);
    setIsModalOpen(true);
  };

  const fetchDepartments = async () => {
    await list.reload();
  };

  const handleUpdateSuccess = (message) => {
    setResponseMessage(message);
    setResponseType("success");

    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const handleUpdateError = (message) => {
    setResponseMessage(message);
    setResponseType("danger");

    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const handleDeleteSuccess = (message) => {
    setResponseMessage(message);
    setResponseType("success");

    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const handleDeleteError = (message) => {
    setResponseMessage(message);
    setResponseType("danger");

    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  return (
    <>
      {responseMessage && (
        <Chip
          color={responseType}
          startContent={
            responseType === "success" ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5" />
            )
          }
          style={{ position: "fixed", top: 80, right: 20 }}
          variant="faded"
        >
          {responseMessage}
        </Chip>
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center text-5xl font-extrabold dark:text-white">
          Formulario
        </div>
        <Button
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
          radius="full"
          onClick={handleCreate}
        >
          Crear Departamento
        </Button>
      </div>
      <Card className="mb-8 p-6 shadow-md rounded-lg">
        <div className="grid grid-cols-1 gap-6 mb-9">
          <div>
            <Input
              isRequired
              errorMessage={nombreError}
              isInvalid={!!nombreError}
              label="Nombre del Departamento"
              labelPlacement="outside"
              placeholder="Ingrese el nombre del departamento"
              startContent={<NewspaperIcon className="h-6 w-6 text-gray-400" />}
              type="text"
              value={nombre}
              width={"50%"}
              onChange={(e) => {
                setNombre(e.target.value);
                if (e.target.value) {
                  setNombreError("");
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-4">
          <div>
            <Input
              label="Descripcion del Departamento"
              labelPlacement="outside"
              placeholder="Ingrese el decripcion del departamento"
              startContent={<BookOpenIcon className="h-6 w-6 text-gray-400" />}
              type="text"
              width={"50%"}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center text-5xl font-extrabold dark:text-white">
          Departamentos existentes
        </div>
      </div>

      <div className="mb-8 shadow-md rounded-lg">
        <Table
          fullWidth
          aria-label="Tabla de departamentos con ordenación del lado del cliente"
          classNames={{
            table: "min-h-auto",
          }}
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <TableHeader>
            <TableColumn key="nombre" allowsSorting>
              Nombre
            </TableColumn>
            <TableColumn key="descripcion" allowsSorting>
              Descripción
            </TableColumn>
            <TableColumn key="acciones">Acciones</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={list.items}
            loadingContent={<Spinner label="Cargando..." />}
          >
            {(item) => (
              <TableRow key={item.id_departamento}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "acciones" ? (
                      <div className="relative flex items-center gap-2">
                        <Tooltip content="Editar">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <PencilIcon
                              className="h-5 w-5"
                              onClick={() => handleEdit(item)}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip content="Eliminar">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <TrashIcon
                              className="h-5 w-5"
                              onClick={() => handleDelete(item.id_departamento)}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    ) : (
                      getKeyValue(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ModalDeleteDepartment
        departmentId={departmentToDelete}
        fetchDepartments={fetchDepartments}
        handleDeleteError={handleDeleteError}
        handleDeleteSuccess={handleDeleteSuccess}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <ModalUpdateDepartment
        department={departmentToUpdate}
        fetchDepartments={fetchDepartments}
        handleUpdateError={handleUpdateError}
        handleUpdateSuccess={handleUpdateSuccess}
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
    </>
  );
}
