// VERSÃO DE TESTE - Remover depois que funcionar
function App() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#030712',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>React Funcionando!</h1>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
          Se você está vendo esta mensagem, o React está carregando corretamente.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}

export default App;
