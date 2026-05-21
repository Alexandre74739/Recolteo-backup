import Reveal from "@/src/components/animations/Reveal";
import Btn from "@/src/components/ui/primitives/Button";

export default function Panier() {
  const selectedProducts = [] as {
  id: number;
  title: string;
  vendor: string;
  quantity: number;
  pickup: string;
  price: number;
  category: string;
}[];

  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);

  if (selectedProducts.length === 0) {
    return (
      <Reveal>
        <div className="min-h-screen flex flex-col gap-3 px-4 text-sapin">
          <h2>Mon panier</h2>
          <p className="text-center">Votre panier est vide.</p>
          <div className="mt-2 justify-center flex">
            <Btn
              label="Continuer mes achats"
              href="/lots"
              variant="sapin"
              size="md"
              showArrow={true}
            />
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <div className="min-h-screen flex flex-col gap-6 px-4 py-6 text-sapin">
        <div className="flex flex-col gap-3">
          <h2 className="text-start text-3xl font-black">Mon panier</h2>
          <p className="text-sapin/70">Vérifiez vos produits sélectionnés et finalisez votre commande.</p>
        </div>

        <div className="flex flex-row w-full gap-6">
          <div className="w-[70%] rounded-[2rem] border border-sapin/10 bg-white/80 p-6 shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Éléments sélectionnés</h3>
              <span className="text-sm text-sapin/60">{selectedProducts.length} articles</span>
            </div>

            <div className="space-y-4">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl border border-sapin/10 bg-sapin/5 p-5 shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)]"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-full bg-lime/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-sapin">
                        {product.category}
                      </span>
                      <h4 className="mt-3 text-lg font-black text-sapin truncate">{product.title}</h4>
                      <p className="mt-1 text-sm text-sapin/70">{product.vendor}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-sm text-sapin/70">Quantité</p>
                        <p className="text-base font-semibold text-sapin">{product.quantity} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-sapin/70">Prix</p>
                        <p className="text-base font-black text-peach">
                          {product.price.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-sapin/60">Point de récupération : {product.pickup}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-[30%] rounded-[2rem] border border-sapin/10 bg-sapin/5 p-6 shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)]">
            <div className="mb-6">
              <h3 className="text-xl font-bold">Récapitulatif</h3>
              <p className="mt-2 text-sm text-sapin/70">Vérifiez le montant total et passez à la validation.</p>
            </div>

            <div className="space-y-4 rounded-3xl bg-white p-5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between text-sapin/70">
                <span>Articles</span>
                <span>{selectedProducts.length}</span>
              </div>
              <div className="flex justify-between text-sapin/70">
                <span>Frais de service</span>
                <span>Gratuit</span>
              </div>
              <div className="border-t border-sapin/10 pt-4 flex justify-between text-base font-bold text-sapin">
                <span>Total</span>
                <span>
                  {totalPrice.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Btn label="Payer" href="#" variant="sapin" size="md" />
              <p className="text-sm text-sapin/70">
                Le paiement se fera dans l’interface sécurisée après validation de la commande.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Reveal>
  );
}
