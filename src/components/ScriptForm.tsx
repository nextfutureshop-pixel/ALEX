import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Lightbulb, RefreshCw, Wand2, ArrowRight } from 'lucide-react';

interface ScriptFormProps {
  onGenerate: (topic: string, duration: 15 | 30 | 60, tone: string) => Promise<void>;
  isLoading: boolean;
}

const INSPIRATION_TOPICS = [
  '5 trucos psicológicos para estudiar mejor y más rápido',
  'El misterio más perturbador descubierto en el fondo del océano',
  'El gran error que casi todos cometemos al cargar el móvil',
  'Cómo ahorrar tus primeros 500€ aunque ganes poco dinero',
  '3 apps gratuitas para organizar tu vida que parecen ilegales',
  'Por qué procrastinamos y el truco de los 2 minutos para vencerlo',
];

const TONES = [
  { id: 'dinámico y entretenido', label: '🔥 Dinámico y divertido', desc: 'Rápido, con energía y toques de humor' },
  { id: 'educativo y curioso', label: '🧠 Educativo y curioso', desc: 'Datos sorprendentes explicados fácil' },
  { id: 'tutorial paso a paso', label: '🛠️ Tutorial paso a paso', desc: 'Práctico, claro y directo al grano' },
  { id: 'misterioso e intrigante', label: '🕵️ Misterioso e intrigante', desc: 'Suspense constante hasta el final' },
  { id: 'motivador y enérgico', label: '🚀 Motivador y enérgico', desc: 'Inspiración y acción positiva' },
];

const LOADING_STEPS = [
  'Buscando el gancho perfecto para los primeros 3 segundos...',
  'Diseñando entre 5 y 8 escenas visuales de alto impacto...',
  'Calculando el tiempo de narración exacto...',
  'Escribiendo textos en pantalla que atrapen sin volumen...',
  'Añadiendo consejos gratuitos de grabación para principiantes...',
];

export const ScriptForm: React.FC<ScriptFormProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const [tone, setTone] = useState(TONES[0].id);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onGenerate(topic.trim(), duration, tone);
  };

  const handlePickInspiration = (item: string) => {
    setTopic(item);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Intro */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Paso 1: Configura tu vídeo
            </span>
            <span className="text-xs text-slate-400">Impulsado por Gemini 3.8 Flash</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            ¿Sobre qué quieres crear tu vídeo corto?
          </h2>
          <p className="text-sm text-slate-400">
            Escribe tu idea y la IA creará un guion optimizado para retención con gancho inicial y desglose de escenas.
          </p>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-200">
            Tema o título de tu vídeo <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <textarea
              id="topic-input"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ejemplo: 3 trucos para levantarse temprano sin cansancio, Curiosidades sobre Japón que no sabías, o Cómo aprender inglés gratis..."
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all resize-none disabled:opacity-50"
            />
            {topic.length > 0 && !isLoading && (
              <button
                type="button"
                onClick={() => setTopic('')}
                className="absolute top-3 right-3 text-xs text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded bg-slate-800/80"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Inspiration chips */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>¿No sabes qué elegir? Prueba una de estas ideas populares:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INSPIRATION_TOPICS.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePickInspiration(item)}
                  disabled={isLoading}
                  className="text-xs text-left px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1 group"
                >
                  <span className="truncate max-w-[260px] sm:max-w-none">{item}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Duration selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-400" />
              Duración deseada del vídeo
            </label>
            <span className="text-xs text-slate-400">Recomendado para empezar: 30 segundos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 15 seconds */}
            <button
              type="button"
              onClick={() => setDuration(15)}
              disabled={isLoading}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                duration === 15
                  ? 'bg-rose-500/15 border-rose-500 ring-1 ring-rose-500/40 text-white shadow-md shadow-rose-950/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-base font-display">15 Segundos</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Rápido
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Máxima retención. 1 idea directa y contundente (~40 palabras).
              </p>
            </button>

            {/* 30 seconds */}
            <button
              type="button"
              onClick={() => setDuration(30)}
              disabled={isLoading}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                duration === 30
                  ? 'bg-rose-500/15 border-rose-500 ring-1 ring-rose-500/40 text-white shadow-md shadow-rose-950/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-base font-display">30 Segundos</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ideal ⭐
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                El formato rey. Gancho, 3 puntos clave y cierre (~80 palabras).
              </p>
            </button>

            {/* 60 seconds */}
            <button
              type="button"
              onClick={() => setDuration(60)}
              disabled={isLoading}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                duration === 60
                  ? 'bg-rose-500/15 border-rose-500 ring-1 ring-rose-500/40 text-white shadow-md shadow-rose-950/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-base font-display">60 Segundos</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Detallado
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Historia o tutorial más completo con más valor (~150 palabras).
              </p>
            </button>
          </div>
        </div>

        {/* Tone options toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 focus:outline-none"
          >
            <span>{showAdvanced ? '▼ Ocultar opciones de tono' : '▶ Personalizar tono del vídeo (Opcional)'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Selecciona la personalidad del creador:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`p-2.5 rounded-lg border text-left transition-colors text-xs ${
                      tone === t.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-medium text-slate-200">{t.label}</div>
                    <div className="text-[11px] text-slate-400">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full relative group overflow-hidden py-3.5 px-6 rounded-xl font-display font-bold text-base text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:via-red-500 hover:to-amber-500 shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>Generando guion con IA...</span>
              </div>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>Generar guion</span>
              </>
            )}
          </button>

          {/* Loading status bar */}
          {isLoading && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center animate-pulse">
              <p className="text-xs text-rose-300 font-medium">
                {LOADING_STEPS[loadingStepIndex]}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
