function App() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      backgroundColor: '#030712', 
      color: '#ffffff', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#10b981' }}>✅ React Funcionando!</h1>
      <p style={{ fontSize: '18px', color: '#9ca3af' }}>Se você está vendo esta mensagem, o React está carregando.</p>
      <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>Agora vamos adicionar os componentes...</p>
    </div>
  );
}

export default App;
