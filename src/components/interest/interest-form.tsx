"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { getDictionary } from "@/lib/content";
import { INTEREST_ENDPOINT, PRIVACY_UPDATED, pagePath, type Lang } from "@/lib/site";

type Status = "idle" | "sending" | "done";
type FormError = "email" | "consent" | "send";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Collects an email address from people who want to hear about the launch and posts it to `INTEREST_ENDPOINT`
 * (a Google Apps Script that adds a row to a Google Sheet). Nothing is sent unless the consent box is ticked.
 */
export function InterestForm({ lang }: { lang: Lang }) {
  const text = getDictionary(lang).interest;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<FormError | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = email.trim();
    if (!EMAIL_PATTERN.test(address)) return setError("email");
    if (!consent) return setError("consent");
    // A field people can't see. Only bots fill it in; they are told it worked and nothing is sent.
    const trap = new FormData(event.currentTarget).get("website");
    if (trap) return setStatus("done");

    setError(null);
    setStatus("sending");
    try {
      if (!INTEREST_ENDPOINT) throw new Error("INTEREST_ENDPOINT is not set in src/lib/site.ts");
      // A plain form post is a "simple" request, so the browser sends it to Apps Script without a preflight.
      const response = await fetch(INTEREST_ENDPOINT, {
        method: "POST",
        body: new URLSearchParams({
          email: address,
          lang,
          // The plan picked on the homepage (`?plan=BODEGA`), if any. Read here so the page can stay fully static.
          plan: new URLSearchParams(window.location.search).get("plan") ?? "",
          policy: PRIVACY_UPDATED,
        }),
      });
      const result: { ok?: boolean } = await response.json();
      if (!result.ok) throw new Error("The sign-up was rejected");
      setStatus("done");
      window.scrollTo({ top: 0 });
    } catch (cause) {
      console.warn("Could not register interest:", cause);
      setStatus("idle");
      setError("send");
    }
  };

  if (status === "done") {
    return (
      <div className="animate-materialize rounded-md bg-grouped-secondary/85 p-6 text-center ring-1 ring-separator backdrop-blur-md" role="status">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-system-green text-white">
          <CheckIcon className="size-9" strokeWidth={2.5} />
        </span>
        <h2 className="mt-6 text-title1">{text.success.title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-body text-label-secondary">{text.success.body}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href={pagePath(lang, "guide")} size="lg">
            {text.success.guide}
          </ButtonLink>
          <ButtonLink href={pagePath(lang, "home")} variant="plain">
            {text.success.home}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const sending = status === "sending";
  return (
    <form onSubmit={submit} noValidate className="rounded-md bg-grouped-secondary/85 p-6 ring-1 ring-separator backdrop-blur-md">
      <label htmlFor="interest-email" className="block text-headline">
        {text.emailLabel}
      </label>
      <input
        id="interest-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        maxLength={254}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={text.emailPlaceholder}
        aria-invalid={error === "email"}
        aria-describedby={error ? "interest-error" : undefined}
        className="mt-2 block h-12 w-full rounded-sm bg-system/60 px-4 text-body ring-1 ring-label/30 outline-none placeholder:text-label-tertiary focus:ring-2 focus:ring-accent/60"
      />

      {/* Hidden from people and from screen readers; see the bot check in `submit`. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-subheadline text-label-secondary">
        <input
          name="consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          aria-invalid={error === "consent"}
          aria-describedby={error ? "interest-error" : undefined}
          className="mt-0.5 size-5 shrink-0 accent-tint"
        />
        <span>
          {text.consent}
          <Link href={pagePath(lang, "privacy")} className="text-accent underline underline-offset-2">
            {text.consentLink}
          </Link>
          {text.consentEnd}
        </span>
      </label>

      <p id="interest-error" role="alert" className="mt-4 text-footnote text-system-red empty:hidden">
        {error && text.errors[error]}
      </p>

      <Button type="submit" size="lg" disabled={sending} className="mt-4 w-full">
        {sending ? text.sending : text.submit}
      </Button>
      <p className="mt-4 text-center text-footnote text-label-secondary">{text.note}</p>
    </form>
  );
}
