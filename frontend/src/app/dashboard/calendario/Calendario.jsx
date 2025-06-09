"use client";
import React, { useEffect, useState } from "react";

export default function Calendario() {
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    const cargarPartidos = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/partidos/");
      if (response.ok) {
        const data = await response.json();
        setPartidos(data);
      }
    };
    cargarPartidos();
  }, []);

  const generarPDF = async () => {
  
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("calendario-html");
    const opciones = {
      margin: 10,
      filename: "calendario.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opciones).save();
  };

  return (
    <div style={{ margin: "2rem" }}>
      <div
        id="calendario-html"
        style={{
          background: "white",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <img src="/umes2.png" alt="logo" width={200} />
          <img src="/Ligapro2.png" alt="logo" width={200} />
        </div>

        <h1 style={{ textAlign: "center" }}>Calendario de Partidos</h1>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Enfrentamiento
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Fecha
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Hora Inicio
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Hora Fin
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Cancha
              </th>
            </tr>
          </thead>
          <tbody>
            {partidos.map((p) => (
              <tr key={p.id_partido}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.equipo_local_nombre} vs {p.equipo_visitante_nombre}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.fecha_partido}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.hora_inicio_ampm}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.hora_fin_ampm}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.cancha_nombre}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

       
        <div
          style={{
            borderTop: "1px solid #ccc",
            marginTop: "1rem",
            paddingTop: "0.5rem",
            fontSize: "0.8rem",
            textAlign: "center",
            color: "#555",
          }}
        >
          <p>Generado por sistema ligaPro - {new Date().toLocaleDateString()}</p>
          <img src="/Recurso 2.png" alt="logo" width={250} />
        </div>
      </div>

      <button
        onClick={generarPDF}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          backgroundColor: "#0070f3",
          color: "white",
          cursor: "pointer",
          border: "none",
        }}
      >
        Descargar PDF
      </button>
    </div>
  );
}
