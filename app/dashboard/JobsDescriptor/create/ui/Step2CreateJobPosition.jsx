import React, { useState } from "react";
import axios from "axios";
import { Input, Button } from "@nextui-org/react";

import NotificationChip from "../../../../../components/NotificationChip.jsx";

const Step2CreateJobPosition = ({ departmentId, onCreateJobPosition }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    operacion_area: "",
    puesto_reporta: "",
    puestos_reportan: "",
    directos: 0,
    indirectos: 0,
    directos_personas: 0,
    indirectos_personas: 0,
  });
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      departamento: { id_departamento: departmentId },
    };

    axios
      .post("http://localhost:8080/api/v1/puesto/create", data)
      .then((response) => {
        onCreateJobPosition(response.data.id_puesto);
        setShowNotification(true);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="w-full grid grid-cols-5 grid-rows-4 gap-4">
      {showNotification && (
        <NotificationChip
          color="success"
          message="Job position created successfully!"
        />
      )}
      <div className="col-span-2">
        <Input fullWidth label="Titulo" name="titulo" onChange={handleChange} />
      </div>

      <div className="col-span-2 col-start-3">
        <Input
          label="Area de Operacion"
          name="operacion_area"
          onChange={handleChange}
        />
      </div>

      <div className="col-span-2 col-start-1 row-start-2">
        <Input
          fullWidth
          label="Puestos que reporta"
          name="puesto_reporta"
          onChange={handleChange}
        />
      </div>

      <Input
        fullWidth
        className="col-span-2 col-start-3 row-start-2"
        label="Puestos que le reportan"
        name="puestos_reportan"
        onChange={handleChange}
      />
      <Input
        fullWidth
        label="Directos"
        name="directos"
        type="number"
        onChange={handleChange}
      />
      <Input
        fullWidth
        label="Indirectos"
        name="indirectos"
        type="number"
        onChange={handleChange}
      />
      <Input
        fullWidth
        label="Personas Directas"
        name="directos_personas"
        type="number"
        onChange={handleChange}
      />
      <Input
        fullWidth
        label="Personas Indirectas"
        name="indirectos_personas"
        type="number"
        onChange={handleChange}
      />
      <Button className="col-start-4 row-start-4" onClick={handleSubmit}>
        Crear Puesto
      </Button>
    </div>
  );
};

export default Step2CreateJobPosition;
