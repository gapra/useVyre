/**
 * Pretty CLI report for the useVyre eval. `node eval/report.js`.
 *
 * Prints the comparative hallucination numbers and exits non-zero if the
 * with-context arm is NOT cleaner than without — so a regression (context
 * stops helping) fails CI instead of passing silently.
 */
import { runEval } from "./scorer.js";

const pct = (n) => `${(n * 100).toFixed(0)}%`;
const { without, with: w, reduction } = runEval();

console.log("\nuseVyre eval — does the AI context reduce hallucinations?\n");
console.log(
  "  Fixtures re-measured with @usevyre/validate-ai-context + raw-color check.",
);
console.log("  (folder labels are NOT trusted — every file is re-scored)\n");

const row = (label, a) =>
  `  ${label.padEnd(22)} ${String(a.totalIssues).padStart(3)} issues` +
  `  (props ${a.hallucinatedProps}, enums ${a.invalidEnums}, raw-colors ${a.rawColors})` +
  `  · ${a.cleanFiles}/${a.files} files clean`;

console.log(row("WITHOUT context", without));
console.log(row("WITH useVyre context", w));
console.log("");
console.log(
  `  Issue reduction:      ${pct(reduction)}` +
    `   (${without.totalIssues} → ${w.totalIssues})`,
);
console.log(
  `  Clean-file rate:      ${pct(without.cleanRate)} → ${pct(w.cleanRate)}\n`,
);

// Per-file breakdown so the number is auditable, not a black box.
for (const f of Object.keys(without.perFile)) {
  const a = without.perFile[f].total;
  const b = w.perFile[f]?.total ?? 0;
  const mark = b < a ? "improved" : b === a ? "same" : "REGRESSED";
  console.log(`    ${f.padEnd(22)} ${a} → ${b}  [${mark}]`);
}
console.log("");

if (w.totalIssues >= without.totalIssues) {
  console.error(
    "FAIL: useVyre context did not reduce issues. The value prop is unproven on this corpus.",
  );
  process.exit(1);
}
console.log(
  `PASS: useVyre context cut hallucinations by ${pct(reduction)} on this corpus.\n`,
);
console.log(
  "  Caveat: this is a hand-curated fixture corpus, not live LLM output.\n" +
    "  It proves the tooling detects the documented failure modes and that\n" +
    "  correct useVyre code scores zero — NOT a model-measured hallucination\n" +
    "  rate. For that, wire an LLM adapter that emits into fixtures/ and re-run.\n",
);
