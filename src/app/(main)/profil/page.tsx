import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import ProfilDecorations from "./_components/ProfilDecorations";
import ProfilLayout from "./_components/ProfilLayout";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <ProfilDecorations />
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {children}
      </div>
    </main>
  );
}

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("nom, prenom")
    .maybeSingle();

  if (adminRow) {
    return (
      <PageShell>
        <ProfilLayout
          nom={`${adminRow.prenom} ${adminRow.nom}`}
          role="admin"
          authId={user.id}
          entityInfo={{ role: "admin", nom: adminRow.nom, prenom: adminRow.prenom }}
        />
      </PageShell>
    );
  }

  const { data: userRow } = await supabase
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (!userRow) redirect("/");

  const [{ data: commercant }, { data: association }] = await Promise.all([
    supabase
      .from("commercant")
      .select("name_entreprise, email, tel, siret, type_activity, forme_juridique, adresse, code_postal")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
    supabase
      .from("association")
      .select("name_entreprise, email, tel, rna, type_asso, adresse, code_postal")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
  ]);

  if (commercant) {
    return (
      <PageShell>
        <ProfilLayout
          nom={commercant.name_entreprise}
          role="commercant"
          authId={user.id}
          entityInfo={{ role: "commercant", ...commercant }}
        />
      </PageShell>
    );
  }

  if (association) {
    const admin = createAdminClient();
    const { data: assocRow } = await admin
      .from("association")
      .select("id_association, cagnotte_reset_at")
      .eq("id_user", userRow.id_user)
      .maybeSingle();

    let cagnotte = 0;
    if (assocRow) {
      const { data: collects } = await admin
        .from("collect")
        .select("code_valide_at, lot:id_lot(montant_chiffre)")
        .eq("id_association", assocRow.id_association)
        .eq("statut", true);
      const resetAt = assocRow.cagnotte_reset_at;
      cagnotte = (collects ?? []).reduce((sum, c) => {
        const validatedAt = (c as { code_valide_at?: string | null }).code_valide_at ?? null;
        if (resetAt && validatedAt && validatedAt <= resetAt) return sum;
        return sum + (((c.lot as unknown as { montant_chiffre: number } | null)?.montant_chiffre ?? 0) * 0.02);
      }, 0);
    }

    return (
      <PageShell>
        <ProfilLayout
          nom={association.name_entreprise}
          role="association"
          authId={user.id}
          entityInfo={{ role: "association", ...association, cagnotte }}
        />
      </PageShell>
    );
  }

  redirect("/");
}
