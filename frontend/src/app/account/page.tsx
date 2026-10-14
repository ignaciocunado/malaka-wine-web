import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/(auth)/actions";
import { auth } from "@/auth";
import { CancelSubscription } from "@/components/account/cancel-subscription";
import { PlanPicker } from "@/components/account/plan-picker";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { GroupedSection, ListRow, rowSeparator } from "@/components/ui/grouped-list";
import { ChevronRightIcon } from "@/components/ui/icons";
import { ApiError, api } from "@/lib/api";
import { FALLBACK_PLANS } from "@/lib/catalog";
import { formatDate, formatEuros } from "@/lib/format";
import { SWEETNESS_OPTIONS, WINE_STYLE_OPTIONS, labelOf, labelsOf, recommendedPlan } from "@/lib/taste";

export const metadata: Metadata = { title: "Tu cuenta" };

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  // proxy.ts already guards this route; checking here too keeps the page safe on its own.
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account");
  const { plan: requestedPlan } = await searchParams;

  let data;
  try {
    const [subscription, tasteProfile, plans] = await Promise.all([
      api.subscription(session.accessToken),
      api.tasteProfile(session.accessToken),
      api.plans().catch(() => FALLBACK_PLANS),
    ]);
    data = { subscription, tasteProfile, plans };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login?callbackUrl=/account");
    return (
      <AccountShell name={session.user.name}>
        <Alert>No hemos podido conectar con nuestros servidores. Vuelve a cargar la página en un momento.</Alert>
      </AccountShell>
    );
  }

  const { subscription, tasteProfile, plans } = data;
  const preselected =
    (typeof requestedPlan === "string" && plans.some((p) => p.code === requestedPlan) && requestedPlan) ||
    subscription?.planCode ||
    (tasteProfile && recommendedPlan(tasteProfile)) ||
    plans.find((p) => p.featured)?.code ||
    plans[0]?.code;

  return (
    <AccountShell name={session.user.name}>
      <GroupedSection header="Suscripción">
        {subscription ? (
          <>
            <ListRow label="Plan">
              <span className="text-label-secondary">{subscription.planName}</span>
            </ListRow>
            <ListRow label="Precio">
              <span className="text-label-secondary">{formatEuros(subscription.priceCents)} / mes</span>
            </ListRow>
            {subscription.nextBoxDate && (
              <ListRow label="Próxima caja">
                <span className="text-label-secondary">{formatDate(subscription.nextBoxDate)}</span>
              </ListRow>
            )}
          </>
        ) : (
          <ListRow>
            <span className="text-label-secondary">Todavía no tienes una suscripción activa.</span>
          </ListRow>
        )}
      </GroupedSection>

      <GroupedSection
        header={subscription ? "Cambiar de plan" : "Elige tu plan"}
        footer="Esta versión aún no incluye pagos: suscribirse es gratis mientras terminamos de construirla."
      >
        <PlanPicker plans={plans} currentPlan={subscription?.planCode} defaultPlan={preselected} />
      </GroupedSection>

      <GroupedSection header="Perfil de gustos">
        {tasteProfile ? (
          <>
            <ListRow label="Estilos">
              <span className="text-right text-label-secondary">
                {labelsOf(WINE_STYLE_OPTIONS, tasteProfile.wineStyles)}
              </span>
            </ListRow>
            <ListRow label="Dulzor">
              <span className="text-label-secondary">{labelOf(SWEETNESS_OPTIONS, tasteProfile.wineSweetness)}</span>
            </ListRow>
            <ListRow label="Presupuesto">
              <span className="text-label-secondary">
                {formatEuros(tasteProfile.monthlyBudgetEur * 100)} por caja
              </span>
            </ListRow>
            <TasteLink>Actualizar perfil de gustos</TasteLink>
          </>
        ) : (
          <TasteLink>Hacer el test de gustos</TasteLink>
        )}
      </GroupedSection>

      <GroupedSection header="Cuenta">
        <ListRow label="Correo">
          <span className="truncate text-label-secondary">{session.user.email}</span>
        </ListRow>
      </GroupedSection>

      <div className="flex flex-col items-center gap-4 pt-2">
        {subscription && <CancelSubscription />}
        <form action={logout}>
          <Button type="submit" variant="gray">
            Cerrar sesión
          </Button>
        </form>
      </div>
    </AccountShell>
  );
}

function AccountShell({ name, children }: { name?: string | null; children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-3.25rem)] bg-grouped px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="px-4">
          <h1 className="text-large-title">Hola{name ? `, ${name}` : ""}.</h1>
          <p className="mt-2 text-body text-label-secondary">Tu caja, tus gustos y tu cuenta.</p>
        </header>
        {children}
      </div>
    </div>
  );
}

function TasteLink({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/taste"
      className={cn(rowSeparator, "flex min-h-11 items-center justify-between px-4 py-2.5 text-body text-tint")}
    >
      {children}
      <ChevronRightIcon className="size-4 text-label-tertiary" />
    </Link>
  );
}
