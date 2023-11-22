import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// DID NOT WORK
// Create an OpenAI API client (that's edge friendly!) 
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  // const { title, description, keywords, length, social, tone} = await req.json();
  const { description} = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  /*const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
        {
          role: "system",
          content: `You are an amazing, ${social} media manager who writes amazing and thought provoking posts.`,
        },
        {
          role: "user",
          content: `Write me an interesting and eyecatching ${social} post of length ${length} from a first person narrative about ${description}.
              The title is: ${title} and the keywords are ${keywords}. The post should be SEO friendly and use the ${tone}.`,
        },
      ],
  });*/
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
        {
          role: "system",
          content: `You are an amazing, social media manager who writes amazing and thought provoking posts.`,
        },
        {
          role: "user",
          content: `Write me an interesting and eyecatching social post of length 30 - 50 words from a first person narrative about ${description}.
              Make a new title and The post should be SEO friendly and use the.`,
        },
      ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}