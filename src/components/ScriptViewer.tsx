import React, { useState } from 'react';
import {
  Copy,
  Download,
  Check,
  Flame,
  Volume2,
  Eye,
  Type as TypeIcon,
  Mic,
  Smartphone,
  ListOrdered,
  FileText,
  Sparkles,
  Share2,
  Hash,
  Lightbulb,
  RotateCcw,
  ExternalLink,
  Video,
} from 'lucide-react';
import { GeneratedScript } from '../types';
import { downloadScriptFile, copyText, formatScriptAsText, formatNarrationOnly } from '../utils/formatters';
import { PhoneSimulator } from './PhoneSimulator';
import { VideoCreatorModal } from './VideoCreatorModal';

interface ScriptViewerProps {
  script: GeneratedScript;
  onReset: () => void;
  onOpenTransparency: () => void;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ script, onReset, onOpenTransparency }) => {
  const [activeTab, setActiveTab] = useState<'scenes' | 'simulator' | 'teleprompter'>('scenes');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedNarration, setCopiedNarration] = useState(false);
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedSceneIndex, setCopiedSceneIndex] = useState<number | null>(null);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleCopyFull = async () => {
    const text = formatScriptAsText(script);
    const success = await copyText(text);
    if (success) {
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2500);
    }
  };

  const handleCopyNarration = async () => {
    const text = formatNarrationOnly(script);
    const success = await copyText(text);
    if (success) {
      setCopiedNarration(true);
      setTimeout(() => setCopiedNarration(false), 2500);
    }
  };

  const handleCopyHook = async () => {
    const success = await copyText(script.hook);
    if (success) {
      setCopiedHook(true);
      setTimeout(() => setCopiedHook(false), 2500);
    }
  };

  const handleCopyScene = async (text: string, index: number) => {
    const success = await copyText(text);
    if (success) {
      setCopiedSceneIndex(index);
      setTimeout(() => setCopiedSceneIndex(null), 2500);
    }
  };

  const handleCopyHashtags = async () => {
    const success = await copyText(script.suggestedHashtags.join(' '));
    if (success) {
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2500);
    }
  };

  const totalWords = script.scenes.reduce((acc, s) => acc + s.narration.split(/\s+/).filter(Boolean).length, 0);

  return (
    <div className="w-full space-y-6">
      {/* Top action header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                {script.estimatedDuration} Segundos
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                {script.scenes.length} Escenas
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                ~{totalWords} Palabras habladas
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">
              {script.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Tema base: <span className="text-slate-300 italic font-medium">"{script.topic}"</span>
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyFull}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                copiedFull
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600'
              }`}
              title="Copiar todo el guion con escenas y descripciones"
            >
              {copiedFull ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copiedFull ? '¡Guion copiado!' : 'Copiar guion'}</span>
            </button>

            <button
              onClick={() => downloadScriptFile(script)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 transition-all"
              title="Descargar guion en archivo de texto .txt"
            >
              <Download className="w-4 h-4 text-rose-300" />
              <span>Descargar .txt</span>
            </button>

            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:via-red-500 hover:to-amber-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              title="Crear y renderizar un archivo de vídeo vertical real en formato MP4"
            >
              <Video className="w-4 h-4 text-white" />
              <span>Crear vídeo MP4</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Escribir otro tema"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Hook banner (Crucial 3s) */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-950 border border-rose-500/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Gancho Inicial (0:00 - 0:03s) • Retención Inmediata</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                "{script.hook}"
              </p>
              <p className="text-xs text-slate-400">
                Lo primero que dices nada más empezar el vídeo para frenar el scroll del usuario en YouTube Shorts, TikTok y Reels.
              </p>
            </div>

            <button
              onClick={handleCopyHook}
              className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-colors"
            >
              {copiedHook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHook ? 'Copiado' : 'Copiar gancho'}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-5 flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('scenes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'scenes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Desglose de Escenas ({script.scenes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Simulador Móvil 9:16</span>
            </button>

            <button
              onClick={() => setActiveTab('teleprompter')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'teleprompter'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Modo Lectura / Teleprompter</span>
            </button>
          </div>

          <button
            onClick={handleCopyNarration}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 transition-colors"
            title="Copiar solo el texto hablado para usar como voz en off o teleprompter"
          >
            {copiedNarration ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNarration ? 'Voz copiada' : 'Copiar solo narración'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCENE BY SCENE BREAKDOWN */}
      {activeTab === 'scenes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              💡 Cada escena te indica exactamente qué decir, qué enfocar con la cámara y qué texto poner en pantalla.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {script.scenes.map((scene, idx) => (
              <div
                key={scene.sceneNumber}
                className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md hover:shadow-lg hover:shadow-black/20"
              >
                {/* Scene Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                      {scene.sceneNumber}
                    </span>
                    <span className="font-bold text-sm text-slate-200">
                      Escena {scene.sceneNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                      ~{scene.estimatedDurationSeconds} seg
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {scene.soundEffect && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        <Volume2 className="w-3 h-3" /> {scene.soundEffect}
                      </span>
                    )}
                    <button
                      onClick={() => handleCopyScene(scene.narration, idx)}
                      className="text-xs text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Copiar narración de esta escena"
                    >
                      {copiedSceneIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3 Pillars of each scene: Narration, Visual Description, On-Screen Text */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Pillar 1: Narration */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5 md:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <Mic className="w-3.5 h-3.5" />
                      <span>🎙️ Narración (Lo que dices):</span>
                    </div>
                    <p className="text-sm font-medium text-slate-100 leading-relaxed">
                      "{scene.narration}"
                    </p>
                  </div>

                  {/* Pillar 2: Visual description */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5 md:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>📹 Toma Visual (Lo que grabas):</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {scene.visualDescription}
                    </p>
                  </div>

                  {/* Pillar 3: On-screen text & sound */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2 md:col-span-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                        <TypeIcon className="w-3.5 h-3.5" />
                        <span>📱 Texto en pantalla:</span>
                      </div>
                      <div className="inline-block p-1.5 px-2.5 rounded-lg bg-black/80 border border-yellow-500/40 text-yellow-300 font-bold text-xs uppercase tracking-wide">
                        {scene.onScreenText}
                      </div>
                    </div>

                    {scene.soundEffect && (
                      <div className="pt-1 text-[11px] text-purple-300 flex items-center gap-1 border-t border-slate-800/60">
                        <Volume2 className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">Audio: {scene.soundEffect}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                Cierre y Llamada a la Acción (CTA)
              </span>
              <p className="text-sm font-semibold text-white">
                "{script.callToAction}"
              </p>
            </div>
            <button
              onClick={() => copyText(script.callToAction)}
              className="self-start sm:self-center shrink-0 text-xs px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-colors"
            >
              Copiar CTA
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VERTICAL PHONE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <PhoneSimulator script={script} />
          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                ¿Quieres este vídeo en archivo real?
              </h4>
              <p className="text-[11px] text-slate-400">
                Renderiza un vídeo MP4 vertical de 9:16 con todas las escenas para descargarlo a tu dispositivo.
              </p>
            </div>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-md shadow-rose-600/30 shrink-0 cursor-pointer"
            >
              Crear vídeo MP4
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TELEPROMPTER / EASY READING MODE */}
      {activeTab === 'teleprompter' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-400" />
                Modo Teleprompter (Para leer mientras grabas)
              </h3>
              <p className="text-xs text-slate-400">
                Pon el móvil frente a ti y lee cada frase con calma y entusiasmo.
              </p>
            </div>
            <button
              onClick={handleCopyNarration}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              {copiedNarration ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedNarration ? '¡Copiado!' : 'Copiar todo'}</span>
            </button>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Hook item */}
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                🔥 Gancho (Segundos 0-3):
              </span>
              <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                "{script.hook}"
              </p>
            </div>

            {/* Scenes */}
            <div className="space-y-4">
              {script.scenes.map((scene) => (
                <div key={scene.sceneNumber} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                    <span className="font-bold text-indigo-400">Escena {scene.sceneNumber}</span>
                    <span>~{scene.estimatedDurationSeconds}s</span>
                  </div>
                  <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
                    "{scene.narration}"
                  </p>
                  <p className="text-xs text-slate-500 mt-2 italic">
                    (Visual: {scene.visualDescription})
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                📣 Cierre final:
              </span>
              <p className="text-base sm:text-lg font-bold text-white">
                "{script.callToAction}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Creator Tips & Hashtags Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tips for Beginners */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Consejos gratuitos de grabación para principiantes</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {script.tipsForCreator.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/25">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Music & Hashtags */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
              <Volume2 className="w-4 h-4" />
              <span>Música y estilo de audio</span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              🎵 {script.suggestedMusicMood}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hashtags recomendados</span>
              </div>
              <button
                onClick={handleCopyHashtags}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedHashtags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHashtags ? 'Copiados' : 'Copiar todos'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {script.suggestedHashtags.map((h, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 text-indigo-300 border border-indigo-500/20"
                >
                  {h.startsWith('#') ? h : `#${h}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info banner on 100% free workflow (Requirement 10) */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>
            <strong className="text-slate-200">¿Cómo editar este guion gratis?</strong> Pega el texto en CapCut (gratis en móvil y PC) para subtítulos automáticos y añade música libre de derechos desde la biblioteca de YouTube o TikTok.
          </span>
        </div>
        <button
          onClick={onOpenTransparency}
          className="text-xs text-emerald-400 hover:text-emerald-300 shrink-0 underline decoration-emerald-500/40"
        >
          Saber más sobre nuestra política sin pagos
        </button>
      </div>

      {/* Video Creator MP4 Modal */}
      <VideoCreatorModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        script={script}
      />
    </div>
  );
};
