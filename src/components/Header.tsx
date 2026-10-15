import React from 'react';
import { Sparkles, Video, BookOpen, ShieldCheck, History } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenTransparency: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenTransparency,
  onToggleHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 text-white shadow-lg shadow-rose-500/20 ring-1 ring-white/20">
            <Video className="w-5 h-5" />
            <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AutoShorts AI
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Guiones originales con IA para YouTube Shorts, TikTok y Reels
            </p>
          </div>
        </div>

        {/* Action badges & modal triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Ver guiones guardados anteriormente"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Mis Guiones</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Guía Principiantes</span>
            <span className="md:hidden">Guía</span>
          </button>

          <button
            onClick={onOpenTransparency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 transition-colors"
            title="Conoce nuestro compromiso sin pagos ni costes ocultos"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sin Pagos</span>
          </button>
        </div>
      </div>
    </header>
  );
};
