import { GeneratedScript } from '../types';

export function formatScriptAsText(script: GeneratedScript): string {
  const divider = '==================================================';
  const subDivider = '--------------------------------------------------';

  let text = `${divider}\n`;
  text += `AUTOSHORTS AI - GUION PARA VÍDEO VERTICAL\n`;
  text += `Plataformas: YouTube Shorts | TikTok | Instagram Reels\n`;
  text += `${divider}\n\n`;

  text += `📌 TÍTULO RECOMENDADO:\n${script.title}\n\n`;
  text += `⏱️ DURACIÓN ESTIMADA: ${script.estimatedDuration} segundos\n`;
  text += `🎵 MÚSICA DE FONDO: ${script.suggestedMusicMood}\n`;
  text += `🎯 TEMA: ${script.topic}\n\n`;

  text += `${subDivider}\n`;
  text += `🔥 GANCHO INICIAL (0:00 - 0:03 segundos - CRUCIAL PARA RETENCIÓN):\n`;
  text += `"${script.hook}"\n`;
  text += `${subDivider}\n\n`;

  text += `🎬 DESGLOSE DE ESCENAS (${script.scenes.length} ESCENAS):\n\n`;

  script.scenes.forEach((scene) => {
    text += `[ ESCENA ${scene.sceneNumber} - ~${scene.estimatedDurationSeconds}s ]\n`;
    text += `• 🎙️ Narración (lo que dices):\n  "${scene.narration}"\n`;
    text += `• 📹 Visual (lo que grabas / cámara):\n  ${scene.visualDescription}\n`;
    text += `• 📱 Texto en pantalla:\n  [ ${scene.onScreenText} ]\n`;
    text += `• 🔊 Efecto sonoro:\n  ${scene.soundEffect}\n\n`;
  });

  text += `${subDivider}\n`;
  text += `📣 LLAMADA A LA ACCIÓN (FINAL):\n`;
  text += `"${script.callToAction}"\n\n`;

  if (script.tipsForCreator && script.tipsForCreator.length > 0) {
    text += `${subDivider}\n`;
    text += `💡 CONSEJOS DE GRABACIÓN PARA PRINCIPIANTES:\n`;
    script.tipsForCreator.forEach((tip, idx) => {
      text += `${idx + 1}. ${tip}\n`;
    });
    text += `\n`;
  }

  if (script.suggestedHashtags && script.suggestedHashtags.length > 0) {
    text += `${subDivider}\n`;
    text += `🏷️ HASHTAGS RECOMENDADOS:\n`;
    text += `${script.suggestedHashtags.join(' ')}\n\n`;
  }

  text += `${divider}\n`;
  text += `Generado gratis con AutoShorts AI\n`;
  text += `${divider}\n`;

  return text;
}

export function formatNarrationOnly(script: GeneratedScript): string {
  return script.scenes.map((s) => s.narration).join(' ');
}

export function downloadScriptFile(script: GeneratedScript) {
  const content = formatScriptAsText(script);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  // Sanitize filename
  const cleanTitle = script.title
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ]/g, '_')
    .slice(0, 40)
    .replace(/_+/g, '_');

  a.href = url;
  a.download = `guion_autoshorts_${cleanTitle || 'video'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Error al copiar texto:', err);
    return false;
  }
}
