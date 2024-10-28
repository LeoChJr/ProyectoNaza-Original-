import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./TurnosForm.css";

const TurnosForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [nombrePersona, setNombrePersona] = useState("");
  const [apellidoPersona, setApellidoPersona] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaConsulta, setFechaConsulta] = useState("");
  const [cantidadMascotas, setCantidadMascotas] = useState(1);
  const [mascotas, setMascotas] = useState([]);
  const [precioBase] = useState(10000);
  const [precioFinal, setPrecioFinal] = useState(precioBase);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let descuento = 0;
    if (cantidadMascotas >= 2 && cantidadMascotas <= 6) {
      descuento =
        cantidadMascotas <= 2 ? 0.2 : cantidadMascotas <= 4 ? 0.3 : 0.5;
    }
    setDescuentoAplicado(descuento * 100);
    setPrecioFinal(precioBase * (1 - descuento));
  }, [cantidadMascotas, precioBase]);

  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    if (cantidadMascotas > 6) {
      setMensajeError("No puedes agregar más de 6 mascotas.");
      setCantidadMascotas(6); // Ajustar cantidadMascotas a 6 si supera el límite
    } else {
      setMensajeError(""); // Limpiar mensaje de error si está dentro del límite
      setMascotas(
        Array.from({ length: cantidadMascotas }, (_, i) => ({
          id: i,
          nombrePerro: "",
          tipoMascota: "",
          raza: "",
          sexo: "",
          tipoConsulta: "",
        }))
      );
    }
  }, [cantidadMascotas]);

  const handleMascotaChange = (index, field, value) => {
    const nuevasMascotas = [...mascotas];
    nuevasMascotas[index][field] = value;
    setMascotas(nuevasMascotas);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setError("Debes iniciar sesión para guardar un turno.");
      return;
    }
    try {
      // Guardar el turno
      const turnoDocRef = await addDoc(collection(db, "turnos"), {
        nombrePersona,
        apellidoPersona,
        telefono,
        email,
        direccion,
        fechaConsulta,
        cantidadMascotas: Number(cantidadMascotas),
        mascotas, // Guardar todos los datos de cada mascota
        userId: user.uid,
        precioFinal,
        descuentoAplicado,
      });

      // Guardar los datos en el historial clínico
      for (const mascota of mascotas) {
        await addDoc(collection(db, "historiales_clinicos"), {
          nombrePersona,
          apellidoPersona,
          telefono,
          email,
          direccion,
          fechaConsulta,
          nombreMascota: mascota.nombrePerro,
          tipoMascota: mascota.tipoMascota,
          raza: mascota.raza,
          sexo: mascota.sexo,
          tipoConsulta: mascota.tipoConsulta,
          precioFinalConDescuento: precioFinal,
          userId: user.uid,
          turnoId: turnoDocRef.id,
      });
      }

      alert("Turno y historial clínico guardados exitosamente!");
      // Limpiar los campos después de guardar
      setNombrePersona("");
        setApellidoPersona("");
        setTelefono("");
        setEmail("");
        setDireccion("");
        setFechaConsulta("");
        setCantidadMascotas(1);
        setMascotas([]);
        setError("");
  } catch (e) {
      console.error("Error al agregar el documento: ", e.message);
      setError("Error al guardar el turno. Por favor, intenta de nuevo.");
  }
  };

  const getDescuentoTexto = () => {
    if (descuentoAplicado === 0) return "Sin descuento aplicado";
    return `Descuento del ${descuentoAplicado}% aplicado`;
  };

  return (
    <div className="turnos-form-container">
      <div className="turnos-form">
        <h1 className="form-title">Reserva de Turnos</h1>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombrePersona}
              onChange={(e) => setNombrePersona(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input
              type="text"
              value={apellidoPersona}
              onChange={(e) => setApellidoPersona(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Consulta:</label>
            <input
              type="date"
              value={fechaConsulta}
              onChange={(e) => setFechaConsulta(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Cantidad de Mascotas:</label>
            <input
              type="number"
              min="1"
              max="6"
              value={cantidadMascotas}
              onChange={(e) => setCantidadMascotas(Number(e.target.value))}
              required
            />
            {mensajeError && (
              <span className="mensaje-error">{mensajeError}</span>
            )}
          </div>

          {/* Tarjetas para cada mascota */}
          {mascotas.map((mascota, index) => (
            <div key={mascota.id} className="mascota-card">
              <h2>Mascota {index + 1}</h2>
              <div className="form-group">
                <label>Nombre del Perro:</label>
                <input
                  type="text"
                  value={mascota.nombrePerro}
                  onChange={(e) =>
                    handleMascotaChange(index, "nombrePerro", e.target.value)
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo de Mascota:</label>
                <select
                  value={mascota.tipoMascota}
                  onChange={(e) =>
                    handleMascotaChange(index, "tipoMascota", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  {/* Agregar otras opciones según sea necesario */}
                </select>
              </div>
              <div className="form-group">
                <label>Raza:</label>
                <input
                  type="text"
                  value={mascota.raza}
                  onChange={(e) =>
                    handleMascotaChange(index, "raza", e.target.value)
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Sexo:</label>
                <select
                  value={mascota.sexo}
                  onChange={(e) =>
                    handleMascotaChange(index, "sexo", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipo de Consulta:</label>
                <input
                  type="text"
                  value={mascota.tipoConsulta}
                  onChange={(e) =>
                    handleMascotaChange(index, "tipoConsulta", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          ))}

          <div className="form-group">
            <label>Precio Base:</label>
            <input
              type="text"
              value={`$${precioBase.toFixed(2)}`}
              readOnly
              className="text-gray-500"
            />
          </div>
          <div className="form-group">
            <label>Precio Final con Descuento:</label>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={`$${precioFinal.toFixed(2)}`}
                readOnly
                className="text-gray-500"
              />
              <span
                className={`text-sm ${
                  descuentoAplicado > 0 ? "text-green-600" : "text-gray-500"
                }`}
              >
                {getDescuentoTexto()}
              </span>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Guardar Turno
          </button>
        </form>
      </div>
    </div>
  );
};

export default TurnosForm;
