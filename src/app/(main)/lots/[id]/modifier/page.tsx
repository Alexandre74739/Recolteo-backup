import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import Hero from "@/src/components/sections/Hero";
import LotEditForm, { type LotEditData } from "./_components/LotEditForm";

export const metadata: Metadata = {
  title: "Modifier un lot — Récoltéo",
  description: "Mettez à jour les informations de votre lot sur Récoltéo.",
};

const LOT_EDIT_FIELDS =
  "id_lot, id_commercant, adresse_recup, category, nature, quantity, dlc, montant_chiffre, montant_lettre, instructions";

export default async function ModifierLotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lotId = parseInt(id, 10);
  if (isNaN(lotId)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [adminResult, commercantResult] = await Promise.all([
    supabase.from("administrateur").select("id_admin").maybeSingle(),
    supabase
      .from("commercant")
      .select("id_commercant")
      .eq("is_validated", true)
      .maybeSingle(),
  ]);

  if (!adminResult.data && !commercantResult.data) redirect("/");

  let lotQuery = supabase
    .from("lot")
    .select(LOT_EDIT_FIELDS)
    .eq("id_lot", lotId);
  if (commercantResult.data && !adminResult.data) {
    lotQuery = lotQuery.eq(
      "id_commercant",
      commercantResult.data.id_commercant,
    );
  }
  const { data: lot } = await lotQuery.maybeSingle();
  if (!lot) notFound();

  return (
    <main>
      <Hero
        title="Modifier"
        subtitle=""
        labelTitle="votre lot"
        spanTitle="facilement"
        endTitle="sur Récoltéo"
        description="Mettez à jour les informations de votre lot pour qu'il reste précis et accessible aux associations partenaires."
        primaryButton="Retour aux lots"
        primaryButtonHref="/lots"
        secondaryButton="Déclarer un nouveau lot"
        secondaryButtonHref="/lots/declarer-lot"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <LotEditForm lot={lot as LotEditData} />
      </div>
    </main>
  );
}
