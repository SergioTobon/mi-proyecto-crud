// frontend/src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import './UserForm.css';

const initialFormState = {
  id_usuario: null, 
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  sexo: '',
  cedula: '',
  email: '',
};

function UserForm({ onSave, userToEdit }) {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        ...userToEdit,
        fecha_nacimiento: userToEdit.fecha_nacimiento ? new Date(userToEdit.fecha_nacimiento).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="user-form-container">
      <h2>{userToEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sexo">Sexo:</label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cedula">Cédula:</label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          {userToEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
        {userToEdit && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => onSave(null)}
          >
            Cancelar Edición
          </button>
        )}
      </form>
    </div>
  );
}

export default UserForm;