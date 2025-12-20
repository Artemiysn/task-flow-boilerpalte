import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <header>
        <h1>Привет, {user.first_name || user.email}!</h1>
        <button onClick={logout} className="btn-secondary">
          Выйти
        </button>
      </header>
      <div className="user-info">
        <h2>Ваш профиль</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};