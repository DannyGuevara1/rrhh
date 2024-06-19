import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, SelectItem } from "@nextui-org/react";

const Step1SelectDepartment = ({ onSelectDepartment, onNext }) => {
  const [departments, setDepartments] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/departamento/all")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
    onSelectDepartment(value);
  };

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center ">
        <Select className="max-w-xs" label="Selecionar Departamento">
          {departments.map((dept) => (
            <SelectItem
              key={dept.id_departamento}
              onClick={() => handleSelect(dept)}
            >
              {dept.nombre}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
};

export default Step1SelectDepartment;
