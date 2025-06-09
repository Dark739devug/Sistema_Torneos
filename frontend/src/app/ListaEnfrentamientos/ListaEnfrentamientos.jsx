"use client";
import React, { useEffect, useState } from "react";
import { FaFutbol } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ListaEnfrentamientos() {
  const [enfrentamientos, setEnfrentamientos] = useState([]);

  const cargarEnfrentamientos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/partidos/");
      if (response.ok) {
        const data = await response.json();
        setEnfrentamientos(data);
      } else {
        toast.error("❌ Error al obtener los enfrentamientos.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("❌ Error: " + error.message);
    }
  };

  useEffect(() => {
    cargarEnfrentamientos();
  }, []);

  return (
    <div
      className="bg-white text-[#111418] py-8 px-4 flex flex-col gap-4"
      style={{
        fontFamily: 'Lexend, "Noto Sans", sans-serif',
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FaFutbol /> Lista de Enfrentamientos
      </h2>

      {enfrentamientos.length === 0 ? (
        <p>No hay enfrentamientos disponibles.</p>
      ) : (
        enfrentamientos.map((partido) => (
          <div
            key={partido.id_partido}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "1rem",
              background: "#f9f9f9",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>
              {partido.enfrentamiento}
            </h3>
            <p style={{ margin: "0.2rem 0" }}>
              Fecha: {partido.fecha_partido}
            </p>
            <p style={{ margin: "0.2rem 0" }}>
              Cancha: {partido.cancha_nombre}
            </p>
            <p style={{ margin: "0.2rem 0" }}>
              Estado: {partido.estado}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
