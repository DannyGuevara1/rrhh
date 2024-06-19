"use client";
import React, { useEffect, useState } from "react";
import parse, { domToReact } from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import { Card } from "@nextui-org/react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
export default function VacantesPuestoViewPage({ params }) {
  const [vacante, setVacante] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const idVacante = params.id;

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/vacantes/get/${idVacante}`)
      .then((response) => response.json())
      .then((data) => {
        setVacante(data.vacante);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vacante:", error);
        setError("Error fetching vacante");
        setIsLoading(false);
      });
  }, [idVacante]);

  const cleanInlineStyles = (htmlString) => {
    const cleanHtml = sanitizeHtml(htmlString, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "span",
        "div",
      ]),
      allowedAttributes: {
        "*": ["class", "id"],
        a: ["href", "name", "target"],
      },
      transformTags: {
        "*": (tagName, attribs) => {
          delete attribs.style;

          return { tagName, attribs };
        },
      },
    });

    return parse(cleanHtml, {
      replace: (domNode) => {
        if (domNode.attribs && domNode.attribs.style) {
          delete domNode.attribs.style;
        }
        if (domNode.children) {
          return domToReact(domNode.children);
        }
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-8xl mx-auto">
      <div className="flex">
        {/* Left card */}
        <Card className="rounded-lg shadow-lg p-6 w-1/4 mr-6">
          <div className="flex flex-col items-center">
            <img
              alt="Vacante Logo"
              className="w-24 h-24 mb-4"
              src={vacante.url_image || "https://placehold.co/100x100"}
            />
            <p className="text-gray-500 mb-2 dark:text-gray-400">
              publicación:{" "}
              {new Date(vacante.fecha_publicacion).toLocaleDateString()}
            </p>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                Puesto
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {vacante.puesto.nombre_puesto}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {vacante.puesto.departamento}
              </p>
            </div>
          </div>
        </Card>

        {/* Right content */}
        <Card className="rounded-lg shadow-lg p-6 w-full">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            {vacante.nombre}
          </h1>
          <p className="text-gray-500 mb-4 dark:text-gray-400">
            {vacante.jornada_laboral} · {vacante.modalidad} · Cierra el{" "}
            {new Date(vacante.fecha_cierre).toLocaleDateString()}
          </p>
          

          <div className="flex space-x-2 mb-4">
            <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300">
              {vacante.categoria_salario.nombre_categoria}
            </span>
            <span className=" text-gray-800 py-1 px-3 rounded-full text-sm dark:bg-green-500 dark:text-gray-950">
              <CurrencyDollarIcon className="h-5 w-5 inline-block" />{" "}
            {vacante.categoria_salario.rango_salarial.minimo} -{" "}
            {vacante.categoria_salario.rango_salarial.maximo}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
              Descripción
            </h2>
            <div className="custom-html-content">
              {cleanInlineStyles(vacante.descripcion)}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
              Requisitos
            </h2>
            <div className="custom-html-content">
              {cleanInlineStyles(vacante.requisitos)}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
              Tipo de Contrato
            </h2>
            <p className="text-gray-700 mb-2 dark:text-gray-300">
              {vacante.tipo_contrato.nombre_tipo_contrato}
            </p>
            <p className="text-gray-700 mb-2 dark:text-gray-300">
              {vacante.tipo_contrato.descripcion}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
              Beneficios
            </h2>
            <ul className="list-disc list-inside dark:text-gray-300">
              {vacante.tipo_contrato.beneficios.map((beneficio) => (
                <li
                  key={beneficio.idBeneficio}
                  className="text-gray-700 mb-2 dark:text-gray-300"
                >
                  {beneficio.nombre}: {beneficio.descripcion}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
