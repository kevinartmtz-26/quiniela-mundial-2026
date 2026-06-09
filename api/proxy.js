const SCRIPT = 'https://script.google.com/macros/s/AKfycbwrBmvlN5BXcjekQiGteOO-CNuZjqKVam1jzyWFZDoeLhlLM4obluhAh0GH-0dZYwTw/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const params = new URLSearchParams(req.query);
  const url = SCRIPT + (params.toString() ? '?' + params.toString() : '');

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch(e) {
    res.status(200).json({ ok: false, error: e.message });
  }
}
