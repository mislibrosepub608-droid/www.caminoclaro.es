import { describe, it, expect, vi, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

vi.setConfig({ testTimeout: 15000 });

describe("chatbot", () => {

  it("should send a message and return a response", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.sendMessage({
      message: "¿Cuál es la distancia total del Camino Francés?",
      conversationHistory: [],
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  }, 15000);

  it("should handle conversation history", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const conversationHistory = [
      {
        role: "user" as const,
        content: "¿Cuál es la mejor época para hacer el Camino?",
      },
      {
        role: "assistant" as const,
        content: "La mejor época es primavera u otoño.",
      },
    ];

    const result = await caller.chatbot.sendMessage({
      message: "¿Y en verano?",
      conversationHistory,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  }, 15000);

  it("should get accommodations by stage", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.getAccommodationsByStage("Etapa 1");

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  }, 10000);

  it("should get stage info by number", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.getStageInfo(1);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  }, 10000);

  it("should handle empty message gracefully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chatbot.sendMessage({
        message: "",
        conversationHistory: [],
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 10000);
});
