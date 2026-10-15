import 'dotenv/config';
import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { renderScriptToMp4, getRenderedVideosDir } from './videoRenderer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.DEFAULT_APP_PORT || process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to retrieve the Gemini API key safely without exposing it
function getGeminiApiKey(): string | undefined {
  if (
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
  ) {
    return process.env.GEMINI_API_KEY.trim();
  }

  // Check /app/.dev.env.json where AI Studio injects dev secrets
  try {
    const devEnvPath = '/app/.dev.env.json';
    if (fs.existsSync(devEnvPath)) {
      const devEnv = JSON.parse(fs.readFileSync(devEnvPath, 'utf8'));
      if (devEnv.GEMINI_API_KEY && devEnv.GEMINI_API_KEY.trim() !== '' && devEnv.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
        return devEnv.GEMINI_API_KEY.trim();
      }
    }
  } catch {
    // Ignore read errors
  }

  // Check /etc/secrets/GEMINI_API_KEY
  try {
    const secretPath = '/etc/secrets/GEMINI_API_KEY';
    if (fs.existsSync(secretPath)) {
      const secret = fs.readFileSync(secretPath, 'utf8').trim();
      if (secret) return secret;
    }
  } catch {
    // Ignore read errors
  }

  return undefined;
}

// Endpoint to check AI connectivity
app.get('/api/ai-status', (_req, res) => {
  const hasKey = Boolean(getGeminiApiKey());
  res.json({
    aiConfigured: hasKey,
    model: 'gemini-3.8-flash',
  });
});

// Dynamic generative engine for creating custom scripts
function generateDynamicScript(rawTopic: string, duration: number, tone: string = 'dinámico y entretenido') {
  const topic = rawTopic.trim();
  const lower = topic.toLowerCase();

  const isFinance = /dinero|ahorr|inver|finanz|euro|dolar|rico|sueldo|gast/i.test(lower);
  const isStudy = /estudi|memor|aprender|examen|escuela|universidad|concentr|libro/i.test(lower);
  const isTech = /móvil|celular|app|batería|android|iphone|tecnolog|pc|computad/i.test(lower);
  const isHealth = /ejercic|gym|salud|dormir|sueño|sentadill|dieta|comid|cuerpo/i.test(lower);
  const isCuriosity = /curios|misteri|océano|espacio|sabías|increíble|planeta|historia/i.test(lower);

  let title = `Cómo dominar ${topic.toLowerCase()} en ${duration} segundos`;
  if (isCuriosity) title = `El secreto oculto sobre ${topic.toLowerCase()}`;
  if (isStudy) title = `3 trucos para ${topic.toLowerCase()} sin perder tiempo`;
  if (isTech) title = `Lo que nadie te enseñó sobre ${topic.toLowerCase()}`;

  let hook = `Si estás buscando resultados con ${topic.toLowerCase()}, deja de hacer esto ahora mismo.`;
  if (isStudy) hook = `El 90% de los estudiantes comete este grave error al ${topic.toLowerCase()}.`;
  if (isFinance) hook = `Si no aplicas este principio con tu dinero, estás perdiendo una fortuna cada mes.`;
  if (isCuriosity) hook = `Lo que acaban de confirmar sobre ${topic.toLowerCase()} te dejará sin palabras.`;
  if (isHealth) hook = `Haz esto durante una semana y tu cuerpo cambiará por completo.`;

  const scenes = [];

  if (duration === 15) {
    scenes.push({
      sceneNumber: 1,
      estimatedDurationSeconds: 3,
      narration: hook,
      visualDescription: 'Plano corto a la cámara. Mirada intensa y gesto llamativo de advertencia con la mano.',
      onScreenText: '¡DETÉN EL SCROLL! 🚨',
      soundEffect: 'Whoosh dinámico de apertura',
    });
    scenes.push({
      sceneNumber: 2,
      estimatedDurationSeconds: 3,
      narration: `El verdadero truco para ${topic.toLowerCase()} no requiere horas ni esfuerzo excesivo.`,
      visualDescription: 'Cambio rápido de ángulo. Expresión explicativa y sonrisa de seguridad.',
      onScreenText: 'EL ERROR COMÚN ❌',
      soundEffect: 'Giro de cámara rápido',
    });
    scenes.push({
      sceneNumber: 3,
      estimatedDurationSeconds: 3,
      narration: `Aplica la regla de enfoque inmediato durante los primeros 3 minutos de tu día.`,
      visualDescription: 'Muestra un objeto clave o el teléfono con un cronómetro digital.',
      onScreenText: 'EL MÉTODO CLAVE 💡',
      soundEffect: 'Campanilla Ding brillante',
    });
    scenes.push({
      sceneNumber: 4,
      estimatedDurationSeconds: 3,
      narration: `Verás resultados en menos de 48 horas con una facilidad que no imaginabas.`,
      visualDescription: 'Acercamiento de cámara progresivo (zoom in lento). Señalando al objetivo.',
      onScreenText: 'RESULTADO EN 48H ⚡',
      soundEffect: 'Golpe percusivo sutil',
    });
    scenes.push({
      sceneNumber: 5,
      estimatedDurationSeconds: 3,
      narration: `Guarda este vídeo para ponerlo a prueba hoy mismo y sígueme para más trucos.`,
      visualDescription: 'Señala hacia el lateral donde se guarda el vídeo y saluda a cámara.',
      onScreenText: '¡SÍGUEME Y GUARDA! 📲',
      soundEffect: 'Pop de notificación',
    });
  } else if (duration === 30) {
    scenes.push({
      sceneNumber: 1,
      estimatedDurationSeconds: 5,
      narration: `${hook} Solo necesitas 30 segundos para aprender cómo hacerlo bien.`,
      visualDescription: 'Entrada con paso enérgico hacia la cámara. Contacto visual fijo con el espectador.',
      onScreenText: '¡MIRA ESTO! ⚠️',
      soundEffect: 'Whoosh cinemático con bajo',
    });
    scenes.push({
      sceneNumber: 2,
      estimatedDurationSeconds: 5,
      narration: `Casi todo el mundo intenta abordar ${topic.toLowerCase()} usando fórmulas complicadas que solo generan frustración.`,
      visualDescription: 'Plano medio. Gesto de negación con la cabeza y manos abiertas mostrando sorpresa.',
      onScreenText: 'NO LO HAGAS ASÍ 🚫',
      soundEffect: 'Frenazo de sonido cómico',
    });
    scenes.push({
      sceneNumber: 3,
      estimatedDurationSeconds: 5,
      narration: `Paso 1: Simplifica al máximo y elimina cualquier distracción antes de arrancar.`,
      visualDescription: 'Muestra con firmeza el dedo número 1. Mirada cercana y directa.',
      onScreenText: 'PASO 1: ENFOQUE PURO 🎯',
      soundEffect: 'Ding de timbre agudo',
    });
    scenes.push({
      sceneNumber: 4,
      estimatedDurationSeconds: 5,
      narration: `Paso 2: Divide la tarea en micro-bloques de 10 minutos para mantener el impulso constante.`,
      visualDescription: 'Corte de plano a 45 grados. Muestra tu móvil o un bloc de notas.',
      onScreenText: 'PASO 2: MICRO-BLOQUES ⏱️',
      soundEffect: 'Clic tecnológico suave',
    });
    scenes.push({
      sceneNumber: 5,
      estimatedDurationSeconds: 5,
      narration: `Al combinar estos dos pasos, notarás cómo avanzas el triple en la mitad de tiempo.`,
      visualDescription: 'Gesto de aprobación con pulgar hacia arriba y sonrisa sincera.',
      onScreenText: 'EFICACIA x3 🚀',
      soundEffect: 'Acorde inspirador brillante',
    });
    scenes.push({
      sceneNumber: 6,
      estimatedDurationSeconds: 5,
      narration: `¿Cuál de estos trucos vas a probar primero? Cuéntamelo en comentarios y suscríbete para la segunda parte.`,
      visualDescription: 'Señala hacia la caja de comentarios abajo e invita a interactuar con simpatía.',
      onScreenText: '¿TÚ QUÉ DICES? 👇',
      soundEffect: 'Campanilla de suscripción',
    });
  } else {
    scenes.push({
      sceneNumber: 1,
      estimatedDurationSeconds: 8,
      narration: `${hook} Quédate hasta el final porque lo que vas a descubrir transformará tu forma de ver este tema.`,
      visualDescription: 'Plano frontal medio. Entrada dinámica y mirada fija a la cámara del teléfono.',
      onScreenText: 'EL SECRETO MAESTRO 🔓',
      soundEffect: 'Impacto cinemático con crescendo',
    });
    scenes.push({
      sceneNumber: 2,
      estimatedDurationSeconds: 8,
      narration: `Muchos creen erróneamente que para tener éxito con ${topic.toLowerCase()} necesitas talento innato o gastar dinero.`,
      visualDescription: 'Plano cerrado. Expresión escéptica cuestionando los mitos habituales.',
      onScreenText: 'EL MITO QUE TE FRENA ❌',
      soundEffect: 'Barrido de aire whoosh',
    });
    scenes.push({
      sceneNumber: 3,
      estimatedDurationSeconds: 9,
      narration: `El primer fundamento es la claridad: debes saber exactamente qué resultado quieres antes de dar el primer paso.`,
      visualDescription: 'Muestra el número 1 con los dedos. Fondo limpio e iluminación frontal.',
      onScreenText: 'PILAR 1: CLARIDAD 🎯',
      soundEffect: 'Nota musical resonante',
    });
    scenes.push({
      sceneNumber: 4,
      estimatedDurationSeconds: 9,
      narration: `El segundo secreto es la regla de la consistencia mínima: 15 minutos enfocados valen más que un esfuerzo gigante esporádico.`,
      visualDescription: 'Cambio de plano. Muestra un cronómetro en el teléfono o libreta de apuntes.',
      onScreenText: 'PILAR 2: 15 MINUTOS ⏳',
      soundEffect: 'Sonido de reloj rítmico',
    });
    scenes.push({
      sceneNumber: 5,
      estimatedDurationSeconds: 9,
      narration: `El gran obstáculo del 90% es abandonar cuando no ven cambios el primer día. Los resultados se acumulan poco a poco.`,
      visualDescription: 'Gesto de advertencia cercano con la mano. Tono empático y motivador.',
      onScreenText: 'LA TRAMPA A EVITAR ⚠️',
      soundEffect: 'Tono grave de alerta',
    });
    scenes.push({
      sceneNumber: 6,
      estimatedDurationSeconds: 9,
      narration: `Comienza hoy mismo aplicando solo el primer consejo y verás una diferencia enorme antes de que termine la semana.`,
      visualDescription: 'Plano medio de frente. Sonrisa abierta y actitud inspiradora.',
      onScreenText: 'EMPIEZA HOY 🚀',
      soundEffect: 'Chime ascendente brillante',
    });
    scenes.push({
      sceneNumber: 7,
      estimatedDurationSeconds: 8,
      narration: `Comparte este vídeo con alguien a quien le pueda servir y comenta si quieres que profundicemos en el siguiente paso.`,
      visualDescription: 'Señala hacia los iconos de compartir y guardar. Despedida cercana con la mano.',
      onScreenText: '¡COMPARTE Y SÍGUEME! 📲',
      soundEffect: 'Pop de suscripción alegre',
    });
  }

  const cleanTag = topic.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16) || 'Viral';
  const suggestedHashtags = ['#Shorts', '#AprendeEnTikTok', '#Reels', '#Consejos', `#${cleanTag}`];

  const tipsForCreator = [
    'Mira fijamente al lente de la cámara del móvil en lugar de mirarte a la pantalla para crear conexión directa con el espectador.',
    'Grábate de día mirando de frente hacia una ventana; la luz natural suave en tu rostro da un aspecto limpio y profesional.',
    'Pronuncia el gancho inicial de los primeros 3 segundos con un 20% más de energía y entusiasmo de lo normal.',
    'Usa la aplicación gratuita CapCut para agregar subtítulos automáticos con colores dinámicos en cuestión de segundos.',
  ];

  return {
    title,
    hook,
    estimatedDuration: duration,
    suggestedMusicMood: 'Beat lo-fi enérgico o pista acústica moderna con ritmo constante',
    suggestedHashtags,
    scenes,
    callToAction: scenes[scenes.length - 1].narration,
    tipsForCreator,
  };
}

app.post('/api/generate-script', async (req, res) => {
  try {
    const { topic, duration = 30, tone = 'dinámico y entretenido', audience = 'principiantes y público general' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      res.status(400).json({ error: 'Por favor, introduce un tema o idea para el vídeo.' });
      return;
    }

    const validDurations = [15, 30, 60];
    const targetDuration = validDurations.includes(Number(duration)) ? Number(duration) : 30;

    const apiKey = getGeminiApiKey();

    // If Gemini API Key is available, invoke the official Gemini 3.8 Flash model
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const wordBudget =
          targetDuration === 15
            ? 'aproximadamente 35-45 palabras habladas'
            : targetDuration === 30
            ? 'aproximadamente 70-90 palabras habladas'
            : 'aproximadamente 140-165 palabras habladas';

        const targetSceneCount = targetDuration === 15 ? 5 : targetDuration === 30 ? 6 : 7;

        const systemInstruction = `Eres un guionista profesional de élite especializado en vídeos verticales de formato corto para YouTube Shorts, TikTok e Instagram Reels.
Tu misión es redactar guiones originales, cautivadores y estructurados milimétricamente para creadores principiantes.
Todo el contenido generado debe ser original para el tema solicitado, en español natural y de alto impacto.`;

        const userPrompt = `Genera un guion original para un vídeo corto vertical (Shorts / TikTok / Reels).

TEMA SOLICITADO: "${topic.trim()}"
DURACIÓN OBJETIVO: ${targetDuration} segundos (${wordBudget}).
TONO DEL CREADOR: ${tone}.
PÚBLICO OBJETIVO: ${audience}.

REGLAS DE OBLIGADO CUMPLIMIENTO:
1. NÚMERO DE ESCENAS: El guion DEBE contener exactamente entre 5 y 8 escenas (recomendado exactamente ${targetSceneCount} escenas para que el ritmo cuadre con los ${targetDuration} segundos).
2. GANCHO INICIAL (0:00 a 0:03 segundos): La primera frase debe frenar de inmediato el scroll del usuario en redes sociales con un planteamiento intrigante o una pregunta directa sobre "${topic.trim()}".
3. DETALLE DE CADA ESCENA: Cada escena debe incluir:
   - sceneNumber: Número correlativo de la escena (del 1 al total).
   - estimatedDurationSeconds: Segundos estimados de duración de esta escena específica (la suma total debe sumar exactamente o muy cerca de ${targetDuration}s).
   - narration: Lo que el creador dice en voz alta ante la cámara o en voz en off. Lenguaje fluido, natural y directo.
   - visualDescription: Indicación visual práctica para principiantes (qué enfocar con la cámara del móvil, gestos, planos, cortes o acciones sencillas).
   - onScreenText: Texto llamativo de 3 a 6 palabras para mostrar grande en pantalla con mayúsculas y emojis.
   - soundEffect: Efecto sonoro sugerido para potenciar la edición (ej: Whoosh dinámico, Campanilla ding, etc.).
4. LLAMADA A LA ACCIÓN (callToAction): Cierre natural y persuasivo que invite al espectador a comentar o seguir la cuenta.
5. CONSEJOS DE GRABACIÓN (tipsForCreator): 3 o 4 consejos prácticos específicos para grabar este vídeo con un teléfono móvil y 0€ de presupuesto.
6. TÍTULO Y HASHTAGS: Título viral llamativo y 4 a 6 hashtags relevantes en español.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                hook: { type: Type.STRING },
                estimatedDuration: { type: Type.INTEGER },
                suggestedMusicMood: { type: Type.STRING },
                suggestedHashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sceneNumber: { type: Type.INTEGER },
                      estimatedDurationSeconds: { type: Type.INTEGER },
                      narration: { type: Type.STRING },
                      visualDescription: { type: Type.STRING },
                      onScreenText: { type: Type.STRING },
                      soundEffect: { type: Type.STRING },
                    },
                    required: [
                      'sceneNumber',
                      'estimatedDurationSeconds',
                      'narration',
                      'visualDescription',
                      'onScreenText',
                      'soundEffect',
                    ],
                  },
                },
                callToAction: { type: Type.STRING },
                tipsForCreator: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'title',
                'hook',
                'estimatedDuration',
                'suggestedMusicMood',
                'suggestedHashtags',
                'scenes',
                'callToAction',
                'tipsForCreator',
              ],
            },
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          const scriptData = JSON.parse(textOutput);
          res.json({ success: true, script: scriptData, engine: 'gemini-3.8-flash' });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call notice, generating dynamic structured script:', geminiError?.message);
      }
    }

    // Generate dynamic customized script tailored to the exact topic and duration
    const fallbackScript = generateDynamicScript(topic, targetDuration, tone);
    res.json({ success: true, script: fallbackScript, engine: 'dynamic-synthesizer' });
  } catch (error: any) {
    console.error('Error generating script:', error);
    try {
      const topic = req.body?.topic || 'Vídeo viral';
      const duration = Number(req.body?.duration) || 30;
      const scriptData = generateDynamicScript(topic, duration);
      res.json({ success: true, script: scriptData });
    } catch {
      res.status(400).json({
        error: 'No se pudo procesar el tema introducido. Por favor, escribe un tema válido.',
      });
    }
  }
});

// Endpoint to render vertical 9:16 MP4 video with FFmpeg
app.post('/api/render-video', async (req, res) => {
  try {
    const { script } = req.body;
    if (!script || !script.scenes || !Array.isArray(script.scenes) || script.scenes.length === 0) {
      res.status(400).json({ error: 'El guion no contiene escenas válidas para renderizar el vídeo.' });
      return;
    }

    const renderResult = await renderScriptToMp4(script);
    res.json({
      success: true,
      filename: renderResult.filename,
      videoUrl: `/api/videos/${renderResult.filename}`,
      downloadUrl: `/api/download-video/${renderResult.filename}`,
      durationSeconds: renderResult.durationSeconds,
    });
  } catch (err: any) {
    console.error('Error rendering video with FFmpeg:', err);
    res.status(500).json({
      error: `Error al procesar el vídeo MP4: ${err?.message || 'Fallo durante la codificación con FFmpeg.'}`,
    });
  }
});

// Endpoint to stream the MP4 video for HTML5 preview playback
app.get('/api/videos/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(getRenderedVideosDir(), filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'El archivo de vídeo no existe o ha expirado.' });
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// Endpoint to download the MP4 file
app.get('/api/download-video/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(getRenderedVideosDir(), filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'El archivo de vídeo no existe o ha expirado.' });
    return;
  }

  res.download(filePath, filename);
});

// Setup dev or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`AutoShorts AI server running on port ${port}`);
  });
}

startServer();
