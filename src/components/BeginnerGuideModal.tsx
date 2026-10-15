import React from 'react';
import { X, Smartphone, Sun, Mic, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
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
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Guía para Principiantes: Graba tu Short con Presupuesto 0€
            </h3>
            <p className="text-xs text-slate-400">
              No necesitas cámaras caras ni micrófonos profesionales para triunfar.
            </p>
          </div>
        </div>

        <div className="space-y-4 my-5 text-sm text-slate-300">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-rose-400">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-xs">1</span>
              <span>Limpia la lente de tu teléfono</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-7">
              El 80% de los vídeos borrosos de principiantes ocurren por huellas de dedos en la cámara del móvil. Pasa una camiseta o pañuelo suave antes de grabar.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-amber-400">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">2</span>
              <span>Luz natural frente a una ventana</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-7">
              Colócate mirando hacia una ventana de día. La luz natural de frente ilumina tu rostro mucho mejor que un aro de luz barato. Nunca te pongas de espaldas a la ventana.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-indigo-400">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">3</span>
              <span>Audio claro: Habla cerca y con energía</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-7">
              Mantén el teléfono a un brazo de distancia o usa los auriculares con cable con micrófono integrado. Habla un 15% más alegre y enérgico de lo normal.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">4</span>
              <span>Nunca saludes al inicio (Fórmula del Gancho)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-7">
              No digas "Hola a todos, hoy os traigo un nuevo vídeo...". Empieza directamente con el gancho generado por AutoShorts AI ("¿Sabías que el 90% de la gente comete este error?").
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-purple-400">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">5</span>
              <span>Edición gratuita con CapCut</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-7">
              Descarga la app gratuita CapCut en tu móvil o PC. Usa la función gratuita «Subtítulos automáticos», corta los silencios muertos y exporta en 1080p sin pagar nada.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
        >
          Entendido, ¡vamos a crear!
        </button>
      </div>
    </div>
  );
};
