import { describe, expect, it } from "vitest";
import type { Agent } from "@opencode-ai/sdk/v2";
import { flattenOpenCodeModels, type OpenCodeInventory } from "./opencodeRuntime";

describe("flattenOpenCodeModels", () => {
  it("includes visible non-primary agents in capabilities", () => {
    const inventory = {
      providerList: {
        connected: ["openai"],
        all: [
          {
            id: "openai",
            name: "OpenAI",
            models: {
              "gpt-5": {
                id: "gpt-5",
                name: "GPT-5",
                variants: {
                  low: {},
                  medium: {},
                },
              },
            },
          },
        ],
      },
      agents: [
        { name: "build", hidden: false, mode: "primary" },
        { name: "plan", hidden: false, mode: "secondary" },
        { name: "secret", hidden: true, mode: "all" },
      ] as unknown as ReadonlyArray<Agent>,
    } as unknown as OpenCodeInventory;

    const models = flattenOpenCodeModels(inventory);
    const caps = models[0]?.capabilities;

    expect(models[0]?.slug).toBe("openai/gpt-5");
    expect(caps?.agentOptions?.map((option) => option.value)).toEqual(["build", "plan"]);
    expect(caps?.agentOptions?.find((option) => option.value === "build")?.isDefault).toBe(true);
  });
});
