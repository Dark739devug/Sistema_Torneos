"use client";
import Link from "next/link";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { Germania_One } from 'next/font/google';
import { AuthContext } from "@/context/AuthContext";

const germania = Germania_One({
  weight: '400',
  subsets: ['latin'],
});

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <img src="/logoumes.png" width="70" height={70} />

        <img src="Ligapro.png" alt="ligapro" width="180" />
        {!isLoggedIn && (
          <div className="navbar-links">
            <Link href="/" className="nav-link">
              Inicio
            </Link>
            <Link href="/about" className="nav-link">
              Acerca de
            </Link>
            <Link href="/contact" className="nav-link">
              Contacto
            </Link>
          </div>
        )}

        <div className="auth-buttons">
          {isLoggedIn ? (
            <button className="login-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link href="/register">
                <button className="register-btn">Registrarse</button>
              </Link>
              <Link href="/login">
                <button className="login-btn">Iniciar Sesión</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
