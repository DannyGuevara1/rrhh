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
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Importar estilos de Quill

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ModalCreateVacante = ({
  isOpen,
  onOpenChange,
  fetchVacantes,
  handleCreateSuccess,
  handleCreateError,
  idPuesto,
}) => {
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
  const [nombreError, setNombreError] = useState("");
  const [fechaCierreError, setFechaCierreError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoContratosRes, categoriasSalarioRes] = await Promise.all([
          fetch("http://localhost:8080/api/v1/tipoContrato/all").then((res) =>
            res.json(),
          ),
          fetch("http://localhost:8080/api/v1/categoriaSalario/all").then(
            (res) => res.json(),
          ),
        ]);

        setTipoContratos(tipoContratosRes.tipoContratos);
        setCategoriasSalario(categoriasSalarioRes.categoriasSalario);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validateFields = () => {
    if (!nombre) {
      setNombreError("Debe ingresar un nombre válido");

      return false;
    }
    if (!fechaCierre) {
      setFechaCierreError("Debe ingresar una fecha de cierre válida");

      return false;
    }
    if (!imageFile) {
      handleCreateError("Debe subir una imagen");

      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateFields()) {
      return;
    }

    let imageUrl = "";

    try {
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

      imageUrl = await imageUploadResponse.text();
      setUrlImagen(imageUrl);
    } catch (error) {
      handleCreateError("Error al subir la imagen");
      console.error("Error uploading image:", error);

      return;
    }

    const payload = {
      nombre,
      descripcion,
      requisitos,
      fechaCierre,
      urlImagen: imageUrl,
      tipoContrato: { idTipoContrato: parseInt(tipoContrato, 10) },
      jornadaLaboral: "Jornada Diurna",
      modalidad,
      puesto: { id_puesto: parseInt(idPuesto, 10) },
      categoriaSalario: { idCategoriaSalario: parseInt(categoriaSalario, 10) },
      estadoPublicado,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/vacantes/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Error al crear la vacante");
      }

      handleCreateSuccess("Vacante creada exitosamente");
      fetchVacantes();
    } catch (error) {
      handleCreateError(error.message || "Error al crear la vacante");
      console.error("Error creating vacante:", error);
    }

    onOpenChange(false);
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="auto"
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Crear Vacante
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                errorMessage={nombreError}
                isInvalid={!!nombreError}
                label="Nombre"
                labelPlacement="outside"
                placeholder="Ingrese el nombre de la vacante"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (e.target.value) {
                    setNombreError("");
                  }
                }}
              />
              <label htmlFor="descripcion">Descripción</label>
              <ReactQuill
                className="w-full mb-4 bg-white/30"
                placeholder="Añade una descripción detallada de la vacante..."
                value={descripcion}
                onChange={setDescripcion}
              />
              <label htmlFor="requisitos">Requisitos</label>
              <ReactQuill
                className="w-full mb-4 bg-white/30"
                placeholder="Añade los requisitos para la vacante..."
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
                errorMessage={fechaCierreError}
                isInvalid={!!fechaCierreError}
                label="Fecha de Cierre"
                labelPlacement="outside"
                placeholder="Ingrese la fecha de cierre"
                type="date"
                value={fechaCierre}
                onChange={(e) => {
                  setFechaCierre(e.target.value);
                  if (e.target.value) {
                    setFechaCierreError("");
                  }
                }}
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
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleCreate}>
                Crear
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCreateVacante;
