"use client";

import { useActionState, useState } from "react";

import { choosePlan, type PlanFormState } from "@/app/account/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { CheckIcon } from "@/components/ui/icons";
import { formatEuros } from "@/lib/format";
import type { Plan } from "@/lib/types";

type Props = {
  plans: Plan[];
  currentPlan?: string;
  defaultPlan?: string;
};

/** A radio list of plans, styled as an iOS selection list (checkmark on the chosen row). */
export function PlanPicker({ plans, currentPlan, defaultPlan }: Props) {
  const [state, action, pending] = useActionState<PlanFormState, FormData>(choosePlan, {});
  const [selected, setSelected] = useState(defaultPlan);
  const unchanged = selected === currentPlan;

  return (
    <form action={action}>
      <fieldset>
        <legend className="sr-only">Plans</legend>
        {plans.map((plan) => (
          <label
            key={plan.code}
            className={cn(
              "relative flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-fill-quaternary",
              "before:absolute before:top-0 before:right-0 before:left-4 before:h-px before:bg-separator before:content-[''] first-of-type:before:hidden",
              "has-[:focus-visible]:bg-fill-quaternary",
            )}
          >
            <input
              type="radio"
              name="planCode"
              value={plan.code}
              checked={selected === plan.code}
              onChange={() => setSelected(plan.code)}
              className="sr-only"
            />
            <span className="flex-1">
              <span className="block text-body">
                {plan.name}
                {plan.code === currentPlan && <span className="ml-2 text-footnote text-label-secondary">Current</span>}
              </span>
              <span className="block text-footnote text-label-secondary">{plan.contents}</span>
            </span>
            <span className="text-subheadline text-label-secondary">{formatEuros(plan.priceCents)}/mo</span>
            <CheckIcon
              className={cn("size-5 text-tint", selected === plan.code ? "opacity-100" : "opacity-0")}
              strokeWidth={2.5}
            />
          </label>
        ))}
      </fieldset>
      <div className="space-y-3 border-t border-separator px-4 py-4">
        {state.error && <Alert>{state.error}</Alert>}
        {state.success && unchanged && <Alert tone="info">{state.success}</Alert>}
        <Button type="submit" className="w-full" disabled={pending || !selected || unchanged}>
          {pending ? "Saving…" : currentPlan ? "Switch plan" : "Start my subscription"}
        </Button>
      </div>
    </form>
  );
}
