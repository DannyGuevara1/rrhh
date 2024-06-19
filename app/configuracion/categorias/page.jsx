"use client";
import React, { useState, useEffect } from "react";
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
    Select,
  SelectItem,
  Chip,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import ModalDeleteCategoriaSalario from "./ui/ModalDeleteCategoriaSalario";
import ModalUpdateCategoriaSalario from "./ui/ModalUpdateCategoriaSalario";

export default function CategoriasSalarialesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [rangoSalarialId, setRangoSalarialId] = useState("");
  const [rangosSalariales, setRangosSalariales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSalarioToDelete, setCategoriaSalarioToDelete] =
    useState(null);
  const [categoriaSalarioToUpdate, setCategoriaSalarioToUpdate] =
    useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("success");
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
  }, []);

  let list = useAsyncList({
    async load({ signal }) {
      try {
        let res = await fetch(
          "http://localhost:8080/api/v1/categoriaSalario/all",
          {
            signal,
          },
        );
        let json = await res.json();

        setIsLoading(false);

        return {
          items: json.categoriasSalario,
        };
      } catch (error) {
        console.error("Error al cargar categorías salariales:", error);
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
    if (!nombreCategoria) {
      setNombreError("Debe ingresar un nombre de categoría");

      return;
    }

    if (!rangoSalarialId) {
      setRangoSalarialError("Debe seleccionar un rango salarial");

      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/categoriaSalario/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombreCategoria,
            descripcion,
            rangoSalarial: {
              idRangoSalarial: parseInt(rangoSalarialId),
            },
          }),
        },
      );

      if (res.ok) {
        list.reload();
        setNombreCategoria("");
        setDescripcion("");
        setRangoSalarialId("");
        setResponseMessage("Categoría salarial creada exitosamente");
        setResponseType("success");
      } else {
        setResponseMessage("Error al crear categoría salarial");
        setResponseType("danger");
      }
    } catch (error) {
      setResponseMessage("Error al crear categoría salarial");
      setResponseType("danger");
    }

    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const handleEdit = (categoriaSalario) => {
    setCategoriaSalarioToUpdate(categoriaSalario);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id) => {
    setCategoriaSalarioToDelete(id);
    setIsModalOpen(true);
  };

  const fetchCategoriasSalariales = async () => {
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
          Crear Categoría Salarial
        </Button>
      </div>
      <Card className="mb-8 p-6 shadow-md rounded-lg">
        <div className="grid grid-cols-1 gap-6 mb-9">
          <div>
            <Input
              isRequired
              errorMessage={nombreError}
              isInvalid={!!nombreError}
              label="Nombre de la Categoría"
              labelPlacement="outside"
              placeholder="Ingrese el nombre de la categoría"
              type="text"
              value={nombreCategoria}
              width={"50%"}
              onChange={(e) => {
                setNombreCategoria(e.target.value);
                if (e.target.value) {
                  setNombreError("");
                }
              }}
            />
          </div>
          <div>
            <Input
              label="Descripción"
              labelPlacement="outside"
              placeholder="Ingrese la descripción de la categoría"
              type="text"
              value={descripcion}
              width={"50%"}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div>
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
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center text-5xl font-extrabold dark:text-white">
          Categorías Salariales
        </div>
      </div>

      <div className="mb-8 shadow-md rounded-lg">
        <Table
          fullWidth
          aria-label="Tabla de categorías salariales con ordenación del lado del cliente"
          classNames={{
            table: "min-h-auto",
          }}
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <TableHeader>
            <TableColumn key="nombreCategoria" allowsSorting>
              Nombre
            </TableColumn>
            <TableColumn key="descripcion" allowsSorting>
              Descripción
            </TableColumn>
            <TableColumn key="rangoSalarial" allowsSorting>
              Rango Salarial
            </TableColumn>
            <TableColumn key="acciones">Acciones</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={list.items}
            loadingContent={<Spinner label="Cargando..." />}
          >
            {(item) => (
              <TableRow key={item.idCategoriaSalario}>
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
                                handleDelete(item.idCategoriaSalario)
                              }
                            />
                          </span>
                        </Tooltip>
                      </div>
                    ) : columnKey === "rangoSalarial" ? (
                      `$${item.rangoSalarial.salarioMinimo} - $${item.rangoSalarial.salarioMaximo}`
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

      <ModalDeleteCategoriaSalario
        categoriaSalarioId={categoriaSalarioToDelete}
        fetchCategoriasSalariales={fetchCategoriasSalariales}
        handleDeleteError={handleDeleteError}
        handleDeleteSuccess={handleDeleteSuccess}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <ModalUpdateCategoriaSalario
        categoriaSalario={categoriaSalarioToUpdate}
        fetchCategoriasSalariales={fetchCategoriasSalariales}
        handleUpdateError={handleUpdateError}
        handleUpdateSuccess={handleUpdateSuccess}
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
    </>
  );
}
