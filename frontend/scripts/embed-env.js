const fs = require('fs');
const path = require('path');

const apiBase = process.env.NG_APP_API_BASE || '';
const outPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
const apiBaseLiteral = apiBase ? JSON.stringify(apiBase) : "''";
const content = `export const environment = {
  production: true,
  /** Injected at build from NG_APP_API_BASE (e.g. on Vercel). No trailing slash. */
  apiBase: ${apiBaseLiteral},
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote environment.prod.ts with apiBase:', apiBase || '(empty)');
