import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { geocodeAddress } from "@/src/lib/geocode";
import Hero from "@/src/components/sections/Hero";
import CatalogueLots, {
  type Lot,
} from "./_components/CatalogueLots";
import GestionLots from "@/src/components/sections/GestionLots";

const LOT_FIELDS =
  "id_lot, name_entreprise, adresse, adresse_recup, instructions, category, nature, quantity, dlc, montant_chiffre, montant_lettre, created_at, lat, lng";

export default async function LotPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();

  const [adminResult, commercantResult] = await Promise.all([
    supabase.from("administrateur").select("id_admin").maybeSingle(),
    userRow
      ? supabase
        .from("commercant")
        .select("id_commercant")
        .eq("id_user", userRow.id_user)
        .eq("is_validated", true)
        .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const isAdmin = !!adminResult.data;
  const isCommercant = !!commercantResult.data;

  if (isCommercant && !isAdmin) {
    const { data: lotsData } = await supabase
      .from("lot")
      .select(LOT_FIELDS)
      .eq("statut", true)
      .eq("id_commercant", commercantResult.data!.id_commercant)
      .order("created_at", { ascending: false });

    return (
      <main>
        <Hero
          title=""
          subtitle="Gérez"
          labelTitle="vos lots"
          spanTitle="facilement"
          endTitle="sur Récoltéo"
          description="Déclarez vos invendus et mettez-les à disposition des associations partenaires en quelques clics."
          primaryButton="Déclarer un lot"
          primaryButtonHref="/lots/declarer-lot"
          secondaryButton="Mon profil"
          secondaryButtonHref="/profil"
        />
        <GestionLots lots={(lotsData ?? []) as Lot[]} />
      </main>
    );
  }

  const { data: lotsData } = await supabase
    .from("lot")
    .select(LOT_FIELDS)
    .eq("statut", true)
    .order("created_at", { ascending: false });

  const lots = (lotsData ?? []) as Lot[];

  let assoCoords: { lat: number; lng: number } | null = null;
  if (!isAdmin && userRow) {
    const { data: assoRow } = await supabase
      .from("association")
      .select("lat, lng, adresse")
      .eq("id_user", userRow.id_user)
      .maybeSingle();

    if (assoRow) {
      if (assoRow.lat && assoRow.lng) {
        assoCoords = { lat: assoRow.lat, lng: assoRow.lng };
      } else if (assoRow.adresse) {
        const coords = await geocodeAddress(assoRow.adresse);
        if (coords) {
          assoCoords = coords;
          const admin = createAdminClient();
          await admin
            .from("association")
            .update({ lat: coords.lat, lng: coords.lng })
            .eq("id_user", userRow.id_user);
        }
      }
    }
  }

  if (isAdmin) {
    return (
      <main>
        <Hero
          title=""
          subtitle="Gérez"
          labelTitle="tous les lots"
          spanTitle="facilement"
          endTitle="sur Récoltéo"
          description="Vue complète de tous les lots actifs de la plateforme. Déclarez, modifiez ou supprimez n'importe quel lot."
          primaryButton="Déclarer un lot"
          primaryButtonHref="/lots/declarer-lot"
          secondaryButton="Contactez-nous"
          secondaryButtonHref="/contact"
        />
        <GestionLots lots={lots} adminView />
      </main>
    );
  }

  return (
    <main>
      <Hero
        title=""
        subtitle="Découvrez"
        labelTitle="les lots"
        spanTitle="disponibles"
        endTitle="près de chez vous"
        description="Parcourez les lots mis à disposition par nos commerçants partenaires et réservez ceux dont votre association a besoin."
        primaryButton="Voir les lots disponibles"
        primaryButtonHref="#lots"
        secondaryButton="Contactez-nous"
        secondaryButtonHref="/contact"
      />
      <CatalogueLots
        lots={lots}
        showCartButton
        assoCoords={assoCoords}
        sectionTitle="Lots"
        sectionHighlight="disponibles"
        description="Découvrez les invendus et ressources mis à disposition par nos commerçants partenaires. Chaque lot est une opportunité de lutter contre le gaspillage et de soutenir votre activité associative."
        emptyTitle="Aucun lot disponible pour le moment"
        emptySubtitle="Revenez prochainement, de nouveaux lots sont ajoutés régulièrement."
        filterTitle="Affinez votre recherche"
        filterDescription="Les filtres sont à votre disposition : recherchez autour de vous, par date de parution, ou par catégorie de produits. Essayez différentes combinaisons pour trouver les lots qui correspondent le mieux à vos besoins."
        filterRadiusTitle="Par proximité"
        filterRadiusDescription="Filtrez les lots selon la distance autour de vous."
        filterDateTitle="Par date de parution"
        filterDateDescription="Affichez les lots publiés sur une période précise."
        filterEmptyTitle="Aucun lot ne correspond à vos filtres"
        filterEmptySubtitle="Essayez d'élargir le rayon ou de changer la période."
      />
    </main>
  );
}
