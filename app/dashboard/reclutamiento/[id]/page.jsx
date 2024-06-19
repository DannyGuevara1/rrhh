"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chip,
  Divider,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  RadioGroup,
  Radio
} from "@nextui-org/react";
import { EyeIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import dynamic from "next/dynamic";

import ModalCreateVacante from "../ui/ModalCreateVacante";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function VacantesPuestoPage({ params }) {
  const [vacantes, setVacantes] = useState([]);
  const [filteredVacantes, setFilteredVacantes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("success");
  const [filter, setFilter] = useState("activa"); // Default filter
  const [vacanteToDelete, setVacanteToDelete] = useState(null);
  const [vacanteToUpdate, setVacanteToUpdate] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [fechaCierre, setFechaCierre] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [categoriaSalario, setCategoriaSalario] = useState("");
  const [estadoPublicado, setEstadoPublicado] = useState(true);
  const [tipoContratos, setTipoContratos] = useState([]);
  const [categoriasSalario, setCategoriasSalario] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const router = useRouter();
  const idPuesto = params.id;

  useEffect(() => {
    if (idPuesto) {
      fetch(`http://localhost:8080/api/v1/vacantes/puesto/${idPuesto}`)
        .then((response) => response.json())
        .then((data) => {
          setVacantes(data);
          setFilteredVacantes(
            data.filter((vacante) => vacante.estadoPublicado),
          );
        })
        .catch((error) => console.error("Error fetching vacantes:", error));
    }

    fetch("http://localhost:8080/api/v1/tipoContrato/all")
      .then((response) => response.json())
      .then((data) => setTipoContratos(data.tipoContratos))
      .catch((error) => console.error("Error fetching tipo contratos:", error));

    fetch("http://localhost:8080/api/v1/categoriaSalario/all")
      .then((response) => response.json())
      .then((data) => setCategoriasSalario(data.categoriasSalario))
      .catch((error) =>
        console.error("Error fetching categorias salario:", error),
      );
  }, [idPuesto]);

  const handleCreateVacanteClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = (message) => {
    setResponseMessage(message);
    setResponseType("success");
    setIsCreateModalOpen(false);
    fetchVacantes();
    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const handleCreateError = (message) => {
    setResponseMessage(message);
    setResponseType("danger");
    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  const fetchVacantes = () => {
    if (idPuesto) {
      fetch(`http://localhost:8080/api/v1/vacantes/puesto/${idPuesto}`)
        .then((response) => response.json())
        .then((data) => {
          setVacantes(data);
          filterVacantes(data, filter);
        })
        .catch((error) => console.error("Error fetching vacantes:", error));
    }
  };

  const filterVacantes = (vacantes, filter) => {
    if (filter === "activa") {
      setFilteredVacantes(
        vacantes.filter((vacante) => vacante.estadoPublicado),
      );
    } else {
      setFilteredVacantes(
        vacantes.filter((vacante) => !vacante.estadoPublicado),
      );
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    filterVacantes(vacantes, newFilter);
  };

  const handleDeleteClick = (vacante) => {
    setVacanteToDelete(vacante);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateClick = (vacante) => {
    setVacanteToUpdate(vacante);
    setNombre(vacante.nombre || "");
    setDescripcion(vacante.descripcion || "");
    setRequisitos(vacante.requisitos || "");
    setModalidad(vacante.modalidad || "");
    setFechaCierre(vacante.fechaCierre || "");
    setUrlImagen(vacante.urlImagen || "");
    setTipoContrato(vacante.tipoContrato?.idTipoContrato || "");
    setCategoriaSalario(vacante.categoriaSalario?.idCategoriaSalario || "");
    setEstadoPublicado(vacante.estadoPublicado);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteVacante = async () => {
    if (vacanteToDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/vacantes/delete/${vacanteToDelete.idVacante}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("Error al eliminar la vacante");
        }

        setResponseMessage("Vacante eliminada exitosamente");
        setResponseType("success");
        setIsDeleteModalOpen(false);
        fetchVacantes();
      } catch (error) {
        setResponseMessage(error.message || "Error al eliminar la vacante");
        setResponseType("danger");
      }

      setTimeout(() => {
        setResponseMessage("");
      }, 3000);
    }
  };

  const handleUpdateVacante = async () => {
    if (vacanteToUpdate) {
      try {
        const payload = {
          nombre,
          descripcion,
          requisitos,
          fechaCierre,
          urlImagen: urlImagen || vacanteToUpdate.urlImagen,
          tipoContrato: { idTipoContrato: parseInt(tipoContrato, 10) },
          jornadaLaboral: vacanteToUpdate.jornadaLaboral,
          modalidad,
          categoriaSalario: {
            idCategoriaSalario: parseInt(categoriaSalario, 10),
          },
          estadoPublicado,
        };

        if (imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);

          const imageUploadResponse = await fetch(
            "http://localhost:8080/api/v1/image/upload",
            {
              method: "POST",
              body: formData,
            },
          );

          if (!imageUploadResponse.ok) {
            throw new Error("Error al subir la imagen");
          }

          const imageUrl = await imageUploadResponse.text();
          payload.urlImagen = imageUrl;
        }

        const response = await fetch(
          `http://localhost:8080/api/v1/vacantes/update/${vacanteToUpdate.idVacante}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error("Error al actualizar la vacante");
        }

        setResponseMessage("Vacante actualizada exitosamente");
        setResponseType("success");
        setIsUpdateModalOpen(false);
        fetchVacantes();
      } catch (error) {
        setResponseMessage(error.message || "Error al actualizar la vacante");
        setResponseType("danger");
      }

      setTimeout(() => {
        setResponseMessage("");
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto max-w-8xl pt-6 px-6 flex-grow mt-7">
      {responseMessage && (
        <Chip
          color={responseType}
          style={{ position: "fixed", top: 80, right: 20 }}
          variant="faded"
        >
          {responseMessage}
        </Chip>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vacantes</h1>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          onClick={handleCreateVacanteClick}
        >
          Crear vacante
        </button>
      </div>
      <Tabs
        aria-label="Filtros de Vacantes"
        color="secondary"
        radius="full"
        onSelectionChange={(key) => handleFilterChange(key)}
      >
        <Tab key="activa" title="Activa">
          <div className="space-y-4">
            {filteredVacantes.map((vacante, index) => (
              <React.Fragment key={vacante.idVacante}>
                <Card className="flex justify-between p-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <img
                        alt="Vacante"
                        src={vacante.urlImagen || "https://placehold.co/40"}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{vacante.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {vacante.modalidad} ·{" "}
                        {new Date(vacante.fechaCierre).toLocaleDateString()} ·{" "}
                        {vacante.aspirantes.length} aspirantes
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Link
                          href={`/dashboard/reclutamiento/view/${vacante.idVacante}`}
                        >
                          <EyeIcon className="h-5 w-5 text-blue-500 cursor-pointer" />
                        </Link>
                        <PencilIcon
                          className="h-5 w-5 text-yellow-500 cursor-pointer"
                          onClick={() => handleUpdateClick(vacante)}
                        />
                        <TrashIcon
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() => handleDeleteClick(vacante)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {vacante.aspirantes.slice(0, 4).map((aspirante, index) => (
                      <img
                        key={index}
                        alt="Aspirante"
                        className="w-8 h-8 rounded-full bg-gray-300"
                        src={aspirante.urlImagen || "https://placehold.co/40"}
                      />
                    ))}
                  </div>
                </Card>
                {index < filteredVacantes.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </Tab>
        <Tab key="no_activa" title="No activa">
          <div className="space-y-4">
            {filteredVacantes.map((vacante, index) => (
              <React.Fragment key={vacante.idVacante}>
                <Card className="flex justify-between p-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <img
                        alt="Vacante"
                        src={vacante.urlImagen || "https://placehold.co/40"}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{vacante.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {vacante.modalidad} ·{" "}
                        {new Date(vacante.fechaCierre).toLocaleDateString()} ·{" "}
                        {vacante.aspirantes.length} aspirantes
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Link
                          href={`/dashboard/reclutamiento/view/${vacante.idVacante}`}
                        >
                          <EyeIcon className="h-5 w-5 text-blue-500 cursor-pointer" />
                        </Link>
                        <PencilIcon
                          className="h-5 w-5 text-yellow-500 cursor-pointer"
                          onClick={() => handleUpdateClick(vacante)}
                        />
                        <TrashIcon
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() => handleDeleteClick(vacante)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {vacante.aspirantes.slice(0, 4).map((aspirante, index) => (
                      <img
                        key={index}
                        alt="Aspirante"
                        className="w-8 h-8 rounded-full bg-gray-300"
                        src={aspirante.urlImagen || "https://placehold.co/40"}
                      />
                    ))}
                  </div>
                </Card>
                {index < filteredVacantes.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </Tab>
      </Tabs>

      <ModalCreateVacante
        fetchVacantes={fetchVacantes}
        handleCreateError={handleCreateError}
        handleCreateSuccess={handleCreateSuccess}
        idPuesto={idPuesto}
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <Modal
        backdrop="blur"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      >
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <p>¿Está seguro de que desea eliminar esta vacante?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              auto
              flat
              color="error"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button auto onPress={handleDeleteVacante}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        backdrop="blur"
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Actualizar Vacante</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <label htmlFor="descripcion">Descripción</label>
                <ReactQuill
                  className="w-full mb-4 bg-gray-50/10"
                  value={descripcion}
                  onChange={setDescripcion}
                />
                <label htmlFor="requisitos">Requisitos</label>
                <ReactQuill
                  className="w-full mb-4 bg-gray-50/10"
                  value={requisitos}
                  onChange={setRequisitos}
                />
                <Select
                  isRequired
                  label="Modalidad"
                  placeholder="Seleccione la modalidad"
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                >
                  <SelectItem key={"Presencial"} value="Presencial">
                    Presencial
                  </SelectItem>
                  <SelectItem key={"Remoto"} value="Remoto">
                    Remoto
                  </SelectItem>
                  <SelectItem key={"Híbrido"} value="Híbrido">
                    Híbrido
                  </SelectItem>
                </Select>
                <Input
                  isRequired
                  label="Fecha de Cierre"
                  type="date"
                  value={fechaCierre}
                  onChange={(e) => setFechaCierre(e.target.value)}
                />
                <Input
                  isRequired
                  accept="image/*"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <Select
                  isRequired
                  label="Tipo de Contrato"
                  placeholder="Seleccione el tipo de contrato"
                  value={tipoContrato}
                  onChange={(e) => setTipoContrato(e.target.value)}
                >
                  {tipoContratos.map((contrato) => (
                    <SelectItem
                      key={contrato.idTipoContrato}
                      value={contrato.idTipoContrato}
                    >
                      {contrato.nombre}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  isRequired
                  label="Categoría de Salario"
                  placeholder="Seleccione la categoría de salario"
                  value={categoriaSalario}
                  onChange={(e) => setCategoriaSalario(e.target.value)}
                >
                  {categoriasSalario.map((categoria) => (
                    <SelectItem
                      key={categoria.idCategoriaSalario}
                      value={categoria.idCategoriaSalario}
                    >
                      {categoria.nombreCategoria}
                    </SelectItem>
                  ))}
                </Select>
                <RadioGroup
                  label="Estado de la Vacante"
                  orientation="horizontal"
                  value={estadoPublicado ? "true" : "false"}
                  onChange={(e) => setEstadoPublicado(e.target.value === "true")}
                >
                  <Radio value="true">Activo</Radio>
                  <Radio value="false">Inactivo</Radio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button auto flat color="error" onPress={onClose}>
                  Cancelar
                </Button>
                <Button auto onPress={handleUpdateVacante}>
                  Actualizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
