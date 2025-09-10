"use client";

import React from "react";

/**
 * Fix for build error:
 *   Type '({ kind: string; label: string; } | { kind: string; tag: string; title: string; })[]'
 *   is not assignable to type '({ kind: "strategy"; label: string; } | { kind: "exec"; tag: string; title: string; })[]'.
 *
 * Root cause: the `kind` property was inferred as a generic `string` rather than the
 * string literals "strategy" | "exec", so the discriminated union couldn't narrow.
 *
 * Solution: define literal-typed step shapes and ensure array items keep literal kinds.
 */

// 1) Define the literal, discriminated union types
export type StrategyStep = { kind: "strategy"; label: string };
export type ExecStep = { kind: "exec"; tag: string; title: string };
export type Step = StrategyStep | ExecStep;

// 2) Optional helpers to create steps without widening `kind`
const strategy = (label: string): StrategyStep => ({ kind: "strategy", label });
const exec = (tag: string, title: string): ExecStep => ({ kind: "exec", tag, title });

// 3) Define your steps using the helpers (or add `as const` on each `kind` value)
//    Replace the example items below with your actual content.
const STEPS: Step[] = [
  strategy("Discovery & Goals"),
  strategy("Roadmapping"),
  exec("design", "Design & Content"),
  exec("build", "Development"),
  exec("launch", "QA, Deploy, Iterate"),
];

export default function ProcessExperience() {
  return (
    <section id="process" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">How we work</h2>

      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {STEPS.map((step, idx) => {
          if (step.kind === "strategy") {
            return (
              <li
                key={`s-${idx}-${step.label}`}
                className="rounded-2xl ring-1 ring-white/15 bg-white/5 p-5"
              >
                <div className="text-xs uppercase tracking-widest opacity-70">Strategy</div>
                <div className="text-base sm:text-lg font-medium mt-1">{step.label}</div>
              </li>
            );
          }

          // exec
          return (
            <li
              key={`e-${idx}-${step.tag}`}
              className="rounded-2xl ring-1 ring-white/15 bg-white/5 p-5"
            >
              <div className="text-xs uppercase tracking-widest opacity-70">Execution</div>
              <div className="text-base sm:text-lg font-medium mt-1">{step.title}</div>
              <div className="text-sm opacity-70 mt-1">#{step.tag}</div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * If you prefer to keep your existing `STEPS` array, a minimal patch is to add
 * `as const` to the `kind` values so they are treated as string literals:
 *
 *   const STEPS: Step[] = [
 *     { kind: "strategy" as const, label: "..." },
 *     { kind: "exec" as const, tag: "design", title: "Design" },
 *   ];
 *
 * Or validate with `satisfies` (keeps literal types, no widening):
 *
 *   const STEPS = [
 *     { kind: "strategy" as const, label: "..." },
 *     { kind: "exec" as const, tag: "design", title: "Design" },
 *   ] satisfies Step[];
 */
