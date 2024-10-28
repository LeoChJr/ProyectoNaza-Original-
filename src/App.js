import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './componentes/Login'; // Asegúrate de que la ruta sea correcta
import Register from './componentes/Register'; // Asegúrate de que la ruta sea correcta
import PaginaPrincipal from './componentes/paginaPrincipal'; // Importa VacationForm
import TurnosForm from './componentes/TurnosForm'; // Asegúrate de que la ruta sea correcta
import HistorialClinico from './componentes/HistorialClinico';
import Medicamentos from './componentes/Medicamentos';
import Accesorios from './componentes/Accesorios';
import MisTurnos from './componentes/MisTurnos';
const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/paginaPrincipal" element={<PaginaPrincipal />} /> {/* Ruta para PaginaPrincipal */}
                    <Route path="/turnos" element={<TurnosForm />} /> {/* Ruta para TurnosForm */}
                    <Route path="/historialClinico" element={<HistorialClinico/>}/>
                    <Route path="/medicamentos" element={<Medicamentos/>}/>
                    <Route path="/accesorios" element={<Accesorios/>}/>
                    <Route path="/misturnos" element={<MisTurnos/>}></Route>
                    <Route path="/" element={<Navigate to="/login" />} /> {/* Redirige a /login */}
                    
                </Routes>
            </div>
        </Router>
    );
};

export default App;
