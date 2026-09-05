#!/usr/bin/env node
/**
 * portfolio/index.html 을 A4 PDF 로 렌더한다.
 *
 *   node scripts/build-portfolio-pdf.mjs
 *
 * 로컬 Chrome 을 헤드리스로 띄우고 DevTools Protocol 의 Page.printToPDF 를 호출한다.
 * printBackground 를 켜야 배경 패널과 막대 그래프가 PDF 에 남기 때문에
 * `--print-to-pdf` CLI 플래그 대신 프로토콜을 직접 쓴다. 외부 의존성은 없다.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'portfolio', 'index.html');
const OUT = path.join(root, 'assets', 'portfolio', 'portfolio.pdf');

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

async function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    try { await readFile(c); return c; } catch { /* not a readable file, try next */ }
  }
  const { existsSync } = await import('node:fs');
  const hit = CHROME_CANDIDATES.find(existsSync);
  if (!hit) throw new Error('Chrome 을 찾지 못했습니다. CHROME_CANDIDATES 에 경로를 추가하세요.');
  return hit;
}

/** Jekyll front matter 와 raw 태그를 벗겨 브라우저가 읽을 수 있는 HTML 로 만든다. */
function stripJekyll(html) {
  return html
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/\{%-?\s*(end)?raw\s*-?%\}/g, '')
    .trimStart();
}

function send(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const onMessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== id) return;
      ws.removeEventListener('message', onMessage);
      msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result);
    };
    ws.addEventListener('message', onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const chrome = await findChrome();
  const profile = await mkdtemp(path.join(tmpdir(), 'portfolio-chrome-'));
  const staging = await mkdtemp(path.join(tmpdir(), 'portfolio-src-'));
  const page = path.join(staging, 'portfolio.html');

  await writeFile(page, stripJekyll(await readFile(SRC, 'utf8')), 'utf8');

  const proc = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `--user-data-dir=${profile}`,
    '--remote-debugging-port=0',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const timer = setTimeout(() => reject(new Error('Chrome DevTools 엔드포인트 대기 시간 초과')), 20000);
    proc.stderr.on('data', (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(timer); resolve(m[1]); }
    });
    proc.on('exit', (code) => { clearTimeout(timer); reject(new Error(`Chrome 종료 (code ${code})`)); });
  });

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('DevTools 소켓 연결 실패')), { once: true });
  });

  let id = 0;
  const { targetId } = await send(ws, ++id, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send(ws, ++id, 'Target.attachToTarget', { targetId, flatten: true });

  // flatten 모드에서는 sessionId 를 실어 보내야 해당 탭으로 전달된다.
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const myId = ++id;
    const onMessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== myId) return;
      ws.removeEventListener('message', onMessage);
      msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result);
    };
    ws.addEventListener('message', onMessage);
    ws.send(JSON.stringify({ id: myId, method, params, sessionId }));
  });

  await call('Page.enable');
  const loaded = new Promise((resolve) => {
    const onMessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Page.loadEventFired' && msg.sessionId === sessionId) {
        ws.removeEventListener('message', onMessage);
        resolve();
      }
    };
    ws.addEventListener('message', onMessage);
  });

  await call('Page.navigate', { url: `file://${page}` });
  await loaded;

  // 웹폰트가 자리를 잡기 전에 인쇄하면 줄바꿈이 어긋난다.
  await call('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  await new Promise((r) => setTimeout(r, 400));

  const { data } = await call('Page.printToPDF', {
    printBackground: true,
    preferCSSPageSize: true,
    paperWidth: 8.27,
    paperHeight: 11.69,
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
    displayHeaderFooter: false,
  });

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, Buffer.from(data, 'base64'));

  ws.close();
  proc.kill();
  await rm(profile, { recursive: true, force: true });
  await rm(staging, { recursive: true, force: true });

  const kb = (Buffer.from(data, 'base64').length / 1024).toFixed(0);
  console.log(`생성 완료: ${path.relative(root, OUT)} (${kb} KB)`);
}

main().catch((err) => { console.error(err.message); process.exit(1); });
