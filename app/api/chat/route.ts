import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Brain
// PASTE YOUR REAL KEY INSIDE THE QUOTES
const genAI = new GoogleGenerativeAI("AIzaSyB-9ojzKqxi3QZQ8-OeVALzK9IMFPYngr4");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, projectTitle } = body;

    // UPGRADE: Switched from 'gemini-pro' to 'gemini-1.5-flash'
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. Engineer the "System Prompt" (The Personality)
    const systemInstruction = `
      You are an advanced AI interface for a project named "${projectTitle}".
      
      CONTEXT:
      - If the project is "SKYNET", act like a cold, calculating military supercomputer. Use uppercase.
      - If the project is "AETHER BIO", act like a helpful biotech research assistant.
      - If the project is "QUANTUM", act like a mysterious physics engine.
      - For any other project, act like a highly efficient operating system.
      
      CONSTRAINT:
      - Keep responses concise (under 2 sentences).
      - Use technical, sci-fi interface jargon.
      - Do not sound like a standard chatbot. Be the SYSTEM.
    `;

    // 3. Send the transmission
    const result = await model.generateContent(`${systemInstruction}\n\nUSER INPUT: ${message}`);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ data: text });

  } catch (error) {
    console.error("NEURAL FAILURE:", error);
    return NextResponse.json({ 
        data: "CRITICAL ERROR: NEURAL LINK SEVERED. CHECK TERMINAL." 
    }, { status: 500 });
  }
}