"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Divider, Button } from "@nextui-org/react";
export default function JobsDescriptorViewPage({ params }) {
  const [puesto, setPuesto] = useState(null);
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    if (id) {
      const fetchPuesto = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/puesto/${id}`,
          );
          const data = await response.json();

          setPuesto(data);
        } catch (error) {
          console.error("Error fetching puesto:", error);
        }
      };

      fetchPuesto();
    }
  }, [id]);

  if (!puesto) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button className="mr-2" color="primary" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
      <Card>
        <CardBody>
          <h1 className="text-3xl font-bold">{puesto.titulo}</h1>
          <h3 className="text-xl font-semibold">
            Departamento: {puesto.departamento.nombre}
          </h3>
          <p>{puesto.departamento.descripcion}</p>
          <Divider className="my-5" />
          <h4 className="text-lg font-semibold">
            Operación Area: {puesto.operacion_area}
          </h4>
          <p>Puesto Reporta: {puesto.puesto_reporta}</p>
          <p>Puestos Reportan: {puesto.puestos_reportan}</p>
          <p>Directos: {puesto.directos}</p>
          <p>Indirectos: {puesto.indirectos}</p>
          <p>Personas Directas: {puesto.directos_personas}</p>
          <p>Personas Indirectas: {puesto.indirectos_personas}</p>
          <Divider className="my-5" />
          {puesto.secciones.map((seccion) => (
            <div key={seccion.id_seccion}>
              <h3 className="text-xl font-semibold">{seccion.nombre}</h3>
              <p>{seccion.descripcion}</p>
              {seccion.campos_seccion.map((campo) => (
                <div key={campo.id_campo} className="ml-4">
                  <h4 className="text-lg font-semibold">
                    {campo.campo_nombre}
                  </h4>
                  <p>{campo.campo_valor}</p>
                </div>
              ))}
              <Divider className="my-5" />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
