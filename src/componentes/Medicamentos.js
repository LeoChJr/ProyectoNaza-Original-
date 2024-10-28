import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import './Medicamentos.css';

const medicamentosData = [
  { id: 1, nombre: 'Antibiótico A', precio: 250 },
  { id: 2, nombre: 'Antiinflamatorio B', precio: 400 },
  { id: 3, nombre: 'Analgesico C', precio: 150 },
  { id: 4, nombre: 'Desparasitante D', precio: 300 },
  { id: 5, nombre: 'Vacuna E', precio: 600 },
];

const Medicamentos = () => {
  const [carrito, setCarrito] = useState([]);
  const [sueldo, setSueldo] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);
        const userRef = doc(db, 'usuarios', user.uid); 
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSueldo(userData.sueldo || 10000);
        } else {
          console.log('No existe el documento del usuario');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const agregarAlCarrito = (medicamento) => {
    const nuevoCarrito = [...carrito, medicamento];
    const totalCompra = nuevoCarrito.reduce((total, item) => total + item.precio, 0);

    if (totalCompra <= sueldo) {
      setCarrito(nuevoCarrito);
    } else {
      alert('No tienes suficiente dinero para comprar estos medicamentos.');
    }
  };

  const eliminarDelCarrito = (medicamentoId) => {
    const nuevoCarrito = carrito.filter(item => item.id !== medicamentoId);
    setCarrito(nuevoCarrito);
  };

  const totalCarrito = carrito.reduce((total, item) => total + item.precio, 0);

  const comprarMedicamentos = async () => {
    if (totalCarrito === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    if (totalCarrito <= sueldo) {
      const nuevoSueldo = sueldo - totalCarrito;
      setSueldo(nuevoSueldo);
      setCarrito([]);

      try {
        await addDoc(collection(db, 'compras'), {
          email: userEmail,
          medicamentos: carrito,
          total: totalCarrito,
          sueldoRestante: nuevoSueldo,
          fecha: new Date().toISOString(),
        });

        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
        await updateDoc(userRef, { sueldo: nuevoSueldo });

        alert('Compra realizada exitosamente!');
      } catch (e) {
        console.error('Error al realizar la compra: ', e);
        alert('Hubo un problema al realizar la compra. Intenta de nuevo.');
      }
    } else {
      alert('No tienes suficiente dinero para realizar la compra.');
    }
  };

  return (
    <div className="medicamentos-container">
      <h1>Medicamentos Veterinarios</h1>
      <div className="medicamentos-list">
        {medicamentosData.map((medicamento) => (
          <div key={medicamento.id} className="medicamento-card">
            <h2>{medicamento.nombre}</h2>
            <p>Precio: ${medicamento.precio.toFixed(2)}</p>
            <button onClick={() => agregarAlCarrito(medicamento)}>Agregar al Carrito</button>
          </div>
        ))}
      </div>
      <div className="carrito">
        <h2>Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <ul>
            {carrito.map((item, index) => (
              <li key={index}>
                {item.nombre} - ${item.precio.toFixed(2)}
                <button onClick={() => eliminarDelCarrito(item.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${totalCarrito.toFixed(2)}</h3>
        <button onClick={comprarMedicamentos} className="comprar-button">Comprar</button>
      </div>
      <h3>Dinero disponible: ${sueldo.toFixed(2)}</h3>
    </div>
  );
};

export default Medicamentos;
