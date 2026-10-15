import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Sparkles, Heart, MessageCircle, Share2, Bookmark, Music2 } from 'lucide-react';
import { GeneratedScript } from '../types';

interface PhoneSimulatorProps {
  script: GeneratedScript;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ script }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);

  const scenes = script.scenes || [];
  const currentScene = scenes[activeSceneIndex] || scenes[0];

  // Playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentScene) {
      const durationMs = (currentScene.estimatedDurationSeconds || 5) * 1000;
      const intervalMs = 100;
      const step = (intervalMs / durationMs) * 100;

      timer = setInterval(() => {
        setSceneProgress((prev) => {
          if (prev >= 100) {
            // Advance to next scene
            if (activeSceneIndex < scenes.length - 1) {
              setActiveSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              // Loop or finish
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + step;
        });
      }, intervalMs);
    }

    return () => clearInterval(timer);
  }, [isPlaying, activeSceneIndex, currentScene, scenes.length]);

  const handleNext = () => {
    if (activeSceneIndex < scenes.length - 1) {
      setActiveSceneIndex((idx) => idx + 1);
      setSceneProgress(0);
    }
  };

  const handlePrev = () => {
    if (activeSceneIndex > 0) {
      setActiveSceneIndex((idx) => idx - 1);
      setSceneProgress(0);
    }
  };

  const handleTogglePlay = () => {
    if (!isPlaying && sceneProgress >= 98 && activeSceneIndex === scenes.length - 1) {
      setActiveSceneIndex(0);
      setSceneProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const calculateTotalSecondsSoFar = () => {
    let sum = 0;
    for (let i = 0; i < activeSceneIndex; i++) {
      sum += scenes[i]?.estimatedDurationSeconds || 5;
    }
    return sum;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      {/* Simulator title & scene navigation bar */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-medium text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          Simulador 9:16 (Shorts / TikTok)
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
          Escena {activeSceneIndex + 1} de {scenes.length}
        </span>
      </div>

      {/* Smartphone Frame (9:16 Aspect Ratio) */}
      <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[38px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-rose-950/40 ring-1 ring-white/10 flex flex-col justify-between overflow-hidden">
        {/* Phone screen inside */}
        <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-slate-950 flex flex-col justify-between border border-slate-800/80">
          
          {/* Background visual simulation with ambient mood */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-500/15 via-transparent to-transparent pointer-events-none" />

          {/* Top Notch & Info Bar */}
          <div className="relative z-20 pt-3 px-4 flex items-center justify-between text-[11px] text-white/80">
            {/* Top pill */}
            <div className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>Escena {currentScene.sceneNumber}</span>
              <span className="text-slate-400">({currentScene.estimatedDurationSeconds}s)</span>
            </div>

            <div className="text-[10px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded">
              ~{calculateTotalSecondsSoFar()}s / {script.estimatedDuration}s
            </div>
          </div>

          {/* Visual cue card (describes what the camera sees) */}
          <div className="relative z-10 px-4 mt-2">
            <div className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-left">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                <span>📹 Toma visual:</span>
              </div>
              <p className="text-[11px] text-slate-200 line-clamp-3 leading-snug">
                {currentScene.visualDescription}
              </p>
            </div>
          </div>

          {/* Center Stage: ON-SCREEN TEXT (Bold viral typography as seen on TikTok/CapCut) */}
          <div className="relative z-20 my-auto px-4 text-center">
            <div className="inline-block transform hover:scale-105 transition-transform duration-200">
              <span className="font-display font-black text-lg sm:text-xl text-yellow-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-black/75 px-3 py-1.5 rounded-xl border border-yellow-400/40 tracking-wide uppercase leading-tight block">
                {currentScene.onScreenText}
              </span>
            </div>

            {/* Sound effect chip */}
            {currentScene.soundEffect && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm shadow-md">
                <Volume2 className="w-3 h-3 text-indigo-300" />
                <span>{currentScene.soundEffect}</span>
              </div>
            )}
          </div>

          {/* Bottom Area: Social UI Overlay & Spoken Narration */}
          <div className="relative z-20 p-4 space-y-2.5">
            {/* Social right rail icons */}
            <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3 text-white/90">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <span className="text-[9px] font-bold mt-0.5">14.2k</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold mt-0.5">328</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold mt-0.5">2.1k</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold mt-0.5">Share</span>
              </div>
            </div>

            {/* Spoken Narration Subtitle Box */}
            <div className="mr-12 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-left">
              <div className="text-[10px] font-semibold text-rose-400 flex items-center gap-1 mb-0.5">
                <span>🎙️ Dices:</span>
              </div>
              <p className="text-xs text-white font-medium leading-relaxed">
                "{currentScene.narration}"
              </p>
            </div>

            {/* Audio track preview footer */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
              <Music2 className="w-3 h-3 text-yellow-400 animate-spin" />
              <span className="truncate max-w-[190px]">{script.suggestedMusicMood}</span>
            </div>

            {/* Scene progress bar */}
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${sceneProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playback & Scene Navigation controls under phone */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={activeSceneIndex === 0}
          className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
          title="Escena anterior"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={handleTogglePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{sceneProgress > 0 && activeSceneIndex === scenes.length - 1 ? 'Reiniciar' : 'Reproducir'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={activeSceneIndex === scenes.length - 1}
          className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
          title="Escena siguiente"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Scene selector dots */}
      <div className="flex items-center gap-1.5 mt-2.5">
        {scenes.map((s, idx) => (
          <button
            key={s.sceneNumber}
            onClick={() => {
              setActiveSceneIndex(idx);
              setSceneProgress(0);
            }}
            className={`transition-all rounded-full ${
              activeSceneIndex === idx
                ? 'w-6 h-2 bg-rose-500'
                : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
            }`}
            title={`Ir a escena ${s.sceneNumber}`}
          />
        ))}
      </div>
    </div>
  );
};
