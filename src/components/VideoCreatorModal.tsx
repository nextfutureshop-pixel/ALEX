import React, { useState } from 'react';
import {
  X,
  Video,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Film,
  Layers,
  Clock,
  Smartphone,
} from 'lucide-react';
import { GeneratedScript } from '../types';

interface VideoCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: GeneratedScript;
}

const RENDER_STEPS = [
  'Diseñando fotogramas 9:16 de cada escena...',
  'Aplicando textos en pantalla de alto contraste...',
  'Sincronizando subtítulos de la narración hablada...',
  'Codificando con FFmpeg H.264 y pista de audio AAC...',
  'Ensamblando el archivo MP4 vertical final...',
];

export const VideoCreatorModal: React.FC<VideoCreatorModalProps> = ({ isOpen, onClose, script }) => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderStepIndex, setRenderStepIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    setIsRendering(true);
    setError(null);
    setRenderStepIndex(0);

    const stepInterval = setInterval(() => {
      setRenderStepIndex((prev) => (prev + 1) % RENDER_STEPS.length);
    }, 1800);

    try {
      const response = await fetch('/api/render-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'No se pudo codificar el vídeo MP4.');
      }

      setVideoUrl(data.videoUrl);
      setDownloadUrl(data.downloadUrl);
      setVideoDuration(data.durationSeconds || script.estimatedDuration);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err?.message || 'Error durante la renderización del vídeo MP4.');
    } finally {
      setIsRendering(false);
    }
  };

  const handleResetRender = () => {
    setVideoUrl(null);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  Crear Vídeo Vertical MP4
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  9:16 HD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Renderiza un archivo de vídeo real para YouTube Shorts, TikTok y Reels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 relative z-10">
          {/* Error banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-300 underline shrink-0">
                Cerrar
              </button>
            </div>
          )}

          {/* STATE 1: Ready to render */}
          {!videoUrl && !isRendering && (
            <div className="space-y-5">
              {/* Video Specs Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-300">
                    Resumen del vídeo a crear:
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-400" />
                      {script.estimatedDuration} segundos
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      {script.scenes.length} escenas
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{script.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 italic">
                    Gancho inicial: "{script.hook}"
                  </p>
                </div>
              </div>

              {/* What will be included */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  El vídeo final incluirá automáticamente:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Formato vertical universal 9:16 (720x1280)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Texto viral en pantalla en cada escena</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Subtítulos sincronizados con la narración</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Archivo .MP4 listo para descargar y publicar</span>
                  </div>
                </div>
              </div>

              {/* Big Render Button */}
              <button
                onClick={handleStartRender}
                className="w-full py-3.5 px-6 rounded-xl font-display font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:via-red-500 hover:to-amber-500 shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Video className="w-5 h-5 text-amber-200" />
                <span>Renderizar vídeo MP4 ahora</span>
              </button>
            </div>
          )}

          {/* STATE 2: Rendering in progress */}
          {isRendering && (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
                <Film className="w-6 h-6 text-rose-400 absolute inset-0 m-auto" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="text-base font-bold text-white">
                  Creando tu vídeo vertical MP4...
                </h4>
                <p className="text-xs text-rose-300 font-medium animate-pulse">
                  {RENDER_STEPS[renderStepIndex]}
                </p>
                <p className="text-[11px] text-slate-500">
                  Procesando {script.scenes.length} escenas con el motor de renderizado H.264
                </p>
              </div>

              {/* Progress bar animation */}
              <div className="w-full max-w-xs mx-auto bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full w-full animate-pulse" />
              </div>
            </div>
          )}

          {/* STATE 3: Render completed with REAL HTML5 video player and download button! */}
          {videoUrl && !isRendering && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">¡Vídeo MP4 renderizado con éxito!</span>
                </div>
                {videoDuration && (
                  <span className="font-mono text-[11px] text-emerald-200">
                    Duración: {videoDuration}s
                  </span>
                )}
              </div>

              {/* Real Video Player */}
              <div className="flex flex-col items-center">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full max-w-[260px] sm:max-w-[290px] aspect-[9/16] rounded-2xl shadow-2xl border-2 border-slate-700 bg-black object-cover"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Previsualización real del vídeo MP4 vertical (9:16)
                </p>
              </div>

              {/* Action Buttons: Download & Regenerate */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:via-red-500 hover:to-amber-500 shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-200" />
                    <span>Descargar vídeo (.mp4)</span>
                  </a>
                )}

                <button
                  onClick={handleResetRender}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver a renderizar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 relative z-10">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            Compatible con YouTube Shorts, TikTok e Instagram Reels
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
