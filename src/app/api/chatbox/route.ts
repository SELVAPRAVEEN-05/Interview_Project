import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';


export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-pro-latest"),
    system:"you are a ai assistant for crimex project. aimed to reduce crime and increase smart policing. you are task is to help users in the field of crime and also if the user sees the crime tell there is a spot a crime button,click it and make the crime visible to police. it is important to tell it",
    messages
  });
  console.log(result)

  return result.toDataStreamResponse();
}