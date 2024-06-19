"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
} from "@nextui-org/react";

export default function DocsPage() {
  const [vacantes, setVacantes] = useState([]);
  const [selectedVacante, setSelectedVacante] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/vacantes/getAll")
      .then((response) => response.json())
      .then((data) => {
        const activeVacantes = data.filter(
          (vacante) => vacante.estado_publicado,
        );

        setVacantes(activeVacantes);
      })
      .catch((error) => console.error("Error fetching vacantes:", error));
  }, []);

  const handleMoreDetailsClick = (vacante) => {
    setSelectedVacante(vacante);
    setIsModalOpen(true);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }

    return text;
  };

  return (
    <div className="container mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">Ofertas de trabajo</h1>

      {vacantes.map((vacante) => (
        <Card
          key={vacante.id_vacante}
          className="max-w-s border-2 border-pink-200 rounded-lg p-6 shadow-lg relative"
        >
          <div className="flex items-center mb-4">
            <img
              alt="Vacante Logo"
              className="w-10 h-10 mr-2"
              src={vacante.url_image || "https://placehold.co/40x40"}
            />
            <h2 className="text-xl font-bold">
              {vacante.nombre}{" "}
              <i className="fas fa-check-circle text-blue-500" />
            </h2>
          </div>
          <p className="text-gray-700 mb-4">
            {truncateText(vacante.descripcion.replace(/<[^>]+>/g, ""), 100)}
          </p>
          <div className="flex space-x-2 mb-4">
            <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-sm">
              {vacante.modalidad}
            </span>
            <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-sm">
              {vacante.jornada_laboral}
            </span>
            <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-sm">
              ${vacante.categoria_salario.rango_salarial.minimo} - $
              {vacante.categoria_salario.rango_salarial.maximo}
            </span>
          </div>
          <div className="flex items-center text-gray-500 mb-4">
            <i className="fas fa-calendar-alt mr-2" />
            <span>
              Fecha de cierre:{" "}
              {new Date(vacante.fecha_cierre).toLocaleDateString()}
            </span>
          </div>
          <div className="flex space-x-4">
            <button className="bg-purple-600 text-white py-2 px-4 rounded-full w-full">
              Aplicar ahora
            </button>
            <button
              className="bg-gray-200 text-gray-600 py-2 px-4 rounded-full w-full"
              onClick={() => handleMoreDetailsClick(vacante)}
            >
              Ver más detalles
            </button>
          </div>
          <i className="fas fa-ellipsis-h absolute top-2 right-2 text-gray-400" />
        </Card>
      ))}

      {selectedVacante && (
        <Modal
          backdrop="blur"
          isOpen={isModalOpen}
          onOpenChange={() => setIsModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader>{selectedVacante.nombre}</ModalHeader>
            <ModalBody>
              <p>
                <strong>Descripción:</strong>
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedVacante.descripcion,
                }}
              />
              <p>
                <strong>Requisitos:</strong>
              </p>
              <div
                dangerouslySetInnerHTML={{ __html: selectedVacante.requisitos }}
              />
              <p>
                <strong>Tipo de Contrato:</strong>{" "}
                {selectedVacante.tipo_contrato.nombre_tipo_contrato}
              </p>
              <p>
                <strong>Jornada Laboral:</strong>{" "}
                {selectedVacante.jornada_laboral}
              </p>
              <p>
                <strong>Modalidad:</strong> {selectedVacante.modalidad}
              </p>
              <p>
                <strong>Rango Salarial:</strong> $
                {selectedVacante.categoria_salario.rango_salarial.minimo} - $
                {selectedVacante.categoria_salario.rango_salarial.maximo}
              </p>
              <p>
                <strong>Puesto:</strong> {selectedVacante.puesto.nombre_puesto}{" "}
                - {selectedVacante.puesto.departamento}
              </p>
              <p>
                <strong>Beneficios:</strong>
              </p>
              <ul className="list-disc list-inside">
                {selectedVacante.tipo_contrato.beneficios.map((beneficio) => (
                  <li key={beneficio.idBeneficio}>
                    {beneficio.nombre}: {beneficio.descripcion}
                  </li>
                ))}
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button
                auto
                flat
                color="error"
                onPress={() => setIsModalOpen(false)}
              >
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
