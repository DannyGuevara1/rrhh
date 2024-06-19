"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@nextui-org/card";
import "react-quill/dist/quill.snow.css"; // Importa los estilos de Quill

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function CrearVacantePage() {
  const [conversationType, setConversationType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log({ conversationType, title, description, category, tags });
  };

  return (
    <Card className="mx-auto max-w-2xl rounded-lg p-6 shadow-md">
      <h1 className="mb-2 text-2xl font-bold">Nueva Vacante</h1>
      <p className="mb-6">
        Pregunta algo, inicia una discusión o comparte una idea.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="question" className="mb-1 block font-medium">
            ¿Qué tipo de conversación estás creando?
          </label>
          <div className="flex items-center">
            <input
              className="mr-2"
              id="question"
              name="conversation_type"
              type="radio"
              value="question"
              onChange={(e) => setConversationType(e.target.value)}
            />
            <label className="mr-4" htmlFor="question">
              Pregunta
            </label>
            <input
              className="mr-2"
              id="discussion"
              name="conversation_type"
              type="radio"
              value="discussion"
              onChange={(e) => setConversationType(e.target.value)}
            />
            <label htmlFor="discussion">Discusión</label>
            <i className="fas fa-info-circle ml-2 text-gray-400" />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block font-medium" htmlFor="title">
            Título
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-2"
            id="title"
            placeholder="Ingresa el título aquí"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block font-medium" htmlFor="description">
            Descripción
          </label>
          <div className="rounded-lg border border-gray-300">
            <ReactQuill
              className="w-full"
              placeholder="Añade tantos detalles como sea posible..."
              value={description}
              onChange={setDescription}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block font-medium" htmlFor="category">
            Categoría
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Elige tu categoría</option>
            {/* Aquí puedes agregar más opciones */}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-1 block font-medium" htmlFor="tags">
            Etiquetas (Opcional)
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-2"
            id="tags"
            placeholder="Añadir etiquetas"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button
          className="rounded-lg bg-black px-4 py-2 text-white"
          type="submit"
        >
          Crear
        </button>
      </form>
    </Card>
  );
}
