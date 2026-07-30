export const QUESTIONS = [
  {
    "title": "Investing Check",
    "screenKey": "setup",
    "next": "screen2.html",
    "min": 1,
    "max": 2,
    "type": "normal",
    "options": [
      {
        "id": "not_started",
        "label": "I have not invested yet",
        "helper": "I am still trying to understand where to begin",
        "scores": {
          "BFO": 2,
          "ES": 3
        }
      },
      {
        "id": "simple_start",
        "label": "I mainly use a retirement account, automated service, or broad funds",
        "helper": "I have a starting point, but I do not always understand why it fits",
        "scores": {
          "GD": 3,
          "BFO": 2
        }
      },
      {
        "id": "etfs_stocks",
        "label": "I own broad funds plus a few individual investments",
        "helper": "I am not always sure how the pieces should work together",
        "scores": {
          "FT": 2,
          "BFO": 1
        }
      },
      {
        "id": "collected",
        "label": "I have added different ideas over time",
        "helper": "I can see what I own, but not whether every part still belongs",
        "scores": {
          "GA": 2,
          "FT": 1
        }
      },
      {
        "id": "established",
        "label": "I already follow a deliberate investing approach",
        "helper": "I want a clearer way to review and improve it without unnecessary changes",
        "scores": {
          "FT": 3,
          "BFO": 1
        }
      }
    ],
    "step": 1,
    "heading": "How would you describe where you are today?",
    "note": "Choose up to two.",
    "footerNote": "Choose up to two.",
    "documentTitle": "AaronBux - Investing Check 1"
  },
  {
    "title": "Investing Check",
    "screenKey": "transition",
    "next": "screen3.html",
    "min": 1,
    "max": 2,
    "type": "normal",
    "options": [
      {
        "id": "what_to_do",
        "label": "I am not sure what to do next",
        "helper": "I want a clear starting point or next step",
        "scores": {
          "ES": 3,
          "BFO": 1
        }
      },
      {
        "id": "doing_right",
        "label": "I wonder whether I am doing this right",
        "helper": "My accounts show results, but not whether my reasoning is sound",
        "scores": {
          "BFO": 3,
          "GD": 1
        }
      },
      {
        "id": "missing",
        "label": "I worry that I may be missing something important",
        "helper": "More choices make it harder to know what deserves attention",
        "scores": {
          "FT": 2,
          "GA": 1
        }
      },
      {
        "id": "change",
        "label": "I cannot tell whether something actually needs to change",
        "helper": "I can see movement, but I do not have a clear action threshold",
        "scores": {
          "BFO": 3,
          "GD": 1
        }
      },
      {
        "id": "compare",
        "label": "I am comparing several reasonable choices",
        "helper": "I need a consistent way to understand the tradeoffs",
        "scores": {
          "FT": 3
        }
      }
    ],
    "step": 2,
    "heading": "What most often sends you looking for more information?",
    "note": "Choose up to two.",
    "footerNote": "Choose up to two.",
    "documentTitle": "AaronBux - Investing Check 2"
  },
  {
    "title": "Investing Check",
    "screenKey": "decisionStyle",
    "next": "screen4.html",
    "min": 1,
    "max": 2,
    "type": "normal",
    "options": [
      {
        "id": "start",
        "label": "Getting started without making a mistake",
        "helper": "I need a safe, understandable first decision",
        "scores": {
          "ES": 3,
          "BFO": 1
        }
      },
      {
        "id": "pick",
        "label": "Choosing between funds, stocks, or other options",
        "helper": "I can find choices, but not always a useful basis for choosing",
        "scores": {
          "FT": 2,
          "GD": 1
        }
      },
      {
        "id": "fit",
        "label": "Deciding whether a new idea fits what I already have",
        "helper": "A good idea on its own may not improve my overall setup",
        "scores": {
          "GA": 2,
          "FT": 1
        }
      },
      {
        "id": "sell",
        "label": "Knowing whether to sell, reduce, or leave something alone",
        "helper": "The hardest part is knowing when the original reason no longer holds",
        "scores": {
          "BFO": 2,
          "TO": 1
        }
      },
      {
        "id": "enough",
        "label": "Knowing when I have researched enough",
        "helper": "More information does not always create more confidence",
        "scores": {
          "FT": 3,
          "BFO": 1
        }
      }
    ],
    "step": 3,
    "heading": "Which decision feels hardest to make confidently?",
    "note": "Choose up to two.",
    "footerNote": "Choose up to two.",
    "documentTitle": "AaronBux - Investing Check 3"
  },
  {
    "title": "Investing Check",
    "screenKey": "marketPsychology",
    "next": "screen5.html",
    "min": 1,
    "max": 1,
    "type": "normal",
    "options": [
      {
        "id": "balance",
        "label": "A noticeable change in my account balance",
        "helper": "I notice the outcome before I know whether the cause matters",
        "scores": {
          "BFO": 2,
          "ES": 1
        }
      },
      {
        "id": "market",
        "label": "A large market move or alarming headline",
        "helper": "I need help separating a meaningful change from ordinary noise",
        "scores": {
          "GD": 2,
          "BFO": 1
        }
      },
      {
        "id": "holding",
        "label": "News or price movement around something I own",
        "helper": "I am not always sure what deserves a closer look",
        "scores": {
          "FT": 2,
          "TO": 1
        }
      },
      {
        "id": "idea",
        "label": "A new investment idea I see online or hear about",
        "helper": "The idea gets attention before I know whether it has a role",
        "scores": {
          "GA": 2,
          "TO": 2
        }
      },
      {
        "id": "rarely",
        "label": "I do not check very often",
        "helper": "I need to know what is important enough to bring me back",
        "scores": {
          "ES": 2,
          "GD": 2
        }
      }
    ],
    "step": 4,
    "heading": "What usually gets your attention first?",
    "note": "Choose one.",
    "footerNote": "Choose one.",
    "documentTitle": "AaronBux - Investing Check 4"
  },
  {
    "title": "Investing Check",
    "screenKey": "evolution",
    "next": "screen6.html",
    "min": 1,
    "max": 1,
    "type": "normal",
    "options": [
      {
        "id": "understand",
        "label": "Understanding what I own and why",
        "helper": "Seeing holdings is easier than understanding the job each one does",
        "scores": {
          "ES": 3,
          "BFO": 1
        }
      },
      {
        "id": "monitor",
        "label": "Knowing what I should monitor",
        "helper": "Most tools show everything without telling me what matters",
        "scores": {
          "GD": 2,
          "BFO": 2
        }
      },
      {
        "id": "frequency",
        "label": "Knowing how often I should check or make decisions",
        "helper": "I do not want to ignore important changes or overreact to normal ones",
        "scores": {
          "BFO": 3,
          "GD": 1
        }
      },
      {
        "id": "effort",
        "label": "Knowing which choices deserve more research and effort",
        "helper": "Small decisions can consume as much time as important ones",
        "scores": {
          "FT": 3
        }
      },
      {
        "id": "experiment",
        "label": "Trying new ideas without disrupting everything else",
        "helper": "I need clear limits for learning, testing, and changing direction",
        "scores": {
          "GA": 3,
          "TO": 1
        }
      }
    ],
    "step": 5,
    "heading": "What feels least clear in the way you invest?",
    "note": "Choose one.",
    "footerNote": "Choose one.",
    "documentTitle": "AaronBux - Investing Check 5"
  },
  {
    "title": "Investing Check",
    "screenKey": "tradeoff",
    "next": "screen7.html",
    "min": 1,
    "max": 1,
    "type": "normal",
    "options": [
      {
        "id": "tell_me",
        "label": "I want clear guidance and very few decisions",
        "helper": "I would rather follow an understandable process than compare everything myself",
        "scores": {
          "ES": 3,
          "GD": 1
        }
      },
      {
        "id": "occasional",
        "label": "I want to check occasionally and act only when needed",
        "helper": "Most of the time, I want to know that leaving things alone is reasonable",
        "scores": {
          "GD": 3,
          "BFO": 1
        }
      },
      {
        "id": "periodic",
        "label": "I am comfortable reviewing choices on a schedule",
        "helper": "I want a repeatable process instead of reacting to events",
        "scores": {
          "BFO": 2,
          "FT": 2
        }
      },
      {
        "id": "explore",
        "label": "I want room to research selected ideas",
        "helper": "I want the extra effort contained to a limited part of my investing",
        "scores": {
          "GA": 3,
          "FT": 1
        }
      },
      {
        "id": "active",
        "label": "I enjoy following investments and making more frequent decisions",
        "helper": "I still want clear boundaries so activity does not replace a long-term plan",
        "scores": {
          "TO": 3,
          "GA": 1
        }
      }
    ],
    "step": 6,
    "heading": "How involved do you realistically want to be?",
    "note": "Choose one.",
    "footerNote": "Choose one.",
    "documentTitle": "AaronBux - Investing Check 6"
  },
  {
    "title": "Investing Check",
    "screenKey": "age",
    "next": "screen8.html",
    "min": 1,
    "max": 1,
    "type": "normal",
    "options": [
      {
        "id": "under3",
        "label": "Within the next 3 years",
        "helper": "Near-term needs make stability and access especially important",
        "scores": {
          "IP": 3
        }
      },
      {
        "id": "3to5",
        "label": "About 3–5 years from now",
        "helper": "Some parts may need to be dependable while others remain long term",
        "scores": {
          "IP": 2,
          "BFO": 1
        }
      },
      {
        "id": "5to10",
        "label": "About 5–10 years from now",
        "helper": "The review process needs to balance progress with flexibility",
        "scores": {
          "BFO": 2,
          "GD": 1
        }
      },
      {
        "id": "10plus",
        "label": "More than 10 years from now",
        "helper": "Short-term movement may deserve less attention than consistency",
        "scores": {
          "GD": 2,
          "FT": 1
        }
      },
      {
        "id": "multiple",
        "label": "I have several goals with different timelines",
        "helper": "Different money may need different levels of oversight",
        "scores": {
          "BFO": 3
        }
      },
      {
        "id": "unsure",
        "label": "I am not sure yet",
        "helper": "Clarifying the purpose may be more important than choosing another investment",
        "scores": {
          "ES": 3,
          "BFO": 1
        }
      }
    ],
    "step": 7,
    "heading": "When might you need a meaningful part of this money?",
    "note": "Choose one.",
    "footerNote": "Choose one.",
    "documentTitle": "AaronBux - Investing Check 7"
  },
  {
    "title": "Investing Check",
    "screenKey": "goals",
    "next": "recommendation.html",
    "min": 1,
    "max": 2,
    "type": "normal",
    "options": [
      {
        "id": "start_confident",
        "label": "Knowing how to start without feeling lost",
        "helper": "I want the first step and the reason behind it to be clear",
        "scores": {
          "ES": 3,
          "BFO": 1
        }
      },
      {
        "id": "understand",
        "label": "Understanding how my investments work together",
        "helper": "I want to see the purpose of each part, not only its performance",
        "scores": {
          "BFO": 3
        }
      },
      {
        "id": "monitor",
        "label": "Knowing what deserves my attention",
        "helper": "I want fewer signals, with clearer reasons to care",
        "scores": {
          "GD": 2,
          "BFO": 2
        }
      },
      {
        "id": "act",
        "label": "Knowing when to act and when to leave things alone",
        "helper": "I want a clear threshold between monitoring and changing",
        "scores": {
          "BFO": 3,
          "FT": 1
        }
      },
      {
        "id": "choose",
        "label": "Choosing investments with a repeatable framework",
        "helper": "I want comparisons to lead to a decision, not more tabs",
        "scores": {
          "FT": 3
        }
      },
      {
        "id": "explore",
        "label": "Exploring new ideas without losing the long-term direction",
        "helper": "I want experimentation to have a purpose, limit, and review point",
        "scores": {
          "GA": 3,
          "TO": 1
        }
      },
      {
        "id": "income",
        "label": "Creating dependable income or protecting money I will need",
        "helper": "I want monitoring tied to cash flow and future needs",
        "scores": {
          "IP": 3
        }
      }
    ],
    "step": 8,
    "heading": "What would make investing feel meaningfully easier?",
    "note": "Choose up to two.",
    "footerNote": "Choose up to two.",
    "documentTitle": "AaronBux - Investing Check 8"
  }
];
