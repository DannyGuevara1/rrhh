import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import NotificationChip from "../../../../../components/NotificationChip.jsx";

const Step4AddFieldToSection = ({ jobPositionId }) => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    campo_nombre: "",
    campo_valor: "",
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/v1/seccion/findAllByPuestoId/${jobPositionId}`,
      )
      .then((response) => setSections(response.data))
      .catch((error) => console.error(error));
  }, [jobPositionId]);

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      seccion: { id_seccion: selectedSection.id_seccion },
    };

    axios
      .post("http://localhost:8080/api/v1/camposSeccion/create", data)
      .then((response) => {
        setShowNotification(true);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="p-10 flex-1 w-full flex-col gap-3">
      <h2>Add Field to Section</h2>
      {showNotification && (
        <NotificationChip color="success" message="Campo agregado!" />
      )}
      <Dropdown>
        <DropdownTrigger>
          <Button>
            {selectedSection ? selectedSection.nombre : "Selecionar Seccion"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Sections">
          {sections.map((section) => (
            <DropdownItem
              key={section.id_seccion}
              onClick={() => handleSectionSelect(section)}
            >
              {section.nombre}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Input
        fullWidth
        label="Nombre del Campo"
        name="campo_nombre"
        onChange={handleChange}
      />
      <Input
        fullWidth
        label="Valor del Campo"
        name="campo_valor"
        onChange={handleChange}
      />
      <Button onClick={handleSubmit}>Add Field</Button>
    </div>
  );
};

export default Step4AddFieldToSection;
