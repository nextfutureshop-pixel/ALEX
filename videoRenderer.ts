import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ScriptScene {
  sceneNumber: number;
  estimatedDurationSeconds: number;
  narration: string;
  visualDescription: string;
  onScreenText: string;
  soundEffect: string;
}

export interface VideoScriptData {
  title: string;
  hook: string;
  estimatedDuration: number;
  suggestedMusicMood?: string;
  suggestedHashtags?: string[];
  scenes: ScriptScene[];
  callToAction?: string;
  tipsForCreator?: string[];
}

const VIDEOS_STORAGE_DIR = path.resolve('/tmp/autoshorts_rendered_videos');
if (!fs.existsSync(VIDEOS_STORAGE_DIR)) {
  fs.mkdirSync(VIDEOS_STORAGE_DIR, { recursive: true });
}

export function getRenderedVideosDir(): string {
  return VIDEOS_STORAGE_DIR;
}

function escapeXml(unsafe: string): string {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxChars = 28): string[] {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    if ((current + ' ' + w).trim().length <= maxChars) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

export async function renderScriptToMp4(script: VideoScriptData): Promise<{
  filename: string;
  filePath: string;
  durationSeconds: number;
}> {
  const timestamp = Date.now();
  const workDir = path.resolve(`/tmp/render_job_${timestamp}`);
  if (fs.existsSync(workDir)) {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
  fs.mkdirSync(workDir, { recursive: true });

  const cleanTitle = (script.title || 'video')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 30)
    .replace(/_+/g, '_');

  const outputFilename = `autoshorts_${cleanTitle}_${timestamp}.mp4`;
  const finalOutputPath = path.join(VIDEOS_STORAGE_DIR, outputFilename);

  const scenes = script.scenes && script.scenes.length > 0 ? script.scenes : [
    {
      sceneNumber: 1,
      estimatedDurationSeconds: 5,
      narration: script.hook || '¡Descubre este secreto increíble!',
      visualDescription: 'Plano corto a cámara con energía.',
      onScreenText: '¡MIRA ESTO!',
      soundEffect: 'Whoosh dinámico',
    },
  ];

  const totalScenes = scenes.length;
  const intermediateVideos: string[] = [];
  let totalCalculatedDuration = 0;

  try {
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const duration = Math.max(2, Math.min(15, Number(scene.estimatedDurationSeconds) || 4));
      totalCalculatedDuration += duration;

      const textLines = wrapText(scene.onScreenText || 'TEXTO CLAVE', 18);
      const narrLines = wrapText(scene.narration || '', 34);
      const visualLines = wrapText(scene.visualDescription || '', 40);

      // Gradient selection per scene
      const gradients = [
        { c1: '#4c0519', c2: '#0b0f19', accent: '#f43f5e' },
        { c1: '#1e1b4b', c2: '#090d16', accent: '#6366f1' },
        { c1: '#14532d', c2: '#052e16', accent: '#10b981' },
        { c1: '#581c87', c2: '#0b0f19', accent: '#a855f7' },
        { c1: '#7c2d12', c2: '#090d16', accent: '#f97316' },
      ];
      const g = gradients[i % gradients.length];

      const textTspans = textLines
        .slice(0, 3)
        .map((l, idx) => `<tspan x="360" dy="${idx === 0 ? 0 : 54}">${escapeXml(l)}</tspan>`)
        .join('');

      const narrTspans = narrLines
        .slice(0, 4)
        .map((l, idx) => `<tspan x="360" dy="${idx === 0 ? 0 : 36}">${escapeXml(l)}</tspan>`)
        .join('');

      const visualTspans = visualLines
        .slice(0, 3)
        .map((l, idx) => `<tspan x="360" dy="${idx === 0 ? 0 : 26}">${escapeXml(l)}</tspan>`)
        .join('');

      const progressWidth = Math.round((640 * (i + 1)) / totalScenes);

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="${g.c1}"/>
      <stop offset="100%" stop-color="${g.c2}"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="720" height="1280" fill="url(#bgGrad)"/>
  
  <!-- Subtle ambient decorative glow circles -->
  <circle cx="100" cy="200" r="180" fill="${g.accent}" fill-opacity="0.1" filter="url(#shadow)"/>
  <circle cx="620" cy="900" r="220" fill="#facc15" fill-opacity="0.08" filter="url(#shadow)"/>

  <!-- Top Status Header -->
  <rect x="40" y="45" width="220" height="42" rx="21" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1.5"/>
  <circle cx="65" cy="66" r="6" fill="#f43f5e"/>
  <text x="155" y="72" font-family="DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">AutoShorts AI</text>

  <rect x="480" y="45" width="200" height="42" rx="21" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1.5"/>
  <text x="580" y="72" font-family="DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="bold" fill="#cbd5e1" text-anchor="middle">ESCENA ${scene.sceneNumber} / ${totalScenes}</text>

  <!-- Top Progress Bar -->
  <rect x="40" y="105" width="640" height="8" rx="4" fill="#1e293b"/>
  <rect x="40" y="105" width="${progressWidth}" height="8" rx="4" fill="${g.accent}"/>

  <!-- Visual Camera Cue Card -->
  <rect x="40" y="135" width="640" height="145" rx="20" fill="#030712" fill-opacity="0.65" stroke="#334155" stroke-width="2"/>
  <text x="70" y="175" font-family="DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="bold" fill="#f59e0b">📹 TOMA VISUAL (CÁMARA):</text>
  <text x="360" y="210" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#e2e8f0" text-anchor="middle">
    ${visualTspans}
  </text>

  <!-- Center Stage: Viral On-Screen Text (High Contrast TikTok/CapCut Style) -->
  <rect x="50" y="500" width="620" height="230" rx="28" fill="#000000" fill-opacity="0.82" stroke="#facc15" stroke-width="5" filter="url(#shadow)"/>
  <text x="360" y="590" font-family="DejaVu Sans, Arial, sans-serif" font-size="44" font-weight="900" fill="#facc15" text-anchor="middle">
    ${textTspans}
  </text>

  <!-- Sound effect pill -->
  ${
    scene.soundEffect
      ? `<rect x="200" y="755" width="320" height="38" rx="19" fill="#4338ca" fill-opacity="0.6" stroke="#818cf8" stroke-width="1.5"/>
         <text x="360" y="780" font-family="DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="bold" fill="#e0e7ff" text-anchor="middle">🔊 ${escapeXml(
           scene.soundEffect
         )}</text>`
      : ''
  }

  <!-- Bottom Narration Card -->
  <rect x="40" y="860" width="640" height="280" rx="26" fill="#030712" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2" filter="url(#shadow)"/>
  <text x="70" y="905" font-family="DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="bold" fill="#f43f5e">🎙️ LO QUE DICES (NARRACIÓN):</text>
  <text x="360" y="960" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
    ${narrTspans}
  </text>

  <!-- Footer music mood info -->
  <rect x="40" y="1170" width="640" height="45" rx="12" fill="#0f172a" fill-opacity="0.6"/>
  <text x="360" y="1198" font-family="DejaVu Sans, Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">🎵 ${escapeXml(
    script.suggestedMusicMood || 'Audio dinámico vertical 9:16'
  )}</text>
</svg>`;

      const svgPath = path.join(workDir, `scene_${i}.svg`);
      const mp4Path = path.join(workDir, `scene_${i}.mp4`);

      fs.writeFileSync(svgPath, svgContent, 'utf8');

      // Convert SVG to MP4 clip with x264 at 25 fps, optimized with framerate 1 for ultra-fast render
      const renderCmd = `ffmpeg -loop 1 -framerate 1 -t ${duration} -i "${svgPath}" -c:v libx264 -r 25 -pix_fmt yuv420p -preset ultrafast "${mp4Path}" -y`;
      execSync(renderCmd, { stdio: 'pipe' });

      intermediateVideos.push(mp4Path);
    }

    // Write concat file
    const concatFilePath = path.join(workDir, 'concat_list.txt');
    const concatLines = intermediateVideos.map((f) => `file '${f}'`).join('\n');
    fs.writeFileSync(concatFilePath, concatLines, 'utf8');

    // Final concatenation with AAC stereo audio track
    const concatCmd = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" -f lavfi -i "anullsrc=r=44100:cl=stereo" -c:v copy -c:a aac -shortest "${finalOutputPath}" -y`;
    execSync(concatCmd, { stdio: 'pipe' });

    return {
      filename: outputFilename,
      filePath: finalOutputPath,
      durationSeconds: totalCalculatedDuration,
    };
  } finally {
    // Clean up temporary SVG and intermediate files
    try {
      if (fs.existsSync(workDir)) {
        fs.rmSync(workDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      console.warn('Could not clean up workDir:', cleanupErr);
    }
  }
}
