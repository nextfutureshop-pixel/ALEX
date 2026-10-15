import React from 'react';
import { X, History, Trash2, Download, ArrowRight, Clock, Film } from 'lucide-react';
import { GeneratedScript } from '../types';
import { downloadScriptFile } from '../utils/formatters';

interface ScriptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedScript[];
  onSelectScript: (script: GeneratedScript) => void;
  onDeleteScript: (id: string) => void;
  onClearHistory: () => void;
}

export const ScriptHistoryModal: React.FC<ScriptHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScript,
  onDeleteScript,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Mis Guiones Guardados ({history.length})
              </h3>
              <p className="text-xs text-slate-400">
                Guardados automáticamente en tu navegador para que nunca los pierdas.
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

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Film className="w-12 h-12 text-slate-600 mx-auto stroke-[1.5]" />
              <p className="text-sm text-slate-400">
                Aún no has generado ningún guion en este navegador.
              </p>
              <p className="text-xs text-slate-500">
                Cuando generes tu primer guion, aparecerá aquí automáticamente.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 cursor-pointer flex-1" onClick={() => onSelectScript(item)}>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      {item.estimatedDuration}s
                    </span>
                    <span className="text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-slate-500">• {item.scenes.length} escenas</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-rose-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    Gancho: "{item.hook}"
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => downloadScriptFile(item)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Descargar archivo .txt"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteScript(item.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectScript(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>Abrir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{history.length} guiones almacenados localmente</span>
            <button
              onClick={onClearHistory}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Borrar todo el historial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
