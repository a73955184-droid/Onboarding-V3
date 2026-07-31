<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>AaronBux - Your Investing System</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">

  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin
  >

  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  >

  <link rel="stylesheet" href="styles.css" />

  <style>
    .system-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .system-card {
      padding: 21px;
      border: 1px solid var(--border, #dfe7ec);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.72);
    }

    .system-card h2 {
      margin: 9px 0;
      font-size: 1.12rem;
    }

    .system-card p {
      line-height: 1.5;
      color: var(--muted, #52636e);
    }

    .metric {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 11px 0;
      border-top: 1px solid var(--border, #dfe7ec);
    }

    .metric:first-of-type {
      border-top: 0;
    }

    .metric strong {
      text-align: right;
    }

    .evidence {
      margin-top: 13px;
      padding-top: 13px;
      border-top: 1px solid var(--border, #dfe7ec);
      font-size: 0.86rem;
      line-height: 1.45;
      color: var(--muted, #52636e);
    }

    .component-list {
      display: grid;
      gap: 12px;
    }

    .component {
      padding: 15px;
      border-radius: 14px;
      background: rgba(237, 246, 248, 0.8);
    }

    .component strong {
      display: block;
      margin-bottom: 4px;
    }

    .component span {
      line-height: 1.45;
      color: var(--muted, #52636e);
    }

    @media (max-width: 860px) {
      .system-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>
  <div class="app-shell">

    <header class="topbar">
      <div class="topbar-inner">

        <button
          class="btn btn-secondary"
          onclick="history.back()"
        >
          Profile
        </button>

        <div style="text-align: center">
          <div class="brand">AaronBux</div>
          <div class="step-label">Your investing system</div>
        </div>

        <button
          class="btn btn-secondary"
          onclick="location.href='index.html'"
        >
          Restart
        </button>

      </div>

      <div class="progress-track">
        <div
          class="progress-fill"
          style="width: 100%"
        ></div>
      </div>
    </header>

    <main class="main">

      <div
        id="missingState"
        class="card panel"
        style="display: none"
      >
        <h2>We could not find your answers.</h2>
      </div>

      <section
        id="result"
        style="display: none"
      >

        <div class="card panel result-hero">
          <span class="pill">Your best-fit system</span>

          <h1 id="systemName"></h1>

          <p
            class="lead"
            id="systemSummary"
          ></p>
        </div>

        <section
          class="card panel"
          style="margin-top: 22px"
        >
          <span class="pill">
            How the parts work together
          </span>

          <div
            id="components"
            class="component-list"
            style="margin-top: 16px"
          ></div>

          <div
            class="evidence"
            id="structureEvidence"
          ></div>
        </section>

        <div
          class="system-grid"
          style="margin-top: 22px"
        >

          <article class="system-card">
            <span class="pill">
              Effort and return role
            </span>

            <h2>
              Where effort may add value
            </h2>

            <div id="effortMetrics"></div>

            <div
              class="evidence"
              id="effortEvidence"
            ></div>
          </article>

          <article class="system-card">
            <span class="pill">
              What to monitor
            </span>

            <h2 id="monitorHeading"></h2>

            <div
              id="monitorItems"
              class="summary-list"
            ></div>

            <div
              class="evidence"
              id="monitorEvidence"
            ></div>
          </article>

          <article class="system-card">
            <span class="pill">
              Review rhythm
            </span>

            <h2 id="cadenceHeading"></h2>

            <div
              id="cadenceItems"
              class="summary-list"
            ></div>

            <div
              class="evidence"
              id="cadenceEvidence"
            ></div>
          </article>

        </div>

        <section
          class="card panel"
          style="margin-top: 22px"
        >
          <span class="pill">
            When to reconsider something
          </span>

          <div
            id="changeRules"
            class="summary-list"
            style="margin-top: 14px"
          ></div>

          <div
            class="evidence"
            id="rulesEvidence"
          ></div>
        </section>

      </section>
    </main>
  </div>

  <script src="assessment-config.js"></script>
  <script src="app.js"></script>

  <script>
    const SYSTEMS = {
      ES: {
        name:
          "A simple guided starting system",

        summary:
          "A small number of understandable choices, clear next steps, and very few reasons to intervene.",

        components: [
          [
            "Starting foundation",
            "One diversified way to begin or continue consistently."
          ],
          [
            "Ready money",
            "Money needed soon remains accessible and separate."
          ],
          [
            "Later decisions",
            "Additional choices wait until their purpose is understood."
          ]
        ],

        effort: [
          [
            "Routine decisions",
            "Low effort / primary source of progress"
          ],
          [
            "New choices",
            "Occasional effort / only when a real need appears"
          ],
          [
            "Complex strategies",
            "Defer / low value until the foundation is clear"
          ]
        ],

        monitor: [
          "Progress toward the goal",
          "Whether contributions remain consistent",
          "Whether the timeline or financial situation changed"
        ],

        cadence: [
          "Brief check-ins a few times a year",
          "Review after a meaningful life change",
          "Ignore routine market noise between reviews"
        ],

        rules: [
          "Reconsider when the goal, timeline, or ability to contribute changes",
          "Do not add complexity just to feel more advanced",
          "Prefer a clear reasonable step over an endlessly delayed perfect choice"
        ]
      },

      GD: {
        name:
          "A broad, low-maintenance system",

        summary:
          "Broad diversification does most of the work, while monitoring stays focused on goals and major drift.",

        components: [
          [
            "Long-term growth",
            "Broad exposure intended to compound over time."
          ],
          [
            "Stability",
            "Assets aligned with nearer needs and comfort."
          ],
          [
            "Optional additions",
            "Only choices that solve a specific gap."
          ]
        ],

        effort: [
          [
            "Broad foundation",
            "Low effort / carries most expected progress"
          ],
          [
            "Allocation review",
            "Low to moderate effort / protects alignment"
          ],
          [
            "Product comparison",
            "Low return on extra effort once cost and coverage are similar"
          ]
        ],

        monitor: [
          "Savings and contribution progress",
          "Broad mix and concentration",
          "Meaningful drift from the intended balance"
        ],

        cadence: [
          "Automate routine contributions",
          "Check the overall mix a few times a year",
          "Rebalance on a schedule or meaningful threshold"
        ],

        rules: [
          "Add complexity only when it solves a real need",
          "Do not change because another option recently performed better",
          "Leave the system alone while its original purpose still holds"
        ]
      },

      BFO: {
        name:
          "A balanced multi-purpose system",

        summary:
          "Different needs are separated so growth, stability, and selected opportunities do not compete for the same money.",

        components: [
          [
            "Growth foundation",
            "The main source of long-term compounding."
          ],
          [
            "Stability and access",
            "Money requiring greater dependability or nearer access."
          ],
          [
            "Selected ideas",
            "A limited area for choices requiring more thought."
          ]
        ],

        effort: [
          [
            "Growth foundation",
            "Low effort / primary long-term return role"
          ],
          [
            "Stability layer",
            "Periodic effort / reliability role"
          ],
          [
            "Selected ideas",
            "Higher effort / supplemental return or learning role"
          ]
        ],

        monitor: [
          "Changes in goals or timelines",
          "Whether each part still serves its intended job",
          "Whether selected ideas remain inside their limit"
        ],

        cadence: [
          "Light review a few times a year",
          "Full review annually or after a major life change",
          "Selected ideas reviewed separately when their assumptions change"
        ],

        rules: [
          "Every addition needs a stated job",
          "Do not let selected ideas redefine the whole system",
          "Reconsider when the purpose, timeline, or original reason changes"
        ]
      },

      FT: {
        name:
          "A systematic improvement system",

        summary:
          "A durable base remains simple while selected improvements must justify their cost, complexity, and effort.",

        components: [
          [
            "Durable base",
            "Broad holdings that do not need constant evaluation."
          ],
          [
            "Targeted improvements",
            "Choices intended to solve a specific limitation."
          ],
          [
            "Comparison standard",
            "The same criteria used to add, retain, or remove an improvement."
          ]
        ],

        effort: [
          [
            "Durable base",
            "Low effort / carries most expected progress"
          ],
          [
            "Targeted improvements",
            "Moderate effort / must earn incremental value"
          ],
          [
            "Small product differences",
            "Low expected return on additional research"
          ]
        ],

        monitor: [
          "Cost, concentration, and overlap",
          "Whether the improvement still solves its stated problem",
          "Whether evidence still supports keeping it"
        ],

        cadence: [
          "Collect observations without acting immediately",
          "Review meaningful choices on a schedule",
          "Change only when predefined evidence supports it"
        ],

        rules: [
          "Every improvement must name the problem it solves",
          "Stop researching when the important tradeoffs are understood",
          "Do not replace a sound approach due to recent performance alone"
        ]
      },

      GA: {
        name:
          "A foundation plus exploration system",

        summary:
          "Most progress comes from a stable foundation; a smaller area supports learning and higher-growth ideas within explicit limits.",

        components: [
          [
            "Stable foundation",
            "Most of the money and the main long-term return engine."
          ],
          [
            "Exploration area",
            "A capped amount for ideas requiring more research."
          ],
          [
            "Decision record",
            "Why an idea was added, what matters, and when to review it."
          ]
        ],

        effort: [
          [
            "Stable foundation",
            "Low effort / primary expected return role"
          ],
          [
            "Exploration area",
            "Higher effort / uncertain supplemental return"
          ],
          [
            "Idea discovery",
            "High time cost / value only after passing a clear filter"
          ]
        ],

        monitor: [
          "The reason and size of each exploratory choice",
          "Whether the exploration limit is still respected",
          "Whether a new idea duplicates an existing role"
        ],

        cadence: [
          "Foundation reviewed occasionally",
          "Exploratory choices reviewed monthly or when evidence changes",
          "Whole system checked quarterly"
        ],

        rules: [
          "Set the limit before choosing the idea",
          "Write the reason and review point before acting",
          "Do not add something merely because it is exciting or popular"
        ]
      },

      TO: {
        name:
          "A long-term base with a limited active area",

        summary:
          "Long-term progress remains protected while a small set of active decisions follows explicit triggers and exits.",

        components: [
          [
            "Long-term base",
            "Capital not governed by short-term views."
          ],
          [
            "Active decision area",
            "A capped amount for selected market-aware choices."
          ],
          [
            "Trigger and exit record",
            "Evidence, size, downside, and exit written first."
          ]
        ],

        effort: [
          [
            "Long-term base",
            "Low effort / main long-term return role"
          ],
          [
            "Active choices",
            "High effort / uncertain incremental return"
          ],
          [
            "Market monitoring",
            "High time cost / useful only for selected written theses"
          ]
        ],

        monitor: [
          "The thesis and downside for active choices",
          "Whether expected evidence is developing",
          "Whether the active area remains inside its limit"
        ],

        cadence: [
          "Long-term base reviewed periodically",
          "Active choices reviewed when predefined evidence changes",
          "Whole system checked for activity creep"
        ],

        rules: [
          "No active choice without a thesis and downside limit",
          "Do not act because the market feels urgent",
          "Exit or revise when the original evidence no longer holds"
        ]
      },

      IP: {
        name:
          "A dependable-needs and growth system",

        summary:
          "Money needed for access or income is separated from money that can remain invested for long-term growth.",

        components: [
          [
            "Near-term access",
            "Money that should remain dependable and available."
          ],
          [
            "Income or stability",
            "Assets supporting planned use or lower uncertainty."
          ],
          [
            "Long-term growth",
            "Money with enough time to tolerate more movement."
          ]
        ],

        effort: [
          [
            "Near-term planning",
            "Moderate effort / protects planned use"
          ],
          [
            "Income and stability",
            "Periodic effort / reliability role"
          ],
          [
            "Long-term growth",
            "Low ongoing effort / compounding role"
          ]
        ],

        monitor: [
          "Upcoming withdrawals and cash flow",
          "Income durability and purchasing power",
          "Whether timelines or spending needs changed"
        ],

        cadence: [
          "Review around planned spending needs",
          "Periodic review for long-term growth",
          "Full annual check of access, income, inflation, and goals"
        ],

        rules: [
          "Do not use long-term risk for money needed soon",
          "Evaluate income durability, not yield alone",
          "Adjust when needs or timelines change, not merely when prices move"
        ]
      }
    };

    const QUESTION_LABELS = {
      setup:
        "How you invest today",

      transition:
        "What sends you searching",

      decisionStyle:
        "How you compare choices",

      marketPsychology:
        "What captures your attention",

      evolution:
        "What feels incomplete",

      tradeoff:
        "How involved you want to be",

      age:
        "Your time context",

      goals:
        "What you need investing to accomplish"
    };

    function evidence(state, keys) {
      return keys
        .filter((key) => state.answers?.[key]?.length)
        .map((key) => {
          const answerLabels = state.answers[key]
            .map((answer) => answer.label)
            .join(" · ");

          return `
            <strong>${QUESTION_LABELS[key]}:</strong>
            ${answerLabels}
          `;
        })
        .join("<br>");
    }

    function render() {
      const hasState = new URLSearchParams(
        location.search
      ).has("state");

      if (!hasState) {
        missingState.style.display = "block";
        return;
      }

      const state = getState();

      const assessmentResult =
        state.result || resolveAssessment(state);

      const system =
        SYSTEMS[assessmentResult.archetypeId] ||
        SYSTEMS.GD;

      result.style.display = "block";

      systemName.textContent =
        system.name;

      systemSummary.textContent =
        system.summary;

      components.innerHTML =
        system.components
          .map((component) => {
            return `
              <div class="component">
                <strong>${component[0]}</strong>
                <span>${component[1]}</span>
              </div>
            `;
          })
          .join("");

      effortMetrics.innerHTML =
        system.effort
          .map((item) => {
            return `
              <div class="metric">
                <span>${item[0]}</span>
                <strong>${item[1]}</strong>
              </div>
            `;
          })
          .join("");

      monitorHeading.textContent =
        "Monitor only what can change the decision";

      monitorItems.innerHTML =
        system.monitor
          .map((item) => {
            return `
              <div class="summary-item">
                ${item}
              </div>
            `;
          })
          .join("");

      cadenceHeading.textContent =
        "Interact at a pace you can sustain";

      cadenceItems.innerHTML =
        system.cadence
          .map((item) => {
            return `
              <div class="summary-item">
                ${item}
              </div>
            `;
          })
          .join("");

      changeRules.innerHTML =
        system.rules
          .map((item) => {
            return `
              <div class="summary-item">
                ${item}
              </div>
            `;
          })
          .join("");

      structureEvidence.innerHTML =
        evidence(
          state,
          [
            "setup",
            "goals"
          ]
        );

      effortEvidence.innerHTML =
        evidence(
          state,
          [
            "decisionStyle",
            "evolution"
          ]
        );

      monitorEvidence.innerHTML =
        evidence(
          state,
          [
            "marketPsychology",
            "transition"
          ]
        );

      cadenceEvidence.innerHTML =
        evidence(
          state,
          [
            "tradeoff",
            "marketPsychology"
          ]
        );

      rulesEvidence.innerHTML =
        evidence(
          state,
          [
            "transition",
            "goals",
            "age"
          ]
        );
    }

    render();
  </script>
</body>
</html>
