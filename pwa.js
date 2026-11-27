/* ============================================================
   ISANARA — botão "Baixar site" (instalação PWA)
   ============================================================ */

(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {
      /* PWA continua navegável mesmo sem service worker */
    });
  }

  var botao = document.getElementById('btnInstalar');
  var dica = document.getElementById('dicaInstalar');
  var promptEvent = null;
  var timerDica = null;

  function mostrarDica(texto) {
    if (!dica) return;
    dica.textContent = texto;
    dica.hidden = false;
    window.clearTimeout(timerDica);
    timerDica = window.setTimeout(function () {
      dica.hidden = true;
    }, 7000);
  }

  window.addEventListener('beforeinstallprompt', function (evento) {
    evento.preventDefault();
    promptEvent = evento;
    if (botao) botao.setAttribute('aria-label', 'Baixar e instalar o ISANARA');
  });

  if (botao) {
    botao.addEventListener('click', async function () {
      if (promptEvent) {
        promptEvent.prompt();
        var escolha = await promptEvent.userChoice;
        if (escolha.outcome === 'accepted') {
          botao.hidden = true;
          mostrarDica('ISANARA instalado! Acesse pela tela inicial do seu aparelho.');
        }
        promptEvent = null;
        return;
      }

      mostrarDica('Para instalar: no Chrome, abra o menu ⋮ e escolha “Instalar app”. No celular, toque em compartilhar → “Adicionar à tela inicial”.');
    });
  }

  window.addEventListener('appinstalled', function () {
    promptEvent = null;
    if (botao) botao.hidden = true;
    mostrarDica('ISANARA instalado! Acesse pela tela inicial do seu aparelho.');
  });
})();
