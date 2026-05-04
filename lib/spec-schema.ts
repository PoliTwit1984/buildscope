import { z } from "zod";

export const SpecSchema = z.object({
  toolName: z.string(),
  problemStatement: z.string(),
  targetUser: z.string(),
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  workflowSteps: z.array(z.string()),
  aiBehavior: z.string(),
  humanCheckpoints: z.array(z.string()),
  firstUglyVersion: z.string(),
  successCriteria: z.array(z.string()),
  techPath: z.object({
    stack: z.array(z.string()),
    rationale: z.string(),
  }),
  uiBrief: z.object({
    layout: z.string(),
    keyScreens: z.array(z.string()),
    copyPastePrompt: z.string(),
  }),
  sprintFit: z.object({
    score: z.number().min(0).max(100),
    reasons: z.array(z.string()),
    risks: z.array(z.string()),
  }),
});

export type Spec = z.infer<typeof SpecSchema>;
