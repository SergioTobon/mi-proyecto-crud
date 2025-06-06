// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api/usuarios';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Error al cargar usuarios. Intenta de nuevo más tarde."); //notificacion de error 
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (user) => {
    // Si user es null (viene de cancelar edición), simplemente resetea y sal
    if (user === null) {
      setEditingUser(null);
      return;
    }

    if (editingUser) {
      // Actualizar usuario existente
      // Asegurarse de que el usuario tenga un id_usuario para actualizar
      if (!user.id_usuario) { 
          alert("Error: El usuario a actualizar no tiene ID de usuario.");
          setEditingUser(null);
          return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/${user.id_usuario}`, { // ¡Cambio aquí!
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error HTTP! estado: ${response.status}`);
        }
        setEditingUser(null);
        fetchUsers();
        alert("Usuario actualizado con éxito!");
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        alert(`Error al actualizar usuario: ${error.message}`);
      }
    } else {
      // Crear nuevo usuario
      try {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error HTTP! estado: ${response.status}`);
        }
        fetchUsers();
        alert("Usuario creado con éxito!");
      } catch (error) {
        console.error("Error al crear usuario:", error);
        alert(`Error al crear usuario: ${error.message}`);
      }
    }
  };

  const handleDeleteUser = async (id_usuario) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id_usuario}`, { 
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        fetchUsers();
        alert("Usuario eliminado con éxito!");
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Error al eliminar usuario. Intenta de nuevo más tarde.");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="App">
      <h1>Gestión de Usuarios</h1>
      <UserForm onSave={handleSaveUser} userToEdit={editingUser} />
      <UserList users={users} onDelete={handleDeleteUser} onEdit={handleEditUser} />
    </div>
  );
}

export default App;