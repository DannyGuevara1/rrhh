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
  RadioGroup,
  Radio,
  Chip,
  Tabs,
  Tab,
  Textarea,
} from "@nextui-org/react";
import Link from "next/link";
import { useAsyncList } from "@react-stately/data";
import router from "next/navigation";
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

import ModalDeleteTipoContrato from "./ui/ModalDeleteTipoContrato";
import ModalUpdateTipoContrato from "./ui/ModalUpdateTipoContrato";

export default function TipoContratoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("Temporal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoContratoToDelete, setTipoContratoToDelete] = useState(null);
  const [tipoContratoToUpdate, setTipoContratoToUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("success");
  const [nombreError, setNombreError] = useState("");
  const [duracionError, setDuracionError] = useState("");

  let list = useAsyncList({
    async load({ signal }) {
      try {
        let res = await fetch("http://localhost:8080/api/v1/tipoContrato/all", {
          signal,
        });
        let json = await res.json();

        setIsLoading(false);

        return {
          items: json.tipoContratos || [],
        };
      } catch (error) {
        console.error("Error al cargar tipos de contrato:", error);
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
    if (!nombre) {
      setNombreError("Debe ingresar un nombre de contrato");

      return;
    }

    if (!duracion) {
      setDuracionError("Debe seleccionar una duración");

      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/tipoContrato/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            descripcion,
            duracion,
          }),
        },
      );

      if (res.ok) {
        list.reload();
        setNombre("");
        setDescripcion("");
        setDuracion("Temporal");
        setResponseMessage("Tipo de contrato creado exitosamente");
        setResponseType("success");
      } else {
        setResponseMessage("Error al crear tipo de contrato");
        setResponseType("danger");
      }
    } catch (error) {
      setResponseMessage("Error al crear tipo de contrato");
      setResponseType("danger");
    }

    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };


  const handleEdit = (tipoContrato) => {
    setTipoContratoToUpdate(tipoContrato);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id) => {
    setTipoContratoToDelete(id);
    setIsModalOpen(true);
  };

  const fetchTipoContratos = async () => {
    await list.reload();
  };

  const handleUpdateSuccess = (message) => {
    setResponseMessage(message);
    setResponseType("success");
    fetchTipoContratos();

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
    fetchTipoContratos();

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
      <Tabs aria-label="Tabs tipos de contratos" color="success" radius="full">
        <Tab key="crear" title="Crear Tipo Contrato">
          <div className="mt-6">
            <Card className="mb-8 p-6 shadow-md rounded-lg">
              <div className="grid grid-cols-1 gap-6 mb-9">
                <div>
                  <Input
                    isRequired
                    errorMessage={nombreError}
                    isInvalid={!!nombreError}
                    label="Nombre del Tipo de Contrato"
                    labelPlacement="outside"
                    placeholder="Ingrese el nombre del tipo de contrato"
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
                <div>
                  <Textarea
                    label="Descripción"
                    labelPlacement="outside"
                    placeholder="Ingrese la descripción del tipo de contrato"
                    value={descripcion}
                    width={"50%"}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
                <div>
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
                </div>
                <div>
                  <Button
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                    onClick={handleCreate}
                  >
                    Crear Tipo de Contrato
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Tab>
        <Tab key="ver" title="Ver Tipos de Contratos">
          <div className="mt-6 mb-8 shadow-md rounded-lg">
            <Table
              fullWidth
              aria-label="Tabla de tipos de contratos con ordenación del lado del cliente"
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
                <TableColumn key="duracion" allowsSorting>
                  Duración
                </TableColumn>
                <TableColumn key="acciones">Acciones</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={isLoading}
                items={list.items}
                loadingContent={<Spinner label="Cargando..." />}
              >
                {(item) => (
                  <TableRow key={item.idTipoContrato}>
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
                                    handleDelete(item.idTipoContrato)
                                  }
                                />
                              </span>
                            </Tooltip>
                            <Tooltip content="Agregar Beneficios">
                              <span className="text-lg text-success cursor-pointer active:opacity-50">
                                <Link
                                  href={`/configuracion/contratos/${item.idTipoContrato}`}
                                >
                                  <PlusIcon className="h-5 w-5" />
                                </Link>
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
        </Tab>
      </Tabs>

      <ModalDeleteTipoContrato
        fetchTipoContratos={fetchTipoContratos}
        handleDeleteError={handleDeleteError}
        handleDeleteSuccess={handleDeleteSuccess}
        isOpen={isModalOpen}
        tipoContratoId={tipoContratoToDelete}
        onOpenChange={setIsModalOpen}
      />

      <ModalUpdateTipoContrato
        fetchTipoContratos={fetchTipoContratos}
        handleUpdateError={handleUpdateError}
        handleUpdateSuccess={handleUpdateSuccess}
        isOpen={isUpdateModalOpen}
        tipoContrato={tipoContratoToUpdate}
        onOpenChange={setIsUpdateModalOpen}
      />
    </>
  );
}
