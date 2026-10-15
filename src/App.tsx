import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScriptForm } from './components/ScriptForm';
import { ScriptViewer } from './components/ScriptViewer';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { TransparencyModal } from './components/TransparencyModal';
import { ScriptHistoryModal } from './components/ScriptHistoryModal';
import { GeneratedScript } from './types';
import { Sparkles, AlertCircle, Film, ArrowRight } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'autoshorts_ai_scripts_v1';

export default function App() {
  const [currentScript, setCurrentScript] = useState<GeneratedScript | null>(null);
  const [history, setHistory] = useState<GeneratedScript[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);


  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading history from localStorage:', e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (newScript: GeneratedScript) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newScript.id);
      const updated = [newScript, ...filtered].slice(0, 20); // Keep last 20
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      return updated;
    });
  };

  const handleDeleteFromHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating localStorage:', e);
      }
      return updated;
    });
    if (currentScript?.id === id) {
      setCurrentScript(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const handleGenerate = async (topic: string, duration: 15 | 30 | 60, tone: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          duration,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'No se pudo generar el guion. Inténtalo de nuevo.');
        return;
      }

      const scriptWithMeta: GeneratedScript = {
        ...data.script,
        id: `script_${Date.now()}`,
        createdAt: new Date().toISOString(),
        topic,
      };

      setCurrentScript(scriptWithMeta);
      saveToHistory(scriptWithMeta);

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Ha ocurrido un problema al comunicar con el servidor. Comprueba tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTransparency={() => setIsTransparencyOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

        {/* Error notification banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-red-300">Aviso del servicio de IA</h4>
                <p className="text-xs text-red-200/90 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold text-red-300 hover:text-white px-2 py-1 rounded bg-red-900/40"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* View Mode: Active Script Viewer vs Creation Form */}
        {currentScript ? (
          <ScriptViewer
            script={currentScript}
            onReset={() => setCurrentScript(null)}
            onOpenTransparency={() => setIsTransparencyOpen(true)}
          />
        ) : (
          <div className="space-y-10">
            {/* Hero Greeting for Beginners */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generación original con Gemini 3.8 Flash</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Crea guiones virales para{' '}
                <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 bg-clip-text text-transparent">
                  Shorts, Reels y TikTok
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Escribe cualquier tema y el modelo de inteligencia artificial creará un guion original con gancho inicial de 3 segundos, desglose escena por escena y textos para pantalla.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Gancho inicial que frena el scroll
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Entre 5 y 8 escenas detalladas
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Textos en pantalla e indicaciones visuales
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Descargable en archivo .txt
                </span>
              </div>
            </div>

            {/* Script Form Generator */}
            <div className="max-w-3xl mx-auto">
              <ScriptForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Step by step simple cards for beginners */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="text-center mb-6">
                <h3 className="font-display font-bold text-lg text-slate-200">
                  ¿Cómo funciona AutoShorts AI?
                </h3>
                <p className="text-xs text-slate-400">
                  3 pasos sin complicaciones técnicas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-slate-200">Elige un tema y duración</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Escribe cualquier curiosidad, consejo o tutorial y selecciona 15, 30 o 60 segundos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-slate-200">Revisa la simulación 9:16</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Visualiza cómo quedará en la pantalla del móvil con nuestro simulador vertical interactivo.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-slate-200">Copia o descarga en .txt</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Descarga tu archivo de texto, grábate con tu teléfono y añade subtítulos fácilmente.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick history strip if scripts exist */}
            {history.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Film className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      Tienes {history.length} guion{history.length === 1 ? '' : 'es'} guardado{history.length === 1 ? '' : 's'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Último: <span className="text-slate-300 italic">{history[0].title}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                >
                  <span>Ver mis guiones</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-2">
        <p>
          AutoShorts AI — Generador de guiones con Google Gemini para YouTube Shorts, TikTok e Instagram Reels.
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <button onClick={() => setIsGuideOpen(true)} className="hover:text-slate-200 underline">
            Guía para principiantes
          </button>
          <span>•</span>
          <button onClick={() => setIsTransparencyOpen(true)} className="hover:text-slate-200 underline">
            Transparencia y cuotas de IA
          </button>
        </div>
      </footer>

      {/* Modals */}
      <BeginnerGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <TransparencyModal isOpen={isTransparencyOpen} onClose={() => setIsTransparencyOpen(false)} />
      <ScriptHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectScript={(script) => {
          setCurrentScript(script);
          setIsHistoryOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteScript={handleDeleteFromHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
