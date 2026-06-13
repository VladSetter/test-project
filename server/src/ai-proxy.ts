import { Router } from "express";
import { OllamaRepo } from "./ollama.repo";

const aiProxyRouter = Router();
const ollamaRepo = new OllamaRepo();

aiProxyRouter.post("/ask-ai", async (req, res) => {
  const systemMessage =
    typeof req.body?.systemMessage === "string" ? req.body.systemMessage.trim() : undefined;
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  const model = typeof req.body?.model === "string" ? req.body.model.trim() : undefined;

  if (!prompt) {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  try {
    const answer = await ollamaRepo.askAi({ systemMessage, prompt, model });
    res.status(200).json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Ollama error";
    res.status(502).json({ error: message });
  }
});

aiProxyRouter.post("/ask-compare", async (req, res) => {
  const systemMessage =
    typeof req.body?.systemMessage === "string" ? req.body.systemMessage.trim() : undefined;
  const textOne = typeof req.body?.textOne === "string" ? req.body.textOne.trim() : "";
  const textTwo = typeof req.body?.textTwo === "string" ? req.body.textTwo.trim() : "";
  const model = typeof req.body?.model === "string" ? req.body.model.trim() : undefined;

  if (!textOne || !textTwo) {
    res.status(400).json({ error: "textOne and textTwo are required" });
    return;
  }

  try {
    const answer = await ollamaRepo.askCompare(textOne, textTwo, { systemMessage, model });
    res.status(200).json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Ollama error";
    res.status(502).json({ error: message });
  }
});

export default aiProxyRouter;
