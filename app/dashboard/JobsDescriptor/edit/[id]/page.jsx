"use client";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Spinner,
  Card,
  Button,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Spacer,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";

const BasicInfoForm = ({ jobDetails, setJobDetails, departments }) => {
  const updateField = (field, value) => {
    setJobDetails({ ...jobDetails, [field]: value });
  };

  const saveChanges = async () => {
    const jobData = {
      id_puesto: jobDetails.id_puesto,
      titulo: jobDetails.titulo,
      operacion_area: jobDetails.operacion_area,
      puesto_reporta: jobDetails.puesto_reporta,
      puestos_reportan: jobDetails.puestos_reportan,
      directos: jobDetails.directos,
      indirectos: jobDetails.indirectos,
      directos_personas: jobDetails.directos_personas,
      indirectos_personas: jobDetails.indirectos_personas,
      departamento: jobDetails.departamento,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/v1/puesto/update/${jobDetails.id_puesto}`,
        jobData,
      );
      alert("Cambios guardados exitosamente");
    } catch (error) {
      alert("Error al guardar los cambios: " + error.message);
    }
  };

  return (
    <>
      <Input
        bordered
        clearable
        initialValue={jobDetails.titulo}
        label="Título del Puesto"
        value={jobDetails.titulo}
        onChange={(e) => updateField("titulo", e.target.value)}
      />
      <Input
        bordered
        clearable
        initialValue={jobDetails.operacion_area}
        label="Área de Operación"
        value={jobDetails.operacion_area}
        onChange={(e) => updateField("operacion_area", e.target.value)}
      />
      <Input
        bordered
        clearable
        initialValue={jobDetails.puesto_reporta}
        label="Puesto que Reporta"
        value={jobDetails.puesto_reporta}
        onChange={(e) => updateField("puesto_reporta", e.target.value)}
      />
      <Input
        bordered
        clearable
        initialValue={jobDetails.puestos_reportan}
        label="Puestos que Reportan"
        value={jobDetails.puestos_reportan}
        onChange={(e) => updateField("puestos_reportan", e.target.value)}
      />
      <Spacer y={1} />
      <Input
        bordered
        clearable
        label="Directos"
        type="number"
        value={jobDetails.directos}
        onChange={(e) => updateField("directos", e.target.value)}
      />
      <Input
        bordered
        clearable
        label="Indirectos"
        type="number"
        value={jobDetails.indirectos}
        onChange={(e) => updateField("indirectos", e.target.value)}
      />
      <Input
        bordered
        clearable
        label="Directos Personas"
        type="number"
        value={jobDetails.directos_personas}
        onChange={(e) => updateField("directos_personas", e.target.value)}
      />
      <Input
        bordered
        clearable
        label="Indirectos Personas"
        type="number"
        value={jobDetails.indirectos_personas}
        onChange={(e) => updateField("indirectos_personas", e.target.value)}
      />
      <Spacer y={1} />
      <Select
        label="Departamento"
        labelPlacement="outside"
        onChange={(e) =>
          updateField("departamento", { id_departamento: e.target.value })
        }
      >
        {departments.map((dept) => (
          <SelectItem key={dept.id_departamento}>{dept.nombre}</SelectItem>
        ))}
      </Select>
      {/* Botón para actualizar la información básica */}
      <Button onClick={saveChanges}>Guardar Cambios</Button>
    </>
  );
};

const SectionsForm = ({ sections, fetchJobDetails }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAddField,
    onOpen: onOpenAddField,
    onOpenChange: onOpenChangeAddField,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteField,
    onOpen: onOpenDeleteField,
    onOpenChange: onOpenChangeDeleteField,
  } = useDisclosure();
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  const updateSectionName = async (sectionId, name) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/seccion/update/${sectionId}`,
        {
          nombre: name,
        },
      );
    } catch (error) {
      alert("Error al actualizar el nombre de la sección: " + error.message);
    }
  };

  const updateSectionDescription = async (sectionId, description) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/seccion/update/${sectionId}`,
        {
          descripcion: description,
        },
      );
    } catch (error) {
      alert(
        "Error al actualizar la descripción de la sección: " + error.message,
      );
    }
  };

  const updateFieldName = async (fieldId, name) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/camposSeccion/update/${fieldId}`,
        {
          campo_nombre: name,
        },
      );
    } catch (error) {
      alert("Error al actualizar el nombre del campo: " + error.message);
    }
  };

  const updateFieldValue = async (fieldId, value) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/camposSeccion/update/${fieldId}`,
        {
          campo_valor: value,
        },
      );
    } catch (error) {
      alert("Error al actualizar el valor del campo: " + error.message);
    }
  };

  const handleAddFieldClick = (sectionId) => {
    setSelectedSection(sectionId);
    onOpenAddField();
  };

  const handleDeleteSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    onOpen();
  };

  const handleDeleteFieldClick = (fieldId) => {
    setSelectedField(fieldId);
    onOpenDeleteField();
  };

  return sections.map((section, index) => (
    <>
      <Card key={index} css={{ mw: "600px" }}>
        <CardHeader>
          <Input
            defaultValue={section.nombre || ""}
            label="Nombre de la Sección"
            labelPlacement="outside"
            onChange={(e) =>
              updateSectionName(section.id_seccion, e.target.value)
            }
          />
        </CardHeader>
        <CardBody>
          <Textarea
            defaultValue={section.descripcion || ""}
            label="Descripción de la Sección"
            labelPlacement="outside"
            placeholder={section.descripcion || "No hay descripción"}
            onChange={(e) =>
              updateSectionDescription(section.id_seccion, e.target.value)
            }
          />
          {section.campos_seccion.length != 0 && (
            <h3 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
              Campos de la seccion {section.nombre}
            </h3>
          )}
          {section.campos_seccion.map((campo, idx) => (
            <div key={idx}>
              <Input
                bordered
                clearable
                defaultValue={campo.campo_nombre}
                onChange={(e) =>
                  updateFieldName(campo.id_campo, e.target.value)
                }
              />
              <Textarea
                defaultValue={campo.campo_valor}
                label="Valor del Campo"
                onChange={(e) =>
                  updateFieldValue(campo.id_campo, e.target.value)
                }
              />
              <Button
                color="danger"
                variant="ghost"
                onClick={() => handleDeleteFieldClick(campo.id_campo)}
              >
                Eliminar Campo
              </Button>
              <Spacer y={0.5} />
            </div>
          ))}
          <Button
            auto
            color="secondary"
            onClick={() => handleAddFieldClick(section.id_seccion)}
          >
            Agregar Campo
          </Button>
        </CardBody>
        <CardFooter>
          <Button
            color="danger"
            variant="shadow"
            onClick={() => handleDeleteSectionClick(section.id_seccion)}
          >
            Eliminar Sección
          </Button>
        </CardFooter>
      </Card>
      <ModalDeleteSection
        fetchJobDetails={fetchJobDetails}
        isOpen={isOpen}
        sectionId={selectedSection}
        onOpenChange={onOpenChange}
      />
      {selectedSection === section.id_seccion && (
        <ModalAddField
          fetchJobDetails={fetchJobDetails}
          isOpen={isOpenAddField}
          sectionId={selectedSection}
          onOpenChange={onOpenChangeAddField}
        />
      )}
      {selectedField && (
        <ModalDeleteField
          fetchJobDetails={fetchJobDetails}
          fieldId={selectedField}
          isOpen={isOpenDeleteField}
          onOpenChange={onOpenChangeDeleteField}
        />
      )}
    </>
  ));
};

const ModalDeleteSection = ({
  isOpen,
  onOpenChange,
  sectionId,
  fetchJobDetails,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/seccion/delete/${sectionId}`,
      );
      console.log(sectionId);
      alert("Sección eliminada exitosamente");
      fetchJobDetails();
      onOpenChange(false);
    } catch (error) {
      alert("Error al eliminar la sección: " + error.message);
    }
  };

  return (
    <Modal
      key={sectionId}
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
              Eliminar Sección
            </ModalHeader>
            <ModalBody>
              <p>¿Estás seguro que deseas eliminar esta sección?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleDelete}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ModalAddField = ({
  isOpen,
  onOpenChange,
  sectionId,
  fetchJobDetails,
}) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleSave = async () => {
    const fieldData = {
      campo_nombre: fieldName,
      campo_valor: fieldValue,
      seccion: {
        id_seccion: sectionId,
      },
    };

    try {
      await axios.post(
        "http://localhost:8080/api/v1/camposSeccion/create",
        fieldData,
      );
      alert("Campo creado exitosamente");
      fetchJobDetails();
      onOpenChange(false);
    } catch (error) {
      alert("Error al crear el campo: " + error.message);
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="top-center"
      size="xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Agregar Campo
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nombre del Campo"
                labelPlacement="outside"
                value={fieldName}
                variant="bordered"
                onChange={(e) => setFieldName(e.target.value)}
              />
              <Textarea
                label="Valor del Campo"
                labelPlacement="outside"
                value={fieldValue}
                variant="bordered"
                onChange={(e) => setFieldValue(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={handleSave}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ModalDeleteField = ({
  isOpen,
  onOpenChange,
  fieldId,
  fetchJobDetails,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/camposSeccion/${fieldId}`,
      );
      alert("Campo eliminado exitosamente");
      fetchJobDetails();
      onOpenChange(false);
    } catch (error) {
      alert("Error al eliminar el campo: " + error.message);
    }
  };

  return (
    <Modal
      key={fieldId}
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
              Eliminar Campo
            </ModalHeader>
            <ModalBody>
              <p>¿Estás seguro que deseas eliminar este campo?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleDelete}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ModalAddSection = ({ isOpen, onOpenChange, jobId, fetchJobDetails }) => {
  const [sectionName, setSectionName] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");

  const handleSave = async () => {
    const sectionData = {
      puesto: {
        id_puesto: jobId,
      },
      nombre: sectionName,
      descripcion: sectionDescription,
    };

    try {
      await axios.post(
        "http://localhost:8080/api/v1/seccion/create",
        sectionData,
      );
      alert("Sección creada exitosamente");
      fetchJobDetails();
      onOpenChange(false);
    } catch (error) {
      alert("Error al crear la sección: " + error.message);
    }
  };

  return (
    <Modal
      key={jobId}
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
              Agregar sección
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nombre de la sección"
                labelPlacement="outside"
                value={sectionName}
                variant="bordered"
                onChange={(e) => setSectionName(e.target.value)}
              />
              <Textarea
                label="Descripción de la sección"
                labelPlacement="outside"
                value={sectionDescription}
                variant="bordered"
                onChange={(e) => setSectionDescription(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={handleSave}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default function JobsDescriptorEditPage({ params }) {
  // const router = useRouter();
  const id = params.id;
  const [jobDetails, setJobDetails] = useState(null);
  const [departments, setDepartments] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar los detalles del puesto
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const jobResponse = await axios.get(
        `http://localhost:8080/api/v1/puesto/${id}`,
      );

      setJobDetails(jobResponse.data);
      const deptResponse = await axios.get(
        "http://localhost:8080/api/v1/departamento/all",
      );

      setDepartments(deptResponse.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Cargar detalles al montar el componente
  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  if (loading) return <Spinner type="points">Cargando...</Spinner>;
  if (error) return <p color="error">{error}</p>;
  if (!jobDetails) return <p>No se encontró la información del puesto.</p>;

  return (
    <Card>
      <Button color="success" onPress={onOpen}>
        Agregar Sección
      </Button>
      <ModalAddSection
        fetchJobDetails={fetchJobDetails}
        isOpen={isOpen}
        jobId={id}
        onOpenChange={onOpenChange}
      />
      <CardHeader>
        <h1>Editar Descriptor de Puesto</h1>
      </CardHeader>
      <CardBody>
        {/* Aquí agregarías los formularios y controles para editar el puesto */}
        <BasicInfoForm
          departments={departments}
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
        />
        <Spacer y={1.5} />
        <SectionsForm
          fetchJobDetails={fetchJobDetails}
          sections={jobDetails?.secciones || []}
        />
        <Button onClick={fetchJobDetails}>Recargar Datos</Button>
      </CardBody>
    </Card>
  );
}
