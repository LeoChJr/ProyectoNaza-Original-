import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { doc, updateDoc, getDoc, addDoc, collection, setDoc } from 'firebase/firestore';
import './Accesorios.css';

const accesoriosData = [
  { id: 1, nombre: 'Collar', precio: 300, puntos: 30 },
  { id: 2, nombre: 'Correa', precio: 500, puntos: 50 },
  { id: 3, nombre: 'Placa de identificación', precio: 150, puntos: 15 },
  { id: 4, nombre: 'Juguete', precio: 200, puntos: 20 },
  { id: 5, nombre: 'Cuenco', precio: 250, puntos: 25 },
];

const Accesorios = () => {
  const [carrito, setCarrito] = useState([]);
  const [sueldo, setSueldo] = useState(0); 
  const [puntos, setPuntos] = useState(0);
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
          setPuntos(userData.puntos || 0); // Asegúrate de cargar los puntos desde la base de datos
        } else {
          console.log('No existe el documento del usuario');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const canjearPuntos = async (accesorio) => {
    if (puntos >= accesorio.puntos) {
      const nuevosPuntos = puntos - accesorio.puntos;
      setPuntos(nuevosPuntos);

      try {
        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
        // Actualizar los puntos en la base de datos
        await updateDoc(userRef, { puntos: nuevosPuntos });
        alert(`Has canjeado ${accesorio.nombre} por ${accesorio.puntos} puntos.`);
      } catch (error) {
        console.error('Error al actualizar los puntos en la base de datos:', error);
        alert('Hubo un problema al canjear puntos. Intenta de nuevo.');
      }
    } else {
      alert('No tienes suficientes puntos para canjear este accesorio.');
    }
  };

  const agregarAlCarrito = (accesorio) => {
    const nuevoCarrito = [...carrito, accesorio];
    const totalCompra = nuevoCarrito.reduce((total, item) => total + item.precio, 0);

    if (totalCompra <= sueldo) {
      setCarrito(nuevoCarrito);
    } else {
      alert('No tienes suficiente dinero para comprar estos accesorios.');
    }
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const totalCarrito = carrito.reduce((total, item) => total + item.precio, 0);

  const comprarAccesorios = async () => {
    if (totalCarrito === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
  
    if (totalCarrito <= sueldo) {
      const nuevoSueldo = sueldo - totalCarrito;
      const nuevosPuntos = puntos + totalCarrito * 0.1; // 10% de puntos de la compra
      setSueldo(nuevoSueldo);
      setPuntos(nuevosPuntos);
      setCarrito([]);
  
      try {
        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
  
        // Guardar la compra en la colección de "compras" o "compras_accesorios"
        await addDoc(collection(db, 'accesorios'), {
          email: userEmail,
          accesorios: carrito,
          total: totalCarrito,
          sueldoRestante: nuevoSueldo,
          puntosGanados: totalCarrito * 0.1,
          fecha: new Date().toISOString(),
        });
  
        // Actualizar el sueldo y puntos en la base de datos del usuario
        await updateDoc(userRef, { sueldo: nuevoSueldo, puntos: nuevosPuntos });
  
        alert('Compra de accesorios realizada exitosamente! Has ganado puntos.');
      } catch (e) {
        console.error('Error al realizar la compra de accesorios: ', e);
        alert('Hubo un problema al realizar la compra. Intenta de nuevo.');
      }
    } else {
      alert('No tienes suficiente dinero para realizar la compra.');
    }
  };

  return (
    <div className="accesorios-container">
      <h1>Accesorios para Mascotas</h1>
      <div className="accesorios-list">
        {accesoriosData.map((accesorio) => (
          <div key={accesorio.id} className="accesorio-card">
            <h2>{accesorio.nombre}</h2>
            <p>Precio: ${accesorio.precio.toFixed(2)}</p>
            <p>Puntos necesarios: {accesorio.puntos}</p>
            <button onClick={() => agregarAlCarrito(accesorio)}>Agregar al Carrito</button>
            <button onClick={() => canjearPuntos(accesorio)}>Canjear por {accesorio.puntos} puntos</button>
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
                <button onClick={() => eliminarDelCarrito(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${totalCarrito.toFixed(2)}</h3>
        <button onClick={comprarAccesorios} className="comprar-button">Comprar</button>
      </div>
      <h3>Dinero disponible: ${sueldo.toFixed(2)}</h3>
      <h3>Puntos: {puntos}</h3>
    </div>
  );
};

export default Accesorios;
