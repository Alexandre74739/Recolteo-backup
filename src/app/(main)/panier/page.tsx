"use client";

import { useState } from "react";
import { useCart } from "@/src/lib/cart-context";
import CartEmpty from "./_components/CartEmpty";
import CartSection from "./_components/CartSection";
import ReservationModal from "./_components/ReservationModal";

export default function Panier() {
  const { items, removeFromCart, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const totalPrice = items.reduce((sum, item) => sum + item.montant_chiffre, 0);

  if (items.length === 0) {
    return (
      <main>
        <CartEmpty
          title="Panier vide"
          description="Vous n'avez encore rien sélectionné. Parcourez les lots disponibles et ajoutez ceux dont votre association a besoin."
          btnLabel="Explorer les lots"
          btnHref="/lots"
        />
      </main>
    );
  }

  return (
    <main>
      <CartSection
        titlePrefix="Mon"
        titleHighlight="panier"
        subtitle="Vérifiez vos lots sélectionnés avant de finaliser votre demande."
        items={items}
        totalPrice={totalPrice}
        onReserver={() => setShowModal(true)}
        onRemove={removeFromCart}
      />

      {showModal && (
        <ReservationModal
          items={items}
          onClose={() => setShowModal(false)}
          onSuccess={clearCart}
        />
      )}
    </main>
  );
}
