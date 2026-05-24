import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import AdminDecorations from "../_components/AdminDecorations";
import StructuresFiltre from "./_components/StructuresFiltre";
import type {
  StructureFilter,
  StructureCommercant,
  StructureAssociation,
  DocItem,
} from "./_components/types";

const VALID_FILTERS: StructureFilter[] = ["all", "commercant", "association"];

type RawDoc = {
  id_entity: number;
  rib: string | null;
  kbis: string | null;
  piece_identite: string | null;
};

function buildDocs(doc: RawDoc | undefined): DocItem[] {
  if (!doc) return [];
  const items: DocItem[] = [];
  if (doc.rib) items.push({ type: "rib", url: `/api/docs/admin?path=${encodeURIComponent(doc.rib)}` });
  if (doc.kbis) items.push({ type: "kbis", url: `/api/docs/admin?path=${encodeURIComponent(doc.kbis)}` });
  if (doc.piece_identite) items.push({ type: "identite", url: `/api/docs/admin?path=${encodeURIComponent(doc.piece_identite)}` });
  return items;
}

export default async function StructuresPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin")
    .maybeSingle();
  if (!adminRow) redirect("/");

  const admin = createAdminClient();

  const params = await searchParams;
  const filter: StructureFilter = VALID_FILTERS.includes(
    params.filter as StructureFilter,
  )
    ? (params.filter as StructureFilter)
    : "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * 10;
  const to = from + 10 - 1;

  const [commercantsResult, associationsResult] = await Promise.all([
    filter !== "association"
      ? admin
        .from("commercant")
        .select(
          "id_commercant, name_entreprise, email, tel, type_activity, forme_juridique, adresse, siret, statut_abonnement, created_at",
          { count: "exact" },
        )
        .eq("is_validated", true)
        .range(from, to)
        .order("created_at", { ascending: false })
      : admin
        .from("commercant")
        .select("id_commercant", { count: "exact", head: true }),
    filter !== "commercant"
      ? admin
        .from("association")
        .select(
          "id_association, name_entreprise, email, tel, type_asso, adresse, rna, statut_abonnement, created_at",
          { count: "exact" },
        )
        .eq("is_validated", true)
        .range(from, to)
        .order("created_at", { ascending: false })
      : admin
        .from("association")
        .select("id_association", { count: "exact", head: true }),
  ]);

  const commercantList =
    filter !== "association"
      ? ((commercantsResult.data ?? []) as Array<{ id_commercant: number }>)
      : [];
  const associationList =
    filter !== "commercant"
      ? ((associationsResult.data ?? []) as Array<{ id_association: number }>)
      : [];

  const commercantIds = commercantList.map((c) => c.id_commercant);
  const associationIds = associationList.map((a) => a.id_association);

  const [commercantDocsResult, associationDocsResult, assocCagnotteResult] = await Promise.all([
    commercantIds.length > 0
      ? admin
        .from("document")
        .select("id_entity, rib, kbis, piece_identite")
        .eq("type_entity", "commercant")
        .in("id_entity", commercantIds)
      : Promise.resolve({ data: [] as RawDoc[] }),
    associationIds.length > 0
      ? admin
        .from("document")
        .select("id_entity, rib, kbis, piece_identite")
        .eq("type_entity", "association")
        .in("id_entity", associationIds)
      : Promise.resolve({ data: [] as RawDoc[] }),
    associationIds.length > 0
      ? admin
        .from("collect")
        .select("id_association, lot:id_lot(montant_chiffre)")
        .eq("statut", true)
        .in("id_association", associationIds)
      : Promise.resolve({ data: [] as { id_association: number; lot: { montant_chiffre: number } | null }[] }),
  ]);

  const commercantDocMap = new Map<number, RawDoc>(
    (commercantDocsResult.data ?? []).map((d) => [d.id_entity, d as RawDoc]),
  );
  const associationDocMap = new Map<number, RawDoc>(
    (associationDocsResult.data ?? []).map((d) => [d.id_entity, d as RawDoc]),
  );

  const cagnotteMap = new Map<number, number>();
  for (const row of (assocCagnotteResult.data ?? [])) {
    const montant = (row.lot as { montant_chiffre: number } | null)?.montant_chiffre ?? 0;
    cagnotteMap.set(row.id_association, (cagnotteMap.get(row.id_association) ?? 0) + montant * 0.02);
  }

  const commercants: StructureCommercant[] = (
    commercantList as StructureCommercant[]
  ).map((c) => ({ ...c, docs: buildDocs(commercantDocMap.get(c.id_commercant)) }));

  const associations: StructureAssociation[] = (
    associationList as StructureAssociation[]
  ).map((a) => ({ ...a, docs: buildDocs(associationDocMap.get(a.id_association)), cagnotte: cagnotteMap.get(a.id_association) ?? 0 }));

  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <AdminDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StructuresFiltre
          commercants={commercants}
          commercantsTotal={commercantsResult.count ?? 0}
          associations={associations}
          associationsTotal={associationsResult.count ?? 0}
          filter={filter}
          page={page}
          pageSize={10}
        />
      </div>
    </main>
  );
}
