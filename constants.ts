// Using Gemini 1.5 Flash for its massive context window (1M tokens) and speed.
// This replaces the need for complex local chunking (Whisper) for files under ~9 hours.
export const TRANSCRIPTION_MODEL = 'gemini-2.5-flash';

// Fallback prompt for the AI
export const SYSTEM_INSTRUCTION = `
You are a professional transcription engine. 
Your task is to transcribe the provided audio/video file verbatim.
- Identify speakers as Speaker 1, Speaker 2, etc., if distinguishable.
- Add timestamps at the start of every paragraph or speaker change in the format [MM:SS].
- Do not summarize. Transcribe everything.
- If there is silence or music, indicate it with [Silence] or [Music].
- Output the result in clean Markdown format.
`;

export const MAX_FILE_SIZE_MB = 100; // Client-side limitation for this demo (Base64 limits)
