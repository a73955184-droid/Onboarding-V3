<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>AaronBux - Your Investor Profile</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  >

  <link rel="stylesheet" href="styles.css" />

  <style>
    .result-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 22px;
    }

    .profile-card {
      padding: 22px;
      border: 1px solid var(--border, #dfe7ec);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.72);
    }

    .profile-card h2 {
      margin: 8px 0;
      font-size: 1.15rem;
    }

    .profile-card p {
      margin: 0;
      line-height: 1.55;
      color: var(--muted, #52636e);
    }

    .evidence {
      margin-top: 13px;
      padding-top: 13px;
      border-top: 1px solid var(--border, #dfe7ec);
      font-size: 0.88rem;
      line-height: 1.45;
      color: var(--muted, #52636e);
    }

    .next-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }

    @media (max-width: 820px) {
      .result-grid {
        grid-template-columns: 1fr;
      }

      .next-row .btn {
        width: 100%;
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
          Back
        </button>

        <div style="text-align: center">
          <div class="brand">AaronBux</div>
          <div class="step-label">Your investor profile</div>
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
          style="width: 92%"
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
          <span class="pill">Your investor profile</span>

          <h1 id="profileHeadline"></h1>

          <p
            class="lead"
            id="profileSummary"
          ></p>
        </div>

        <div class="result-grid">

          <article class="profile-card">
            <span class="pill">Where you are now</span>

            <h2 id="stageName"></h2>

            <p id="stageCopy"></p>

            <div
              class="evidence"
              id="stageEvidence"
            ></div>
          </article>

          <article class="profile-card">
            <span class="pill">How you prefer to invest</span>

            <h2 id="styleName"></h2>

            <p id="styleCopy"></p>

            <div
              class="evidence"
              id="styleEvidence"
            ></div>
          </article>

          <article class="profile-card">
            <span class="pill">What affects confidence</span>

            <h2 id="modifierName"></h2>

            <p id="modifierCopy"></p>

            <div
              class="evidence"
              id="modifierEvidence"
            ></div>
          </article>

        </div>

        <div class="next-row">
          <button
            id="systemBtn"
            class="btn btn-primary"
          >
            See your investing system
          </button>
        </div>

      </section>
    </main>
  </div>

  <script src="assessment-config.js"></script>
  <script src="app.js"></script>

  <script>
    const STAGE_VIEW = {
      foundation_builder: {
        name: "Building your foundation",
        summary:
          "You need a clear starting structure and a small number of understandable decisions.",
        headline:
          "You are building confidence through a clearer starting point."
      },

      portfolio_organizer: {
        name: "Organizing what you already have",
        summary:
          "You have begun investing, but the pieces do not yet feel connected by one clear reason.",
        headline:
          "You are ready to turn separate choices into one understandable approach."
      },

      system_builder: {
        name: "Building a repeatable approach",
        summary:
          "You are moving beyond isolated choices and want clearer rules for monitoring and change.",
        headline:
          "You are ready for a repeatable way to oversee your investments."
      },

      intentional_optimizer: {
        name: "Improving with intention",
        summary:
          "You want to compare alternatives and improve outcomes without changing direction unnecessarily.",
        headline:
          "You are ready to focus effort where it can make a meaningful difference."
      },

      adaptive_investor: {
        name: "Adapting within boundaries",
        summary:
          "You are comfortable exploring selected ideas, provided they remain connected to a larger plan.",
        headline:
          "You are ready to explore without letting every opportunity redefine your approach."
      }
    };

    const STYLE_VIEW = {
      guided_autopilot: {
        name: "Low-touch and guided",
        copy:
          "Routine decisions should stay simple and mostly automatic, with attention requested only when something meaningful changes."
      },

      steady_steward: {
        name: "Calm and periodic",
        copy:
          "You are most likely to stay consistent with occasional reviews and limited, understandable changes."
      },

      systematic_improver: {
        name: "Structured and evidence-led",
        copy:
          "You prefer repeatable criteria for comparing choices, deciding what matters, and knowing when research is sufficient."
      },

      bounded_explorer: {
        name: "Stable with room to explore",
        copy:
          "You want a dependable base while reserving a limited amount of time and money for selected ideas."
      },

      active_navigator: {
        name: "Involved within clear limits",
        copy:
          "You are willing to monitor selected opportunities more closely, but decisions need explicit triggers and boundaries."
      }
    };

    const MODIFIER_VIEW = {
      validation_seeker: {
        name: "Evidence before confidence",
        copy:
          "You trust decisions more when you can see why they fit your situation and compare them with reasonable alternatives."
      },

      instruction_seeker: {
        name: "Clear next steps",
        copy:
          "Uncertainty becomes easier when it is translated into a specific action: begin, review, wait, rebalance, or research further."
      },

      confidence_builder: {
        name: "Reassurance through structure",
        copy:
          "Predetermined review points and limits can help normal market movement feel less like a reason to rethink everything."
      },

      opportunity_chaser: {
        name: "Curiosity needs boundaries",
        copy:
          "New ideas are motivating, but they are easier to manage when their size, role, and review point are decided first."
      },

      optimization_mindset: {
        name: "Improvement needs a stopping rule",
        copy:
          "You naturally look for better choices; a consistent standard can prevent improvement from becoming endless comparison."
      }
    };

    const EVIDENCE_MAP = {
      stage: [
        "setup",
        "evolution"
      ],

      style: [
        "tradeoff",
        "marketPsychology"
      ],

      modifier: [
        "transition",
        "decisionStyle"
      ]
    };

    const QUESTION_LABELS = {
      setup: "How you invest today",
      transition: "What sends you searching",
      decisionStyle: "How you make a choice",
      marketPsychology: "What gets your attention",
      evolution: "What feels incomplete",
      tradeoff: "How involved you want to be"
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

      const stage =
        STAGE_VIEW[assessmentResult.stageId] ||
        STAGE_VIEW.portfolio_organizer;

      const style =
        STYLE_VIEW[assessmentResult.styleId] ||
        STYLE_VIEW.steady_steward;

      const modifier =
        MODIFIER_VIEW[assessmentResult.modifierId] ||
        MODIFIER_VIEW.confidence_builder;

      result.style.display = "block";

      profileHeadline.textContent =
        stage.headline;

      profileSummary.textContent =
        "Your answers describe both where investing becomes difficult and the way you are most likely to stay confident and consistent.";

      stageName.textContent =
        stage.name;

      stageCopy.textContent =
        stage.summary;

      styleName.textContent =
        style.name;

      styleCopy.textContent =
        style.copy;

      modifierName.textContent =
        modifier.name;

      modifierCopy.textContent =
        modifier.copy;

      stageEvidence.innerHTML =
        evidence(
          state,
          EVIDENCE_MAP.stage
        );

      styleEvidence.innerHTML =
        evidence(
          state,
          EVIDENCE_MAP.style
        );

      modifierEvidence.innerHTML =
        evidence(
          state,
          EVIDENCE_MAP.modifier
        );

      systemBtn.onclick = () => {
        goTo(
          "system.html",
          state
        );
      };
    }

    render();
  </script>
</body>
</html>
