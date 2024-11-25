import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Set to true if you are running the OpenAI API locally / using Text Generation Web UI
const usingLocalOpenAiApi = false;

const openai = new OpenAI({
  baseURL: usingLocalOpenAiApi ? `http://127.0.0.1:5000/v1` : process.env.OPENAI_API_URL,
  apiKey: usingLocalOpenAiApi ? "" : process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a professional storyteller who has been hired to write a short story based on the provided characters. The story should be captivating, imaginative, and thought-provoking. It should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. The story should be unique and memorable, with compelling characters and unexpected plot twists. After the story, write a paragraph about the summary of each character's role in the story.`,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
