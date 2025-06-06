// frontend/src/components/UserList.js
import React from 'react';
import './UserList.css';

function UserList({ users, onDelete, onEdit }) {
  return (
    <div className="user-list-container">
      <h2>Lista de Usuarios</h2>
      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
              <th>Sexo</th>
              <th>Cédula</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              // ¡Cambio aquí!: Usamos user.id_usuario como key
              <tr key={user.id_usuario}>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString('es-CO') : 'N/A'}</td>
                <td>{user.sexo}</td>
                <td>{user.cedula}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => onEdit(user)} className="edit-button">Editar</button>
                  {/* ¡Cambio aquí!: Pasamos user.id_usuario a onDelete */}
                  <button onClick={() => onDelete(user.id_usuario)} className="delete-button">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;