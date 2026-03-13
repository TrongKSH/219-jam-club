import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const commonEngine = new CommonEngine();

app.get('*', (req, res, next) => {
  const { protocol, originalUrl, headers } = req;
  commonEngine
    .render({
      bootstrap,
      documentFilePath: join(serverDistFolder, 'index.html'),
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: 'serverUrl', useValue: `${protocol}://${headers.host}` }],
    })
    .then((html: string) => res.send(html))
    .catch((err: unknown) => next(err));
});

app.listen(4200, () => {
  console.log('Angular server listening on http://localhost:4200');
});
