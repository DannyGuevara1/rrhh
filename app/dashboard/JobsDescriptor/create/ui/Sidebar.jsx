import React from "react";

import StepIndicator from "./StepIndicator";

const Sidebar = ({ currentStep }) => {
  return (
    <div className="w-64 p-6">
      <StepIndicator
        isActive={currentStep === 1}
        stepNumber={1}
        title="Seleccionar Departamento"
      />
      <StepIndicator
        isActive={currentStep === 2}
        stepNumber={2}
        title="Crear Puesto de Trabajo"
      />
      <StepIndicator
        isActive={currentStep === 3}
        stepNumber={3}
        title="Crear Secciones"
      />
      <StepIndicator
        isActive={currentStep === 4}
        stepNumber={4}
        title="Agregar Campo a Sección"
      />
    </div>
  );
};

export default Sidebar;
