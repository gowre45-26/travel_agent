import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Support JSON & urlencoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const DEFAULT_N8N_URL = 'https://jyothsnagowre.app.n8n.cloud/form/a6331600-5e70-4850-894d-baad0f91cc15';

// API: Health check & configuration
app.get('/api/config', (_req, res) => {
  res.json({
    defaultUrl: DEFAULT_N8N_URL,
    workflowName: 'AI Travel Agent',
    formFields: [
      { id: 'field-0', key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Elena Rostova' },
      { id: 'field-1', key: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'elena@example.com' },
      { id: 'field-2', key: 'from', label: 'Departure Location (From)', type: 'text', required: true, placeholder: 'e.g. San Francisco, CA' },
      { id: 'field-3', key: 'destination', label: 'Destination', type: 'text', required: true, placeholder: 'e.g. Kyoto & Tokyo, Japan' },
      { id: 'field-4', key: 'originAirport', label: 'Origin Airport Code (IATA)', type: 'text', required: false, placeholder: 'e.g. SFO or VTZ' },
      { id: 'field-5', key: 'destAirport', label: 'Destination Airport Code (IATA)', type: 'text', required: false, placeholder: 'e.g. HND or GOI' },
      { id: 'field-6', key: 'departureDate', label: 'Departure Date', type: 'date', required: true },
      { id: 'field-7', key: 'returnDate', label: 'Return Date', type: 'date', required: true },
      { id: 'field-8', key: 'travellers', label: 'Number of Travellers', type: 'number', required: true, placeholder: '2' },
      { id: 'field-9', key: 'budget', label: 'Estimated Budget', type: 'text', required: true, placeholder: 'e.g. $4,500' },
      { 
        id: 'field-10', 
        key: 'travelStyle', 
        label: 'Travel Style', 
        type: 'select', 
        required: true,
        options: ['Budget', 'Standard', 'Luxury', 'Adventure', 'Family', 'Relaxation']
      },
      { id: 'field-11', key: 'interests', label: 'Interests & Activities', type: 'text', required: true, placeholder: 'e.g. Culinary tours, historical temples, hiking, photography' }
    ]
  });
});

// API: Test connectivity to n8n webhook/form URL
app.post('/api/test-connection', async (req, res) => {
  const targetUrl = req.body?.url || DEFAULT_N8N_URL;
  const startTime = Date.now();

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (AI-Travel-Agent-Proxy/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/json'
      }
    });

    const latencyMs = Date.now() - startTime;
    const isOk = response.ok || response.status === 200 || response.status === 302;
    const text = await response.text();
    const hasTravelAgentTitle = text.includes('AI Travel Agent');

    res.json({
      success: isOk,
      status: response.status,
      latencyMs,
      targetUrl,
      verifiedForm: hasTravelAgentTitle,
      message: isOk 
        ? `n8n Webhook is active and responding (${latencyMs}ms)`
        : `Endpoint returned HTTP status ${response.status}`
    });
  } catch (error: any) {
    res.status(502).json({
      success: false,
      error: error.message || 'Unable to connect to n8n endpoint',
      latencyMs: Date.now() - startTime,
      targetUrl
    });
  }
});

// API: Forward form submission to n8n
app.post('/api/submit-n8n', async (req, res) => {
  const { url = DEFAULT_N8N_URL, payload } = req.body;

  if (!payload) {
    return res.status(400).json({ success: false, error: 'Missing form payload data' });
  }

  const startTime = Date.now();

  try {
    // Build standard multipart/form-data for n8n Form trigger node
    const formData = new FormData();
    formData.append('field-0', payload.name || '');
    formData.append('field-1', payload.email || '');
    formData.append('field-2', payload.from || '');
    formData.append('field-3', payload.destination || '');
    formData.append('field-4', payload.originAirport || '');
    formData.append('field-5', payload.destAirport || '');
    formData.append('field-6', payload.departureDate || '');
    formData.append('field-7', payload.returnDate || '');
    formData.append('field-8', String(payload.travellers || 1));
    formData.append('field-9', payload.budget || '');
    formData.append('field-10', payload.travelStyle || 'Standard');
    formData.append('field-11', payload.interests || '');

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    const latencyMs = Date.now() - startTime;
    const responseText = await response.text();
    let responseJson: any = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      // response is text or html
    }

    if (response.ok) {
      return res.json({
        success: true,
        status: response.status,
        latencyMs,
        response: responseJson || responseText,
        submittedAt: new Date().toISOString(),
        bookingRef: 'TRIP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      });
    } else {
      return res.status(response.status).json({
        success: false,
        status: response.status,
        error: responseText || `n8n responded with status ${response.status}`,
        latencyMs
      });
    }
  } catch (error: any) {
    console.error('Error proxying to n8n:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal proxy failure communicating with n8n server',
      latencyMs: Date.now() - startTime
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`VoyageAI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
