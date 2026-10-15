import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Cpu } from 'lucide-react';

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Transparencia y Uso del Modelo de IA
            </h3>
            <p className="text-xs text-slate-400">
              Información clara sobre la generación con IA y nuestro compromiso sin servicios de pago.
            </p>
          </div>
        </div>

        <div className="space-y-4 my-5 text-sm text-slate-300">
          {/* Real AI Generation */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <Cpu className="w-4 h-4 shrink-0" />
              <span>Generación 100% original con Gemini 3.8 Flash</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              AutoShorts AI no utiliza plantillas estáticas ni textos inventados de ejemplo. Cada guion es generado en tiempo real por el modelo oficial <strong>gemini-3.8-flash</strong> de Google a través del SDK seguro en el servidor.
            </p>
          </div>

          {/* No Paid Plans & Quotas */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Sin muros de pago ni suscripciones</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              La aplicación no incluye planes de pago ni cobra por exportar. El uso del modelo está sujeto a las cuotas y límites de peticiones establecidos por Google para la API de Gemini en tu proyecto.
            </p>
          </div>

          {/* Explanation on why no paid voice/video generation in this v1 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>¿Por qué no incluye clonación de voz ni vídeo sintético automático?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Los servicios de generación de avatares o síntesis de vídeo en la nube conllevan altos costes que obligarían a implementar suscripciones de pago. En AutoShorts AI priorizamos que puedas grabar con tu propio teléfono y herramientas de edición accesibles.
            </p>
          </div>

          {/* Recommended Free Tools */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Flujo de trabajo recomendado:</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
              <li>
                <strong>Descarga el guion en .txt:</strong> Guárdalo o léelo en el móvil con el modo teleprompter.
              </li>
              <li>
                <strong>CapCut:</strong> Añade subtítulos automáticos gratuitos basados en el texto en pantalla de cada escena.
              </li>
              <li>
                <strong>Música de tendencia:</strong> Añádela directamente desde la biblioteca oficial de TikTok, Shorts o Reels.
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
        >
          Cerrar ventana
        </button>
      </div>
    </div>
  );
};
