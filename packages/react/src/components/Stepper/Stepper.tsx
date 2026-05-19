/**
 * @usevyre/react — Stepper + Step + StepPanel
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  Stepper (+ StepperNav, Step, StepPanel)              │
 * │ Import: import { Stepper, StepperNav, Step, StepPanel }           │
 * │         from "@usevyre/react"                                     │
 * │                                                                   │
 * │ Multi-step flow indicator + controller (onboarding/checkout/      │
 * │ wizard). CONTROLLED by a 0-based index. Indices come from order.  │
 * │                                                                   │
 * │   <Stepper>                                                       │
 * │     value?       = number  (controlled active index)              │
 * │     defaultValue = number  (uncontrolled, default 0)              │
 * │     onChange?    = (index: number) => void                        │
 * │     orientation  = "horizontal"(default) | "vertical"             │
 * │     clickable?   = boolean  (click a completed Step to go back)   │
 * │   <StepperNav> <Step label description? icon? /> … </StepperNav>  │
 * │   <StepPanel> … </StepPanel>   ← rendered when its order == active │
 * │                                                                   │
 * │ Each Step auto-gets state completed | current | upcoming.         │
 * │ NOT Tabs (peer panels) — Stepper is an ORDERED linear flow.       │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [step, setStep] = useState(0);
 * <Stepper value={step} onChange={setStep}>
 *   <StepperNav>
 *     <Step label="Account" />
 *     <Step label="Profile" />
 *     <Step label="Done" />
 *   </StepperNav>
 *   <StepPanel><AccountForm /></StepPanel>
 *   <StepPanel><ProfileForm /></StepPanel>
 *   <StepPanel><Summary /></StepPanel>
 * </Stepper>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

interface StepperContextValue {
  active: number;
  setActive: (i: number) => void;
  orientation: "horizontal" | "vertical";
  clickable: boolean;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext(component: string) {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error(`${component} must be used inside <Stepper>`);
  return ctx;
}

export interface StepperProps extends BaseProps {
  /** Controlled active step (0-based) */
  value?: number;
  /** Initial active step when uncontrolled */
  defaultValue?: number;
  /** Called with the new active index */
  onChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  /** Allow clicking a completed Step to jump back to it */
  clickable?: boolean;
  children?: React.ReactNode;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      orientation = "horizontal",
      clickable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const active = isControlled ? controlledValue! : internal;

    const setActive = React.useCallback(
      (i: number) => {
        if (!isControlled) setInternal(i);
        onChange?.(i);
      },
      [isControlled, onChange]
    );

    // Assign each StepPanel its order index so only the active one renders.
    let panelIndex = -1;
    const enhanced = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === StepPanel) {
        panelIndex += 1;
        return React.cloneElement(child as React.ReactElement<StepPanelProps>, {
          __index: panelIndex,
        });
      }
      return child;
    });

    return (
      <StepperContext.Provider
        value={{ active, setActive, orientation, clickable }}
      >
        <div
          ref={ref}
          className={cn(
            "vyre-stepper",
            `vyre-stepper--${orientation}`,
            className
          )}
          data-orientation={orientation}
          {...props}
        >
          {enhanced}
        </div>
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = "VyreStepper";

// ── StepperNav (indicator row/column) ─────────────────────────

export interface StepperNavProps extends BaseProps {
  children?: React.ReactNode;
}

export const StepperNav = React.forwardRef<HTMLDivElement, StepperNavProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useStepperContext("StepperNav");
    let stepIndex = -1;
    const items = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === Step) {
        stepIndex += 1;
        return React.cloneElement(child as React.ReactElement<StepProps>, {
          __index: stepIndex,
        });
      }
      return child;
    });
    return (
      <div
        ref={ref}
        role="list"
        aria-orientation={orientation}
        className={cn("vyre-stepper__nav", className)}
        {...props}
      >
        {items}
      </div>
    );
  }
);
StepperNav.displayName = "VyreStepperNav";

// ── Step (one indicator) ──────────────────────────────────────

export interface StepProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Custom indicator content (defaults to step number / ✓ when done) */
  icon?: React.ReactNode;
  /** Explicit 0-based index. Optional — inferred from order otherwise. */
  index?: number;
  /** @internal injected by StepperNav */
  __index?: number;
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  (
    { label, description, icon, index, __index = 0, className, ...props },
    ref
  ) => {
    const stepIdx = index ?? __index;
    const { active, setActive, clickable } = useStepperContext("Step");
    const state =
      stepIdx < active
        ? "completed"
        : stepIdx === active
          ? "current"
          : "upcoming";
    const isClickable = clickable && stepIdx < active;

    const indicator = icon ?? (state === "completed" ? "✓" : stepIdx + 1);

    return (
      <div
        ref={ref}
        role="listitem"
        aria-current={state === "current" ? "step" : undefined}
        data-state={state}
        className={cn(
          "vyre-step",
          `vyre-step--${state}`,
          isClickable && "vyre-step--clickable",
          className
        )}
        {...props}
      >
        <button
          type="button"
          className="vyre-step__indicator"
          disabled={!isClickable}
          tabIndex={isClickable ? 0 : -1}
          aria-label={typeof label === "string" ? label : `Step ${stepIdx + 1}`}
          onClick={() => isClickable && setActive(stepIdx)}
        >
          <span aria-hidden="true">{indicator}</span>
        </button>
        {(label || description) && (
          <span className="vyre-step__text">
            {label && <span className="vyre-step__label">{label}</span>}
            {description && (
              <span className="vyre-step__description">{description}</span>
            )}
          </span>
        )}
        <span className="vyre-step__connector" aria-hidden="true" />
      </div>
    );
  }
);
Step.displayName = "VyreStep";

// ── StepPanel ─────────────────────────────────────────────────

export interface StepPanelProps extends BaseProps {
  children?: React.ReactNode;
  /** Explicit 0-based index. Optional — inferred from order otherwise. */
  index?: number;
  /** @internal injected by Stepper */
  __index?: number;
}

export const StepPanel: React.FC<StepPanelProps> = ({
  className,
  children,
  index,
  __index = 0,
}) => {
  const { active } = useStepperContext("StepPanel");
  if ((index ?? __index) !== active) return null;
  return (
    <div role="tabpanel" className={cn("vyre-step-panel", className)}>
      {children}
    </div>
  );
};
StepPanel.displayName = "VyreStepPanel";
