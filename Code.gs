/**
 * CITi — Formulário "Nos conte sua ideia!"
 * Google Apps Script — recebe os dados do formulário e grava na planilha.
 *
 * COMO FAZER O DEPLOY:
 * 1. Acesse script.google.com e crie um novo projeto.
 * 2. Cole este código no editor.
 * 3. Clique em "Implantar" → "Nova implantação".
 * 4. Tipo: "Aplicativo da Web".
 * 5. Executar como: "Eu (minha conta Google)".
 * 6. Quem tem acesso: "Qualquer pessoa" (Anyone).
 * 7. Clique em "Implantar" e copie a URL gerada.
 * 8. Cole a URL no arquivo index.html onde está APPS_SCRIPT_URL.
 *
 * CABEÇALHOS DA PLANILHA (linha 1):
 * Timestamp | Nome | E-mail | Telefone | Interesse | Investimento | Descrição
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalhos se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Nome',
        'E-mail',
        'Telefone',
        'Interesse',
        'Investimento',
        'Descrição',
      ]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' }),
      data.nome || '',
      data.email || '',
      data.telefone || '',
      data.interesse || '',
      data.investimento || '',
      data.descricao || '',
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

// Permite testar via GET no browser (retorna status)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'CITi form script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
