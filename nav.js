/* Controle do botão de criação (+): visível apenas para usuários autenticados */
(function () {
  const SUPABASE_URL = 'https://zwgrjmsycbplokliovsg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Z3JqbXN5Y2JwbG9rbGlvdnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODM1OTEsImV4cCI6MjA5OTk1OTU5MX0.KIKQ9QjspCik0QY6TGoT_mHcsK3Y_IeXcmqUo0cVhw4';

  const client = window.supabase
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  function atualizarVisibilidadeBotoes(user) {
    const fabCriar = document.getElementById('fabCriar');
    const logoutBtn = document.getElementById('logoutBtn');

    if (fabCriar) fabCriar.style.display = user ? 'flex' : 'none';
    if (logoutBtn) logoutBtn.style.display = user ? 'flex' : 'none';
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const fabCriar = document.getElementById('fabCriar');
    if (!fabCriar) return;

    if (!client) {
      atualizarVisibilidadeBotoes(null);
      return;
    }

    const { data: authData } = await client.auth.getUser();
    atualizarVisibilidadeBotoes(authData?.user || null);

    // Mantém a visibilidade sincronizada caso a sessão mude
    client.auth.onAuthStateChange((_event, session) => {
      atualizarVisibilidadeBotoes(session?.user || null);
    });

    // Encerra a sessão e volta para a tela de login
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await client.auth.signOut();
        window.location.href = 'Login.html';
      });
    }

    // Bloqueia o acesso direto via clique caso o usuário não esteja autenticado
    fabCriar.addEventListener('click', async (e) => {
      e.preventDefault();
      const { data: freshAuth } = await client.auth.getUser();
      if (!freshAuth?.user) {
        window.location.href = 'Login.html';
        return;
      }
      window.location.href = fabCriar.href;
    });
  });
})();
