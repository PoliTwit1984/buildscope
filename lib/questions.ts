export type QuestionType = "text" | "textarea" | "single" | "multi";

export type Question = {
  id: string;
  step: number;
  type: QuestionType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  maxLength?: number;
};

export const QUESTIONS: Question[] = [
  {
    id: "pain",
    step: 1,
    type: "textarea",
    title: "What repeat workflow is eating your time?",
    subtitle:
      "One or two sentences. Be specific. \"Manually summarizing 30 Zendesk tickets every Friday for the leadership update\" is great. \"I want an AI assistant\" is not.",
    placeholder:
      "Every Monday I read through ~25 customer feedback emails and write a summary for the team...",
    required: true,
    maxLength: 500,
  },
  {
    id: "role",
    step: 2,
    type: "single",
    title: "Who is this for?",
    subtitle: "Pick the primary user. You can add others later.",
    options: [
      "Just me",
      "My team",
      "Leadership / executives",
      "Sales",
      "Customer Support",
      "Customer Success",
      "Operations",
      "Engineering / Product",
      "Customers (external)",
    ],
    required: true,
  },
  {
    id: "trigger",
    step: 3,
    type: "single",
    title: "When does this workflow happen?",
    subtitle: "What kicks it off?",
    options: [
      "On a schedule (every Monday, every morning, etc.)",
      "When a new item arrives (ticket, email, lead, etc.)",
      "Before a recurring meeting",
      "When a customer or user takes an action",
      "On demand (I run it when I need it)",
      "Continuously / always-on",
    ],
    required: true,
  },
  {
    id: "inputs",
    step: 4,
    type: "multi",
    title: "What does this workflow need to read?",
    subtitle: "Pick anything that applies. We'll figure out integrations later.",
    options: [
      "CSV or spreadsheet",
      "Google Doc / Notion page",
      "Email thread",
      "Slack / Teams messages",
      "CRM notes (Salesforce, HubSpot, etc.)",
      "Support tickets (Zendesk, Intercom, etc.)",
      "Call transcript or meeting recording",
      "PDF or document upload",
      "Web page / URL",
      "Database query",
      "Custom text I paste in",
    ],
    required: true,
  },
  {
    id: "output",
    step: 5,
    type: "multi",
    title: "What should it produce?",
    subtitle: "What does success look like in concrete terms?",
    options: [
      "Summary or briefing",
      "Draft email or message",
      "Action list / next steps",
      "Risk score or priority ranking",
      "Structured report (with sections)",
      "Tagged / categorized data",
      "Recommendation or decision support",
      "Prioritized queue",
      "Slide-ready talking points",
    ],
    required: true,
  },
  {
    id: "checkpoint",
    step: 6,
    type: "single",
    title: "Where should a human approve or edit?",
    subtitle:
      "AI tools that need oversight should ask for it explicitly. Where's the right gate?",
    options: [
      "Before anything goes out — I review every result",
      "Only flagged / low-confidence items need review",
      "After it acts — I see what happened and can correct",
      "Fully autonomous — I just want it to run",
    ],
    required: true,
  },
  {
    id: "success",
    step: 7,
    type: "textarea",
    title: "What would make v1 useful?",
    subtitle:
      "If you used this tomorrow, what would have to be true for you to keep using it?",
    placeholder:
      "Saves me 2+ hours per week. Catches at least 80% of the patterns I'd catch manually. Output is good enough I only edit lightly...",
    required: true,
    maxLength: 400,
  },
  {
    id: "context",
    step: 8,
    type: "textarea",
    title: "Anything else worth knowing?",
    subtitle:
      "Tools you already use, constraints, deal-breakers, sensitive data, integrations available. Optional but improves the spec.",
    placeholder:
      "We're on Google Workspace. No Slack. Customer data is sensitive — can't leave our infra. I have read access to Zendesk via API...",
    required: false,
    maxLength: 500,
  },
];

export type Answers = Record<string, string | string[]>;
