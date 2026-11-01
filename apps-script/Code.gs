/**
 * Levantamento Baixão Encantado.
 * Script vinculado à planilha: recebe as respostas do formulário (doPost) e grava uma linha por envio.
 * Passo a passo de implantação em apps-script/LEIA-ME.md.
 */

var FUSO = 'America/Belem';
var ABA = 'Respostas';
var MAX_CAMPO = 5000;
var CAMPOS = [
  [
    "responsavel",
    "Quem respondeu"
  ],
  [
    "contato",
    "WhatsApp de quem respondeu"
  ],
  [
    "horarios",
    "Dias/horários"
  ],
  [
    "feriados",
    "Feriados e férias"
  ],
  [
    "reservar",
    "Precisa reservar?"
  ],
  [
    "capacidade",
    "Capacidade/dia"
  ],
  [
    "estacionamento",
    "Estacionamento"
  ],
  [
    "entrada",
    "Entrada"
  ],
  [
    "crianca",
    "Criança grátis até"
  ],
  [
    "meia",
    "Meia/desconto"
  ],
  [
    "pagamento",
    "Formas de pagamento"
  ],
  [
    "atracoes",
    "Atrações"
  ],
  [
    "incluso",
    "O que a entrada já inclui?"
  ],
  [
    "servicos",
    "Produtos e serviços pagos à parte, com valores"
  ],
  [
    "limites",
    "Idade, altura ou peso mínimos por atração"
  ],
  [
    "obras",
    "O que está em obra ou chega em breve?"
  ],
  [
    "pratos",
    "Pratos/carro-chefe"
  ],
  [
    "bebidas",
    "Bebidas"
  ],
  [
    "cozinha",
    "Como funciona / comida de fora"
  ],
  [
    "espacos",
    "Espaços e valores"
  ],
  [
    "parque_inteiro",
    "Aluga o parque inteiro?"
  ],
  [
    "eventos",
    "Eventos"
  ],
  [
    "orcamento",
    "Orçamento / sinal"
  ],
  [
    "excursoes",
    "Excursões e escolas"
  ],
  [
    "excursoes_agenda",
    "Como agendar uma excursão?"
  ],
  [
    "cotas",
    "Planos e valores"
  ],
  [
    "cotas_beneficios",
    "O que o sócio ganha?"
  ],
  [
    "cotas_regras",
    "Regras e como aderir"
  ],
  [
    "animais",
    "Animais"
  ],
  [
    "bebida_fora",
    "Bebida de fora"
  ],
  [
    "som",
    "Som próprio"
  ],
  [
    "menor",
    "Menor desacompanhado"
  ],
  [
    "acessivel",
    "Acessível"
  ],
  [
    "pernoite",
    "Pernoite"
  ],
  [
    "regras_extra",
    "Outras regras e segurança"
  ],
  [
    "localizacao",
    "Localização"
  ],
  [
    "estrada",
    "Estrada/carro comum"
  ],
  [
    "faq",
    "Perguntas frequentes"
  ],
  [
    "humano",
    "Quando precisa humano"
  ]
];

// Recebe um envio do formulário e grava uma linha na aba Respostas.
function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    // Campo oculto anti-robô: pessoa não vê o campo; se veio preenchido, descarta sem avisar
    if (limpar(d.site)) return responder({ok: true});
    if (!limpar(d.responsavel)) return responder({ok: false, erro: 'Falta preencher o nome.'});
    var linha = [new Date()].concat(CAMPOS.map(function (c) { return texto(limpar(d[c[0]])); }));
    var trava = LockService.getScriptLock();
    trava.waitLock(15000);
    try {
      aba().appendRow(linha);
    } finally {
      trava.releaseLock();
    }
    return responder({ok: true});
  } catch (err) {
    return responder({ok: false, erro: String((err && err.message) || err)});
  }
}

// Abrir a URL do app da web no navegador serve de teste da implantação.
function doGet() {
  return responder({ok: true, formulario: 'Levantamento Baixão Encantado'});
}

// Rodar uma vez pelo editor: cria a aba, acerta o fuso e pede a autorização da conta.
function prepararPlanilha() {
  SpreadsheetApp.getActiveSpreadsheet().setSpreadsheetTimeZone(FUSO);
  aba();
}

function aba() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var a = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
  if (a.getLastRow() === 0) {
    a.appendRow(['Data e hora'].concat(CAMPOS.map(function (c) { return c[1]; })));
    a.setFrozenRows(1);
  }
  return a;
}

function limpar(v) {
  return String(v === undefined || v === null ? '' : v).trim().slice(0, MAX_CAMPO);
}

// Impede que uma resposta seja interpretada como fórmula pela planilha.
function texto(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function responder(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
