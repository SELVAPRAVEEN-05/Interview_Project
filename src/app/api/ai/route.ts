//// filepath: e:\io\interviewio\src\app\api\ai\route.ts
import { GoogleGenAI }  from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Missing "text" in body' }, { status: 400 });
    }

    const apiKey = "AIzaSyDrtrsSvG6T78vK9lAaBIKh6w7OQdetLE8";
    if (!apiKey) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY not set' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const resp = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    console.log('TTS Response:', resp);
    const b64 = resp.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!b64) {
      throw new Error('No audio returned from API');
    }

    // Return a data-URL so the client can just set <audio src=...>
    return NextResponse.json({
      url: `data:audio/wav;base64,${b64}`,
    });
  } catch (err: any) {
    console.error('TTS Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}