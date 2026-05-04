#!/usr/bin/env node

/**
 * Script para gerar relatórios de testes versionados
 * Cria um novo relatório com timestamp a cada execução
 * Mantém histórico e índice de todos os relatórios
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPORTS_DIR = path.join(__dirname, '../mochawesome-report');
const ARCHIVED_REPORTS_DIR = path.join(REPORTS_DIR, 'archived');

// Criar diretórios se não existirem
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

if (!fs.existsSync(ARCHIVED_REPORTS_DIR)) {
  fs.mkdirSync(ARCHIVED_REPORTS_DIR, { recursive: true });
}

// Gerar timestamp no formato YYYY-MM-DD-HH-mm-ss
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

// Função para gerar índice de relatórios
function generateIndex() {
  const archivedReports = fs.readdirSync(ARCHIVED_REPORTS_DIR)
    .filter(file => file.startsWith('report-') && file.endsWith('.html'))
    .sort()
    .reverse();

  const reportsList = archivedReports
    .map((file, index) => {
      const filePath = path.join('archived', file);
      const fileStats = fs.statSync(path.join(ARCHIVED_REPORTS_DIR, file));
      const fileDate = new Date(fileStats.mtime).toLocaleString('pt-BR');
      return `
    <tr>
      <td>${index + 1}</td>
      <td><a href="${filePath}" target="_blank">${file.replace('.html', '').replace('report-', '')}</a></td>
      <td>${fileDate}</td>
    </tr>
      `;
    })
    .join('');

  const indexHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIGAROUTE - Histórico de Relatórios de Testes</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }
    
    .info-box {
      background: #f0f4ff;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin-bottom: 30px;
      border-radius: 4px;
      font-size: 14px;
      color: #444;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    
    tr:hover {
      background: #f9f9f9;
    }
    
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    
    .badge {
      display: inline-block;
      background: #ffc107;
      color: #333;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 12px;
      margin-left: 10px;
      font-weight: 600;
    }
    
    footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 SIGAROUTE - Histórico de Relatórios de Testes</h1>
    <p class="subtitle">Sistema de Gerenciamento de Rotas e Endereços</p>
    
    <div class="info-box">
      <strong>ℹ️ Informação:</strong> Os relatórios de testes são versionados automaticamente a cada execução.
      Clique em qualquer relatório para visualizar os detalhes completos dos testes.
    </div>
    
    ${archivedReports.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Relatório</th>
          <th>Data/Hora</th>
        </tr>
      </thead>
      <tbody>
        ${reportsList}
      </tbody>
    </table>
    ` : `
    <div class="no-data">
      <p>Nenhum relatório de testes encontrado ainda.</p>
      <p>Execute <code>npm run test:versioned</code> para gerar o primeiro relatório.</p>
    </div>
    `}
    
    <footer>
      <p>Última atualização: ${new Date().toLocaleString('pt-BR')}</p>
      <p>Relatórios armazenados em: <code>mochawesome-report/archived</code></p>
    </footer>
  </div>
</body>
</html>
  `;

  fs.writeFileSync(path.join(REPORTS_DIR, 'index.html'), indexHtml);
}

function normalizePath(dir) {
  return dir.replace(/\\/g, '/');
}

function renameGeneratedReport(reportName) {
  const generatedHtml = path.join(ARCHIVED_REPORTS_DIR, 'mochawesome.html');
  const generatedJson = path.join(ARCHIVED_REPORTS_DIR, 'mochawesome.json');
  const targetHtml = path.join(ARCHIVED_REPORTS_DIR, `${reportName}.html`);
  const targetJson = path.join(ARCHIVED_REPORTS_DIR, `${reportName}.json`);

  if (fs.existsSync(generatedHtml)) {
    fs.renameSync(generatedHtml, targetHtml);
  }

  if (fs.existsSync(generatedJson)) {
    fs.renameSync(generatedJson, targetJson);
  }
}

// Função principal
async function main() {
  try {
    console.log(`\n📊 Gerando relatório versionado de testes...\n`);

    const timestamp = getTimestamp();
    const reportName = `report-${timestamp}`;
    const normalizedDir = normalizePath(ARCHIVED_REPORTS_DIR);

    // Executar mocha com mochawesome
    const command = `npx mocha "test/**/*.test.js" --require test/setup.js --reporter mochawesome --reporter-options reportDir=${normalizedDir},reportFilename=${reportName}`;

    try {
      execSync(command, {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    } catch (error) {
      // Os testes podem falhar, mas queremos gerar o relatório mesmo assim
      console.log(`\n⚠️  Teste finalizado. Relatório gerado mesmo com falhas.`);
    }

    // Renomear arquivos gerados caso mochawesome use o nome padrão
    renameGeneratedReport(reportName);

    // Gerar índice
    generateIndex();

    console.log(`\n✅ Relatório versionado gerado com sucesso!`);
    console.log(`📁 Arquivo: ${reportName}.html`);
    console.log(`📂 Localização: mochawesome-report/archived/`);
    console.log(`📋 Índice: mochawesome-report/index.html\n`);

  } catch (error) {
    console.error(`\n❌ Erro ao gerar relatório: ${error.message}\n`);
    process.exit(1);
  }
}

main();
