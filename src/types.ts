export interface ScriptScene {
  sceneNumber: number;
  estimatedDurationSeconds: number;
  narration: string;
  visualDescription: string;
  onScreenText: string;
  soundEffect: string;
}

export interface GeneratedScript {
  id: string;
  createdAt: string;
  topic: string;
  title: string;
  hook: string;
  estimatedDuration: number;
  suggestedMusicMood: string;
  suggestedHashtags: string[];
  scenes: ScriptScene[];
  callToAction: string;
  tipsForCreator: string[];
}
