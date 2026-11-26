"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/content";
import type { Lang } from "@/lib/site";

import { Logo } from "./logo";

const STORAGE_KEY = "malaka-age-confirmed";
const CHANGE_EVENT = "malaka-age-confirmed-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readConfirmed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // storage blocked: ask again on every visit
  }
}

// The server can't know the answer, so it renders no gate; the client shows it right after hydration.
function useAgeConfirmed() {
  const stored = useSyncExternalStore(subscribe, readConfirmed, () => true);
  const [session, setSession] = useState(false);
  const confirm = () => {
    setSession(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // Confirmation still holds for this page view.
    }
  };
  return [stored || session, confirm] as const;
}

/** Full-screen check that the visitor is 18 or older. The answer is remembered on this device. */
export function AgeGate({ lang }: { lang: Lang }) {
  const text = getDictionary(lang).ageGate;
  const [confirmed, confirm] = useAgeConfirmed();
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (confirmed) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [confirmed]);

  if (confirmed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-system/90 p-4 backdrop-blur-xl">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-description"
        className="w-full max-w-sm rounded-md bg-elevated p-6 text-center shadow-2xl ring-1 ring-separator"
      >
        <div className="mb-6 flex justify-center">
          <Logo lang={lang} />
        </div>
        <h2 id="age-gate-title" className="text-title2">
          {denied ? text.deniedTitle : text.title}
        </h2>
        <p id="age-gate-description" className="mt-2 text-callout text-label-secondary">
          {denied ? text.deniedBody : text.body}
        </p>
        {denied ? (
          <Button variant="gray" size="lg" className="mt-6 w-full" onClick={() => setDenied(false)}>
            {text.back}
          </Button>
        ) : (
          <div className="mt-6 flex flex-col gap-2">
            <Button size="lg" className="w-full" onClick={confirm} autoFocus>
              {text.yes}
            </Button>
            <Button variant="gray" size="lg" className="w-full" onClick={() => setDenied(true)}>
              {text.no}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
