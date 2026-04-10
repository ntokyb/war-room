// Export problems and screening questions as Markdown files

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportProblemMarkdown(problem, platform, language) {
  const lines = [];
  const slug = (problem.title || "problem")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  lines.push(`# ${problem.title}`);
  lines.push("");
  lines.push(
    `**Platform:** ${platform.name} · **Language:** ${language.name} · **Difficulty:** ${problem.difficulty}`,
  );
  lines.push("");

  if (problem.platformNotes) {
    lines.push(`> ${problem.platformNotes}`);
    lines.push("");
  }

  lines.push("## Problem");
  lines.push("");
  lines.push(problem.description);
  lines.push("");

  if (problem.constraints?.length) {
    lines.push("### Constraints");
    lines.push("");
    problem.constraints.forEach((c) => lines.push(`- ${c}`));
    lines.push("");
  }

  if (problem.realWorldContext) {
    lines.push(`**Real-world context:** ${problem.realWorldContext}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  if (problem.ideSetup?.length) {
    lines.push("## IDE Setup");
    lines.push("");
    problem.ideSetup.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push("");
  }

  if (problem.thinkingProcess?.length) {
    lines.push("## Think Before You Type");
    lines.push("");
    problem.thinkingProcess.forEach((t) => lines.push(`- ${t}`));
    lines.push("");
  }

  if (problem.hints?.length) {
    lines.push("## Hints");
    lines.push("");
    problem.hints.forEach((h, i) =>
      lines.push(
        `<details><summary>Hint ${i + 1}</summary>\n\n${h}\n\n</details>`,
      ),
    );
    lines.push("");
  }

  if (problem.steps?.length) {
    lines.push("## Step-by-Step Solution");
    lines.push("");
    problem.steps.forEach((s) => {
      lines.push(`### Step ${s.step}: ${s.title}`);
      lines.push("");
      lines.push(s.explanation);
      lines.push("");
      if (s.code) {
        lines.push("```");
        lines.push(s.code);
        lines.push("```");
        lines.push("");
      }
    });
  }

  if (problem.fullSolution) {
    lines.push("## Full Solution");
    lines.push("");
    lines.push("```");
    lines.push(problem.fullSolution);
    lines.push("```");
    lines.push("");
  }

  if (problem.complexity) {
    lines.push("## Complexity");
    lines.push("");
    lines.push(`- **Time:** ${problem.complexity.time}`);
    lines.push(`- **Space:** ${problem.complexity.space}`);
    lines.push("");
  }

  if (problem.commonMistakes?.length) {
    lines.push("## Common Mistakes");
    lines.push("");
    problem.commonMistakes.forEach((m) => lines.push(`- ✕ ${m}`));
    lines.push("");
  }

  if (problem.seniorTip) {
    lines.push("## Senior Tip");
    lines.push("");
    lines.push(`> "${problem.seniorTip}"`);
    lines.push("");
  }

  downloadFile(`${slug}.md`, lines.join("\n"));
}

export function exportScreeningMarkdown(question, category, type) {
  const lines = [];
  const slug = (question.title || "screening")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  lines.push(`# ${question.title}`);
  lines.push("");
  lines.push(
    `**Category:** ${category.name} · **Type:** ${type.name} · **Difficulty:** ${question.difficulty}`,
  );
  lines.push("");

  if (question.context) {
    lines.push(`> ${question.context}`);
    lines.push("");
  }

  lines.push("## Question");
  lines.push("");
  lines.push(question.question);
  lines.push("");

  if (question.codeSnippet) {
    lines.push("### Code to Review");
    lines.push("");
    lines.push("```");
    lines.push(question.codeSnippet);
    lines.push("```");
    lines.push("");
  }

  if (question.hints?.length) {
    lines.push("## Hints");
    lines.push("");
    question.hints.forEach((h, i) =>
      lines.push(
        `<details><summary>Hint ${i + 1}</summary>\n\n${h}\n\n</details>`,
      ),
    );
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  if (question.answer) {
    lines.push("## Quick Answer");
    lines.push("");
    lines.push(question.answer.summary);
    lines.push("");

    lines.push("## Full Explanation");
    lines.push("");
    lines.push(question.answer.detailed);
    lines.push("");

    if (question.answer.codeExample) {
      lines.push("## Code Example");
      lines.push("");
      lines.push("```");
      lines.push(question.answer.codeExample);
      lines.push("```");
      lines.push("");
    }

    if (question.answer.realWorldScenario) {
      lines.push("## Real-World Scenario");
      lines.push("");
      lines.push(question.answer.realWorldScenario);
      lines.push("");
    }
  }

  if (question.whatInterviewersWant) {
    lines.push("## What Interviewers Want");
    lines.push("");
    lines.push(question.whatInterviewersWant);
    lines.push("");
  }

  if (question.commonWrongAnswers?.length) {
    lines.push("## Common Wrong Answers");
    lines.push("");
    question.commonWrongAnswers.forEach((wa) => lines.push(`- ⚠ ${wa}`));
    lines.push("");
  }

  if (question.followUpQuestions?.length) {
    lines.push("## Follow-Up Questions");
    lines.push("");
    question.followUpQuestions.forEach((fq, i) =>
      lines.push(`${i + 1}. ${fq}`),
    );
    lines.push("");
  }

  if (question.seniorTip) {
    lines.push("## Senior Tip");
    lines.push("");
    lines.push(`> "${question.seniorTip}"`);
    lines.push("");
  }

  downloadFile(`${slug}.md`, lines.join("\n"));
}
