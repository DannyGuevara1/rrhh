"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
export default function ReclutamientoPage() {
  const [puestos, setPuestos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch puestos from the API
    fetch("http://localhost:8080/api/v1/puesto/allFilter")
      .then((response) => response.json())
      .then((data) => setPuestos(data))
      .catch((error) => console.error("Error fetching puestos:", error));
  }, []);

  const handleButtonClick = (idPuesto) => {
    router.push(`/dashboard/reclutamiento/${idPuesto}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {puestos.map((puesto) => (
        <Card
          key={puesto.id_puesto}
          isFooterBlurred
          className="w-full h-[300px] bg-[#f7ef8c] dark:bg-[#5046e5]"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <h4 className="font-medium text-xl">{puesto.titulo}</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-fill"
            src="https://firebasestorage.googleapis.com/v0/b/storage-18068.appspot.com/o/resources%2FDocuments-bro.svg?alt=media&token=40286a32-2e9f-4b02-801e-4af3f3007833"
          />
          <CardFooter className="absolute bg-white/40 dark:bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <Image
                alt="Breathing app icon"
                className="rounded-full w-10 h-11 bg-black"
                src="https://nextui.org/images/breathing-app-icon.jpeg"
              />
              <div className="flex flex-col">
                <p className="text-tiny dark:text-white/60">
                  {puesto.departamento.nombre}
                </p>
                <p className="text-tiny dark:text-white/60">
                  {new Date(puesto.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              radius="full"
              size="sm"
              onPress={() => handleButtonClick(puesto.id_puesto)}
            >
              Vacantes
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
