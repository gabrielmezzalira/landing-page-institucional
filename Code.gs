/**
 * CITi — Formulário "Nos conte sua ideia!"
 * Google Apps Script — recebe os dados do formulário e grava na planilha.
 *
 * COMO FAZER O DEPLOY:
 * 1. Acesse script.google.com e abra este projeto (ou crie um novo e cole este código).
 * 2. Vá em Configurações do projeto (ícone de engrenagem) → Propriedades do script.
 *    Adicione a propriedade:
 *       SPREADSHEET_ID → 1bblTx9wfJfOyKOzll_6JKLajjtENOgtPB2EKv37NRZA
 *       (o ID que aparece no URL da planilha resposta-email-marketing)
 * 3. Clique em "Implantar" → "Gerenciar implantações" → editar (lápis) →
 *    "Versão: nova versão" → Implantar.
 * 4. A URL do web app (APPS_SCRIPT_URL no index.html) NÃO muda.
 *
 * CABEÇALHOS DA PLANILHA (linha 1, criados automaticamente se vazia):
 * Timestamp | Nome | E-mail | Telefone | Interesse | Investimento | Descrição
 */

var HEADERS = [
  'Timestamp',
  'Nome',
  'E-mail',
  'Telefone',
  'Interesse',
  'Investimento',
  'Descrição',
];

function doPost(e) {
  try {
    var sheet = getSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    // Aceita formulário URL-encoded e JSON.
    var data = e.parameter || {};
    if (e.postData && e.postData.contents &&
        (e.postData.type === 'application/json' ||
         e.postData.contents.trim().charAt(0) === '{')) {
      data = JSON.parse(e.postData.contents);
    }

    sheet.appendRow([
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' }),
      data.nome         || '',
      data.email        || '',
      data.telefone     || data.whatsapp || '',
      data.interesse    || data.desafio  || '',
      data.investimento || '',
      data.descricao    || data.origem   || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'CITi form script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Utilitários ──────────────────────────────────────────────────────────────

function getSheet() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) {
    return SpreadsheetApp.openById(id).getSheets()[0];
  }
  // Fallback: script está vinculado a uma planilha (container-bound)
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Defina SPREADSHEET_ID em Propriedades do script.');
  }
  return ss.getActiveSheet();
}
