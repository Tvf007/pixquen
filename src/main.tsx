import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado:', registration.scope);
      })
      .catch((error) => {
        console.log('Falha ao registrar SW:', error);
      });
  });
}

// Capturar erros globais
window.addEventListener('error', (event) => {
  console.error('Erro global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada:', event.reason);
});

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Elemento root não encontrado');
  }

  ReactDOM.createRoot(root).render(<App />);
} catch (error) {
  console.error('Erro ao iniciar React:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #030712; color: white; font-family: system-ui, sans-serif; padding: 20px; text-align: center;">
      <div>
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <h1 style="font-size: 20px; margin-bottom: 12px;">Erro ao carregar aplicativo</h1>
        <p style="color: #9ca3af; margin-bottom: 20px;">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">
          Recarregar
        </button>
      </div>
    </div>
  `;
}
