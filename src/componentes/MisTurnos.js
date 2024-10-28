import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './MisTurnos.css';

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [editingTurno, setEditingTurno] = useState(null);
  const [formData, setFormData] = useState({
    nombrePersona: '',
    apellidoPersona: '',
    telefono: '',
    email: '',
    direccion: '',
    fechaConsulta: '',
    cantidadMascotas: '',
    mascotas: [],
    precioFinal: '',
    descuentoAplicado: '',
  });

  useEffect(() => {
    const fetchTurnos = async () => {
      const user = auth.currentUser;
      if (user) {
        const turnosRef = collection(db, 'turnos');
        const turnosSnapshot = await getDocs(turnosRef);
        const turnosData = turnosSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(turno => turno.userId === user.uid);

        setTurnos(turnosData);
      }
    };

    fetchTurnos();
  }, []);

  const handleEdit = (turno) => {
    setEditingTurno(turno.id);
    setFormData({
      nombrePersona: turno.nombrePersona,
      apellidoPersona: turno.apellidoPersona,
      telefono: turno.telefono,
      email: turno.email,
      direccion: turno.direccion,
      fechaConsulta: turno.fechaConsulta,
      cantidadMascotas: turno.cantidadMascotas,
      mascotas: turno.mascotas,
      precioFinal: turno.precioFinal,
      descuentoAplicado: turno.descuentoAplicado,
    });
  };

  const handleUpdate = async () => {
    if (editingTurno) {
      const turnoRef = doc(db, 'turnos', editingTurno);
      await updateDoc(turnoRef, formData);
      setTurnos(turnos.map(turno => (turno.id === editingTurno ? { ...turno, ...formData } : turno)));
      setEditingTurno(null);
      setFormData({});
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'turnos', id));
    setTurnos(turnos.filter(turno => turno.id !== id));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mis-turnos-container">
      <h1>Mis Turnos</h1>
      {turnos.length === 0 ? (
        <p>No tienes turnos reservados.</p>
      ) : (
        <ul>
          {turnos.map(turno => (
            <li key={turno.id}>
              <p><strong>Nombre:</strong> {turno.nombrePersona}</p>
              <p><strong>Apellido:</strong> {turno.apellidoPersona}</p>
              <p><strong>Teléfono:</strong> {turno.telefono}</p>
              <p><strong>Email:</strong> {turno.email}</p>
              <p><strong>Dirección:</strong> {turno.direccion}</p>
              <p><strong>Fecha de Consulta:</strong> {turno.fechaConsulta}</p>
              <p><strong>Cantidad de Mascotas:</strong> {turno.cantidadMascotas}</p>
              <p><strong>Precio Final:</strong> ${turno.precioFinal}</p>
              
              {/* Mostrar información de cada mascota */}
              <div className="mascotas-list">
                <h3>Datos de Mascotas:</h3>
                {turno.mascotas.map((mascota, index) => (
                  <div key={index} className="mascota-info">
                    <p><strong>Nombre Mascota:</strong> {mascota.nombreMascota}</p>
                    <p><strong>Tipo:</strong> {mascota.tipoMascota}</p>
                    <p><strong>Raza:</strong> {mascota.raza}</p>
                    <p><strong>Sexo:</strong> {mascota.sexo}</p>
                    <p><strong>Tipo de Consulta:</strong> {mascota.tipoConsulta}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => handleEdit(turno)}>Editar</button>
              <button onClick={() => handleDelete(turno.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      {editingTurno && (
        <div className="edit-turno">
          <h2>Editar Turno</h2>
          <form>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombrePersona"
              value={formData.nombrePersona}
              onChange={handleChange}
            />
            <label>Apellido:</label>
            <input
              type="text"
              name="apellidoPersona"
              value={formData.apellidoPersona}
              onChange={handleChange}
            />
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
            <label>Fecha de Consulta:</label>
            <input
              type="date"
              name="fechaConsulta"
              value={formData.fechaConsulta}
              onChange={handleChange}
            />
            <label>Cantidad de Mascotas:</label>
            <input
              type="number"
              name="cantidadMascotas"
              value={formData.cantidadMascotas}
              onChange={handleChange}
            />
            <label>Precio Final:</label>
            <input
              type="text"
              name="precioFinal"
              value={formData.precioFinal}
              readOnly
            />
            <button type="button" onClick={handleUpdate}>Guardar Cambios</button>
            <button type="button" onClick={() => setEditingTurno(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MisTurnos;
