"use client";
import Link from "next/link";
import React from "react";
import { Germania_One } from 'next/font/google';

const germania = Germania_One({
  weight: '400',
  subsets: ['latin'],
  
});



const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
       <span className={`${germania.className} text-white text-6xl ml-2`}>
  LigaPro
</span>

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
        <div className="auth-buttons">
          <Link href="/register">
            <button className="register-btn">Registrarse</button>
          </Link>
          <Link href="/login">
            <button className="login-btn">Iniciar Sesión</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
