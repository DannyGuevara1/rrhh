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
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import ModalDeleteRangoSalarial from "./ui/ModalDeleteRangoSalarial";
import ModalUpdateRangoSalarial from "./ui/ModalUpdateRangoSalarial";

export default function RangosSalarialesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [salarioMinimo, setSalarioMinimo] = useState("");
  const [salarioMaximo, setSalarioMaximo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rangoSalarialToDelete, setRangoSalarialToDelete] = useState(null);
  const [rangoSalarialToUpdate, setRangoSalarialToUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("success");
  const [salarioMinimoError, setSalarioMinimoError] = useState("");
  const [salarioMaximoError, setSalarioMaximoError] = useState("");

  let list = useAsyncList({
    async load({ signal }) {
      try {
        let res = await fetch(
          "http://localhost:8080/api/v1/rangosSalariales/all",
          {
            signal,
          },
        );
        let json = await res.json();

        setIsLoading(false);

        return {
          items: json.rangosSalariales,
        };
      } catch (error) {
        console.error("Error al cargar rangos salariales:", error);
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
            (parseFloat(first) || first) < (parseFloat(second) || second)
              ? -1
              : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const handleCreate = async () => {
    if (!salarioMinimo || isNaN(salarioMinimo) || salarioMinimo <= 0) {
      setSalarioMinimoError("Debe ingresar un salario mínimo válido");

      return;
    }

    if (!salarioMaximo || isNaN(salarioMaximo) || salarioMaximo <= 0) {
      setSalarioMaximoError("Debe ingresar un salario máximo válido");

      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/rangosSalariales/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salarioMinimo: parseFloat(salarioMinimo),
            salarioMaximo: parseFloat(salarioMaximo),
          }),
        },
      );

      if (res.ok) {
        list.reload();
        setSalarioMinimo("");
        setSalarioMaximo("");
        setResponseMessage("Rango salarial creado exitosamente");
        setResponseType("success");
      } else {
        setResponseMessage("Error al crear rango salarial");
        setResponseType("danger");
      }
    } catch (error) {
      setResponseMessage("Error al crear rango salarial");
      setResponseType("danger");
    }

    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const handleEdit = (rangoSalarial) => {
    setRangoSalarialToUpdate(rangoSalarial);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id) => {
    setRangoSalarialToDelete(id);
    setIsModalOpen(true);
  };

  const fetchRangosSalariales = async () => {
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
          Crear Rango Salarial
        </Button>
      </div>
      <Card className="mb-8 p-6 shadow-md rounded-lg">
        <div className="grid grid-cols-1 gap-6 mb-9">
          <div>
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
              width={"50%"}
              onChange={(e) => {
                setSalarioMinimo(e.target.value);
                if (e.target.value && e.target.value > 0) {
                  setSalarioMinimoError("");
                }
              }}
            />
          </div>
          <div>
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
              width={"50%"}
              onChange={(e) => {
                setSalarioMaximo(e.target.value);
                if (e.target.value && e.target.value > 0) {
                  setSalarioMaximoError("");
                }
              }}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center text-5xl font-extrabold dark:text-white">
          Rangos Salariales
        </div>
      </div>

      <div className="mb-8 shadow-md rounded-lg">
        <Table
          fullWidth
          aria-label="Tabla de rangos salariales con ordenación del lado del cliente"
          classNames={{
            table: "min-h-auto",
          }}
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <TableHeader>
            <TableColumn key="salarioMinimo" allowsSorting>
              Salario Mínimo
            </TableColumn>
            <TableColumn key="salarioMaximo" allowsSorting>
              Salario Máximo
            </TableColumn>
            <TableColumn key="acciones">Acciones</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={list.items}
            loadingContent={<Spinner label="Cargando..." />}
          >
            {(item) => (
              <TableRow key={item.id_rango_salarial}>
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
                              onClick={() =>
                                handleDelete(item.id_rango_salarial)
                              }
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

      <ModalDeleteRangoSalarial
        fetchRangosSalariales={fetchRangosSalariales}
        handleDeleteError={handleDeleteError}
        handleDeleteSuccess={handleDeleteSuccess}
        isOpen={isModalOpen}
        rangoSalarialId={rangoSalarialToDelete}
        onOpenChange={setIsModalOpen}
      />

      <ModalUpdateRangoSalarial
        fetchRangosSalariales={fetchRangosSalariales}
        handleUpdateError={handleUpdateError}
        handleUpdateSuccess={handleUpdateSuccess}
        isOpen={isUpdateModalOpen}
        rangoSalarial={rangoSalarialToUpdate}
        onOpenChange={setIsUpdateModalOpen}
      />
    </>
  );
}
