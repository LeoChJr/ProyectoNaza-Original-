import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./paginaInicio.css";

const paginaPrincipal = () => {
  const handleLogout = () => {
    alert("Sesión cerrada exitosamente.");
  };

  return (
    <div className="veterinaria">
      <nav className="navbar">
        <a className="navbar-brand" href="#">
          Veterinaria KIRO
        </a>
        <div className="navbar-links">
          <Link to="/turnos" className="nav-item">
            Reserva de Turnos
          </Link>
          <Link to="/historialClinico" className="nav-item">
            Historial Clínico
          </Link>

          <Link to="/medicamentos" className="nav-item">
            Medicamentos
          </Link>
          <Link to="/accesorios" className="nav-item">
            Accesorios
          </Link>
          <Link to="/misturnos" className="nav-item">
            Mis turnos
          </Link>

          <Link to="/login" className="nav-item" onClick={handleLogout}>
            Cerrar Sesion
          </Link>
        </div>
      </nav>

      <div className="banner">
        <h1>Veterinaria KIRO</h1>
      </div>

      <div className="services-section">
        <h2>Nuestros Servicios</h2>
        <div className="services-container">
          <div className="service-card">
            <h3>Nose</h3>
            <p>Info de que hacemos</p>
          </div>
          <div className="service-card">
            <h3>Nose</h3>
            <p>Info de que hacemos</p>
          </div>
          <div className="service-card">
            <h3>Nose</h3>
            <p>Info de que hacemos</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>
            <strong>Veterinaria KIRO &copy; 2024</strong>
          </p>
          <p>
            Todos los derechos reservados. Este sitio y su contenido son
            propiedad de Veterinaria KIRO.
          </p>
          <p>
            <strong>Contáctanos:</strong>
          </p>
          <p>Teléfono: xxx-xxx-xxxx | Email: nose@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default paginaPrincipal;
