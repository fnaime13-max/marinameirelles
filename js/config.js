/* Tudo que a Marina pode querer trocar fica aqui. */
window.CONFIG = {
  nome: 'Marina Meirelles',
  whatsapp: '5535991484131',
  telefone: '(35) 99148-4131',
  instagram: '_nutricionistamarina',
  crn: '', // ex.: 'CRN-9 00000' — enquanto vazio, o rodapé mostra o aviso "CRN a preencher"
  cidade: 'Pouso Alegre/MG',
  mensagem: 'Olá, Marina! Vi seu site e quero conhecer o seu acompanhamento.'
};

window.linkWA = function (msg) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg || CONFIG.mensagem);
};
