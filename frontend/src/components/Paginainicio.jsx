"use client";
import React, { useEffect, useState } from "react";
import { FaSearch, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; 
import ListaEnfrentamientos from "@/app/ListaEnfrentamientos/ListaEnfrentamientos";


 
 


export default function Paginainicio() {
  const [torneos, setTorneos] = useState([]);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const cargarTorneos = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/torneos/?search=${query}`);
      if (response.ok) {
        const data = await response.json();
        const resultados = data.results ? data.results : data;
       
        setTorneos(resultados.slice(0, 3));
      } else {
        toast.error("❌ Error al obtener la lista de torneos.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("❌ Error: " + error.message);
    }
  };

  useEffect(() => {
    cargarTorneos();
  }, [query]);

  return (
    <div
        className="bg-white text-[#111418] min-h-screen flex flex-col overflow-x-hidden"
        style={{
        fontFamily: 'Lexend, "Noto Sans", sans-serif',
        backgroundColor: 'white',
        paddingTop: '60px',  }}
    >
      <main className="flex flex-1 justify-center px-40 py-5">
        <div className="flex flex-col max-w-[960px] gap-10" style={{ width: "820px", borderRadius: "30px" }}>
          {/* Banner */}
          <div
            className="rounded-lg flex justify-end items-end p-4 font-bold text-[28px] leading-tight mb-6"
            style={{
              backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.6), transparent 25%), url("/Banner3.png")',
              color: "white",
              fontFamily: '"Times New Roman", Times, serif',
              height: "312px",
              width: "820px",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>

          
          <div style={{ padding: "2rem" }}>
            <h1 style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <FaTrophy style={{ marginRight: "0.5rem" }} /> Lista de Torneos
            </h1>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <FaSearch style={{ marginRight: "0.5rem" }} />
              <input
                type="text"
                placeholder="Buscar otro torneo."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: "0.5rem", flex: 1, maxWidth: "400px" }}
              />
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {torneos.map((torneo) => (
                <li
                  key={torneo.id}
                  style={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {torneo.imagen && (
                    <div style={{ flex: "0 0 200px" }}>
                      <img
                        src={torneo.imagen}
                        alt="Logo"
                        style={{
                          width: "200px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ display: "flex", alignItems: "center" }}>
                      <FaTrophy style={{ marginRight: "0.5rem" }} /> {torneo.nombre_torneo}
                    </h3>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <FaCalendarAlt style={{ marginRight: "0.5rem" }} /> {torneo.fecha_inicio}
                    </p>
                    <p>{torneo.descripcion_torneo}</p>
                  </div>
                </li>
              ))}
            </ul>

            {torneos.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => router.push("/torneos")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    backgroundColor: "#0070f3",
                    color: "white",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Ver todos los torneos
                </button>
              </div>

            )}
          </div>
          <div>
            
            <ListaEnfrentamientos />
          </div>

       
        </div>
      </main>
    </div>
  );
}
