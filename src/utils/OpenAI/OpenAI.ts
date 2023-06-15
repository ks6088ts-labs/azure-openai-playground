import { OpenAIChatMessage, OpenAIConfig } from "./OpenAI.types";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

// Enabled by default. Stream option is disabled only when AZURE_OPENAI_API_STREAM_ENABLED is set to `false`.
const isStreamEnabled = () => {
  return process.env.AZURE_OPENAI_API_STREAM_ENABLED == "false" ? false : true;
};

export const defaultConfig = {
  model: "gpt-3.5-turbo",
  temperature: 0.5,
  max_tokens: 2048,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stream: isStreamEnabled(),
};

export type OpenAIRequest = {
  messages: OpenAIChatMessage[];
} & OpenAIConfig;

const getUrl = () => {
  if (process.env.AZURE_OPENAI_API_URL == undefined) {
    return `https://${process.env.AZURE_OPENAI_NAME}.openai.azure.com/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;
  }
  return process.env.AZURE_OPENAI_API_URL || "";
};

export const getOpenAICompletion = async (
  token: string,
  payload: OpenAIRequest
) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const url = getUrl();

  const response = await fetch(url, {
    headers: {
      "api-key": process.env.AZURE_OPENAI_API_KEY!,
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Check for errors
  if (!response.ok) {
    throw new Error(await response.text());
  }

  let counter = 0;
  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const finishReason = json.choices[0].finish_reason || "";
            if (finishReason === "stop") {
              controller.close();
              return;
            }
            const text = json.choices[0].delta?.content || "";
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      if (isStreamEnabled()) {
        const parser = createParser(onParse);
        for await (const chunk of response.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      } else {
        try {
          const jsonData = (await response.json()) as any;
          const text = jsonData.choices[0].message?.content;
          const usage = jsonData.usage;
          const systemMessage =
            "[total tokens:" + String(usage.total_tokens) + "]";
          const queue = encoder.encode(text + "\n" + systemMessage);
          controller.enqueue(queue);
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    },
  });

  return stream;
};
