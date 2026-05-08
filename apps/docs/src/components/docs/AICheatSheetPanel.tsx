import { useState } from "react";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@usevyre/react";

interface EnumProp {
  name: string;
  values: string[];
  defaultVal?: string | boolean;
}

interface BoolProp {
  name: string;
  defaultVal?: boolean;
}

interface AntiPattern {
  pattern: string;
  fix: string;
}

interface Example {
  description: string;
  code: string;
}

interface Props {
  component: string;
  importStr: string;
  enumProps: EnumProp[];
  boolProps: BoolProp[];
  antiPatterns: AntiPattern[];
  examples: Example[];
  copyText: string;
}

export function AICheatSheetPanel({
  enumProps, boolProps, antiPatterns, examples, copyText,
}: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="acs-wrap">
      <Accordion type="single" defaultValue="">
        <AccordionItem value="open">
          <AccordionTrigger className="acs-trigger">
            <span className="acs-trigger__left">
              <span className="acs-trigger__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M4 9h2M8 9h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="acs-trigger__label">AI Context</span>
            </span>
            <span className="acs-trigger__tools" aria-hidden="true">
              <span className="acs-tool-chip">for Claude · Cursor · Copilot · Windsurf · Gemini · etc...</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="acs-body">
            <div className="acs-inner">
              {(enumProps.length > 0 || boolProps.length > 0) && (
                <div className="acs-section">
                  <p className="acs-label">Valid props</p>
                  <table className="acs-table">
                    <thead>
                      <tr><th>Prop</th><th>Values</th><th>Default</th></tr>
                    </thead>
                    <tbody>
                      {enumProps.map((ep) => (
                        <tr key={ep.name}>
                          <td><code className="acs-code">{ep.name}</code></td>
                          <td className="acs-values">
                            {ep.values.map((v, i) => (
                              <span key={v} className="acs-val-wrap">
                                <code className="acs-val">{'"' + v + '"'}</code>
                                {i < ep.values.length - 1 && <span className="acs-pipe">|</span>}
                              </span>
                            ))}
                          </td>
                          <td>
                            {ep.defaultVal !== undefined
                              ? <code className="acs-code">{String(ep.defaultVal)}</code>
                              : <span className="acs-empty">—</span>}
                          </td>
                        </tr>
                      ))}
                      {boolProps.map((bp) => (
                        <tr key={bp.name}>
                          <td><code className="acs-code">{bp.name}</code></td>
                          <td className="acs-values">
                            <code className="acs-val">true</code>
                            <span className="acs-pipe">|</span>
                            <code className="acs-val">false</code>
                          </td>
                          <td><code className="acs-code">{String(bp.defaultVal ?? false)}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {antiPatterns.length > 0 && (
                <div className="acs-section">
                  <p className="acs-label">Common AI mistakes</p>
                  <ul className="acs-mistakes">
                    {antiPatterns.map((ap, i) => (
                      <li key={i} className="acs-mistake">
                        <span><span className="acs-bad">{ap.pattern}</span></span>
                        <span className="acs-fix">→ {ap.fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {examples.length > 0 && (
                <div className="acs-section">
                  <p className="acs-label">Quick examples</p>
                  {examples.map((ex, i) => (
                    <div key={i} className="acs-example">
                      <span className="acs-example-label">{ex.description}</span>
                      <pre className="acs-pre"><code>{ex.code}</code></pre>
                    </div>
                  ))}
                </div>
              )}

              <div className="acs-footer">
                <button
                  className={"acs-copy-btn" + (copied ? " acs-copy-btn--done" : "")}
                  type="button"
                  title="Paste into CLAUDE.md, .cursor/rules, .github/copilot-instructions.md, .windsurfrules, GEMINI.md, etc."
                  onClick={copy}
                >
                  {copied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M3 7.5l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Copied to clipboard
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <rect x="4" y="4" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M2 10V2.8c0-.44.36-.8.8-.8H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      Copy AI context
                    </>
                  )}
                </button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
