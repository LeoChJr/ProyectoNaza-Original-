import React, { useState } from "react";
import { auth, db } from "../firebase"; // Asegúrate de importar Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Importa setDoc para guardar en Firestore
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Función para registrar usuario en Firestore
  const registrarUsuarioEnFirestore = async (user) => {
    const userRef = doc(db, "usuarios", user.uid);
    await setDoc(userRef, {
      email: user.email,
      sueldo: 10000, // Saldo inicial
      puntos: 0 // Puntos iniciales
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario registrado");

      // Llama a la función para agregar el usuario en Firestore
      await registrarUsuarioEnFirestore(userCredential.user); // Agrega el usuario a Firestore
      console.log("Usuario registrado en Firestore");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>
        <p className="signin-link">
          Ya tienes una cuenta <a href="/login">Iniciar Sesion</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
