interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface OllamaGenerateRequest {
  model: string;
  system?: string;
  prompt: string;
  stream: boolean;
}

export interface AskComparePayload {
  textOne: string;
  textTwo: string;
  systemMessage?: string;
  model?: string;
}

export interface AskCompareOptions {
  systemMessage?: string;
  model?: string;
}

export interface AskAiPayload {
  systemMessage?: string;
  prompt: string;
  model?: string;
}

export class OllamaRepo {
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
    this.defaultModel = process.env.OLLAMA_MODEL ?? "llama3.2";
  }

  async askAi(payload: AskAiPayload): Promise<string> {
    return this.generateResponse(payload);
  }

  async askCompare(
    textOne: string,
    textTwo: string,
    options?: AskCompareOptions,
  ): Promise<string> {
    const prompt = [
      "Analyze and compare the following two texts.",
      "",
      "Text 1:",
      textOne,
      "",
      "Text 2:",
      textTwo,
      "",
      "Return similarities, differences, and a short conclusion.",
    ].join("\n");

    const payload: AskAiPayload = {
      prompt,
    };

    if (options?.systemMessage) {
      payload.systemMessage = options.systemMessage;
    }

    if (options?.model) {
      payload.model = options.model;
    }

    return this.generateResponse(payload);
  }

  private async generateResponse(payload: {
    systemMessage?: string;
    prompt: string;
    model?: string;
  }): Promise<string> {
    const body: OllamaGenerateRequest = {
      model: payload.model ?? this.defaultModel,
      prompt: payload.prompt,
      stream: false,
    };

    if (payload.systemMessage) {
      body.system = payload.systemMessage;
    }

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama request failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as OllamaGenerateResponse;
    return data.response;
  }
}
