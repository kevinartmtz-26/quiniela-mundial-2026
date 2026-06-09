const SCRIPT = 'https://script.google.com/macros/s/AKfycbwrBmvlN5BXcjekQiGteOO-CNuZjqKVam1jzyWFZDoeLhlLM4obluhAh0GH-0dZYwTw/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Use a fake callback name to get JSONP response, then strip it
  const cb = 'vercelProxy';
  const params = new URLSearchParams(req.query);
  params.set('callback', cb);
  const url = SCRIPT + '?' + params.toString();

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    let text = await response.text();
    
    // Strip JSONP wrapper: vercelProxy({...}) → {...}
    if (text.startsWith(cb + '(')) {
      text = text.slice(cb.length + 1, -1);
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch(e) {
    res.status(200).json({ ok: false, error: e.message });
  }
}
