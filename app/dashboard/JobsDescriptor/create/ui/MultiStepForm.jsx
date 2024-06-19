"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@nextui-org/card";

import Sidebar from "./Sidebar";
import Step1SelectDepartment from "./Step1SelectDepartment";
import Step2CreateJobPosition from "./Step2CreateJobPosition";
import Step3CreateSections from "./Step3CreateSection";
import Step4AddFieldToSection from "./Step4AddFieldToSection";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [departmentId, setDepartmentId] = useState(null);
  const [jobPositionId, setJobPositionId] = useState(null);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSelectDepartment = (department) => {
    setDepartmentId(department.id_departamento);
    handleNextStep();
  };

  const handleCreateJobPosition = (id_puesto) => {
    setJobPositionId(id_puesto);
    handleNextStep();
  };

  const handleCompleteSections = () => {
    handleNextStep();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1SelectDepartment onSelectDepartment={handleSelectDepartment} />
        );
      case 2:
        return (
          <Step2CreateJobPosition
            departmentId={departmentId}
            onCreateJobPosition={handleCreateJobPosition}
          />
        );
      case 3:
        return (
          <Step3CreateSections
            jobPositionId={jobPositionId}
            onComplete={handleCompleteSections}
          />
        );
      case 4:
        return <Step4AddFieldToSection jobPositionId={jobPositionId} />;
      default:
        return (
          <Step1SelectDepartment onSelectDepartment={handleSelectDepartment} />
        );
    }
  };

  return (
    <Card className="text-white flex md:flex-row flex-col">
      <Sidebar currentStep={step} />
      <CardBody className="flex-1 flex flex-col items-center justify-center p-8">
        {renderStepContent()}
      </CardBody>
    </Card>
  );
};

export default MultiStepForm;
