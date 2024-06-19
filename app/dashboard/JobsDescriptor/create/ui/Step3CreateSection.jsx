import React, { useState } from "react";
import axios from "axios";
import { Input, Button } from "@nextui-org/react";

import NotificationChip from "../../../../../components/NotificationChip.jsx";

const Step3CreateSections = ({ jobPositionId, onComplete }) => {
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddSection = () => {
    const data = { ...formData, puesto: { id_puesto: jobPositionId } };

    axios
      .post("http://localhost:8080/api/v1/seccion/create", data)
      .then((response) => {
        setSections((prevSections) => [...prevSections, response.data]);
        setFormData({ nombre: "", descripcion: "" });
        setShowNotification(true);
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = () => {
    onComplete();
  };

  return (
    <div className="p-10 w-full flex-col">
      <h2>Create Sections</h2>
      {showNotification && (
        <NotificationChip color="success" message="Seccion agregada!" />
      )}
      <Input
        fullWidth
        label="Nombre de la seccion"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        className="mt-4 mb-4"
      />
      <Input
        fullWidth
        label="Descripcion de la seccion"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
      />
      <Button onClick={handleAddSection}>Add Section</Button>
      {sections.length > 0 && (
        <Button style={{ marginTop: "40px" }} onClick={handleSubmit}>
          Next Step
        </Button>
      )}
    </div>
  );
};

export default Step3CreateSections;
