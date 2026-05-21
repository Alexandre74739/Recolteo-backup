import { Repeat } from "@deemlol/next-icons";
import Btn from "@/src/components/ui/primitives/Button";
import CatalogueDecorations from "@/src/components/illustrations/CatalogueDecorations";
import Reveal from "@/src/components/animations/Reveal";

type PanierItem = {
  id: number;
  title: string;
  vendor: string;
  quantity: number;
  pickup: string;
  price: number;
  category: string;
};

const selectedProducts: PanierItem[] = [];

const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);

export default function Panier() {
  if (selectedProducts.length === 0) {
    return (
      <main>
        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
          <CatalogueDecorations />
          <Reveal>
            <div className="relative z-10 text-center max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-lime border border-sapin shadow-[4px_4px_0_0_#06573F] flex items-center justify-center mx-auto mb-8">
                <Repeat size={32} className="text-sapin" />
              </div>
              <h1 className="text-sapin font-black text-3xl mb-3">
                Panier vide
              </h1>
              <p className="text-sapin/60 mb-8 leading-relaxed">
                Vous n'avez encore rien sélectionné. Parcourez les lots
                disponibles et ajoutez ceux dont votre association a besoin.
              </p>
              <Btn
                label="Explorer les lots"
                href="/lots"
                variant="sapin"
                className="justify-center"
              />
            </div>
          </Reveal>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <CatalogueDecorations />

        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal delay={0.1}>
            <div className="mb-12">
              <h1 className="text-sapin font-black mb-2">
                Mon{" "}
                <span className="relative italic whitespace-nowrap">
                  <span
                    className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                    aria-hidden="true"
                  />
                  <span className="relative">panier</span>
                </span>
              </h1>
              <p className="text-sapin/70">
                Vérifiez vos lots sélectionnés avant de finaliser votre demande.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <Reveal delay={0.2}>
                <div className="bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-sapin/8 flex items-center justify-between">
                    <h2 className="font-bold text-sapin">Lots sélectionnés</h2>
                    <span className="text-xs font-semibold text-sapin/40 uppercase tracking-widest">
                      {selectedProducts.length} lot
                      {selectedProducts.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="divide-y divide-sapin/6">
                    {selectedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-lime/30 text-sapin border border-lime/50 leading-tight mb-2">
                            {product.category}
                          </span>
                          <h3 className="font-black text-sapin text-sm lg:text-base truncate">
                            {product.title}
                          </h3>
                          <p className="text-xs text-sapin/50 mt-0.5">
                            {product.vendor}
                          </p>
                          <p className="text-xs text-sapin/40 mt-2">
                            Récupération : {product.pickup}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <span className="block text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-0.5">
                              Volume
                            </span>
                            <span className="block text-sm font-semibold text-sapin">
                              {product.quantity} kg
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-0.5">
                              Valeur
                            </span>
                            <span className="block text-sm font-black text-peach whitespace-nowrap">
                              {product.price.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <aside className="lg:w-72 shrink-0">
              <Reveal delay={0.3}>
                <div className="bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)] p-6 sticky top-20">
                  <h2 className="font-bold text-sapin mb-4">Récapitulatif</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-sapin/60">Lots</span>
                      <span className="font-semibold text-sapin">
                        {selectedProducts.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-sapin/60">Frais de service</span>
                      <span className="font-semibold text-sapin">Gratuit</span>
                    </div>
                    <div className="h-px bg-sapin/8" />
                    <div className="flex justify-between">
                      <span className="font-bold text-sapin">Total estimé</span>
                      <span className="font-black text-peach">
                        {totalPrice.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                    </div>
                  </div>

                  <Btn
                    label="Valider ma demande"
                    href="#"
                    variant="sapin"
                    className="w-full justify-center"
                  />
                  <p className="text-xs text-sapin/40 mt-3 text-center leading-relaxed">
                    La validation envoie une demande au commerçant concerné.
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
