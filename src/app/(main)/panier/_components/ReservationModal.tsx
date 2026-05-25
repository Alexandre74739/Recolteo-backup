"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  Copy,
  Check,
  X,
} from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";
import { reserverLots, type ReservationCode } from "../actions";
import type { Lot } from "@/src/components/ui/cards/LotCard";

const TIME_SLOTS = [
  { label: "6h00 - 8h00", value: "06:00" },
  { label: "8h00 - 10h00", value: "08:00" },
  { label: "10h00 - 12h00", value: "10:00" },
  { label: "12h00 - 14h00", value: "12:00" },
  { label: "14h00 - 16h00", value: "14:00" },
  { label: "16h00 - 18h00", value: "16:00" },
  { label: "18h00 - 20h00", value: "18:00" },
];

interface ReservationModalProps {
  items: Lot[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReservationModal({
  items,
  onClose,
  onSuccess,
}: ReservationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    codes: ReservationCode[];
    creneau: string;
    emailErrors?: string[];
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const today = new Date();
  const minStr = today.toISOString().split("T")[0];
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);
  const maxStr = maxDate.toISOString().split("T")[0];

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function handleSubmit() {
    if (!selectedDate || !selectedSlot) {
      setError("Veuillez sélectionner une date et un créneau.");
      return;
    }
    setError("");
    const creneauIso = `${selectedDate}T${selectedSlot}:00`;
    startTransition(async () => {
      const res = await reserverLots(
        items.map((i) => i.id_lot),
        creneauIso,
      );
      if (res.success) {
        setResult({
          codes: res.codes,
          creneau: res.creneau,
          emailErrors: res.emailErrors,
        });
      } else {
        setError(res.error);
      }
    });
  }

  if (result) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onSuccess}
      >
        <div className="absolute inset-0 bg-cream/90 backdrop-blur-sm" />
        <div
          className="relative z-10 w-full max-w-lg bg-white rounded-2xl border-2 border-sapin/10 shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_15%,transparent)] overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-lime/30 border-b border-lime/40 px-6 py-5 flex items-start justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-lime border border-lime/50 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-sapin" />
              </div>
              <div>
                <h3 className="font-black text-sapin text-sm">
                  Réservation confirmée !
                </h3>
                <p className="text-sapin/50 text-xs mt-0.5">
                  {result?.emailErrors?.length
                    ? "Réservation enregistrée : problème d'envoi email"
                    : "Emails de confirmation envoyés aux deux parties"}
                </p>
              </div>
            </div>
            <button
              onClick={onSuccess}
              className="p-1 rounded-lg text-sapin/40 hover:text-sapin hover:bg-sapin/6 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 flex-1">
            <div className="bg-sapin/4 border border-sapin/10 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-bold text-sapin/50 uppercase tracking-widest mb-1">
                Créneau de récupération
              </p>
              <p className="text-sm font-semibold text-sapin capitalize">
                {result.creneau}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {result.codes.map(
                ({ id_lot, nature, name_entreprise, adresse_recup, code }) => (
                  <div
                    key={id_lot}
                    className="border border-sapin/10 rounded-xl p-4"
                  >
                    <p className="text-xs font-bold text-sapin/50 uppercase tracking-widest mb-1">
                      Vos codes de retrait
                    </p>
                    <div className="mb-3">
                      <p className="font-semibold text-sapin text-sm">
                        {nature}
                      </p>
                      <p className="text-sapin/50 text-xs mt-0.5">
                        {name_entreprise} · {adresse_recup}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-sapin rounded-xl px-4 py-3">
                        <p className="font-black text-lime text-2xl tracking-[0.3em] text-center">
                          {code}
                        </p>
                      </div>
                      <button
                        onClick={() => copyCode(code)}
                        title="Copier le code"
                        className="p-2.5 rounded-xl border border-sapin/15 text-sapin/50 hover:text-sapin hover:bg-sapin/6 transition-colors shrink-0"
                      >
                        {copiedCode === code ? (
                          <Check size={20} className="text-lime" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>

            {result.emailErrors?.length ? (
              <div className="mt-5 bg-sapin/4 border border-sapin/10 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-sapin/70 mb-1">
                  Email de confirmation non reçu ?
                </p>
                <p className="text-xs text-sapin/60 leading-relaxed">
                  Pas d'inquiétude, votre réservation est bien enregistrée
                  et vos codes de retrait ci-dessus sont valides. Conservez-les
                  précieusement pour récupérer vos lots.
                </p>
                <p className="text-xs text-sapin/50 mt-2">
                  Un problème ou une question ?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-sapin underline underline-offset-2 hover:text-sapin/70 transition-colors"
                  >
                    Contactez un administrateur
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <p className="text-xs text-sapin/40 text-center mt-5 leading-relaxed">
                Un email de confirmation vous a été envoyé avec tous vos codes.
                <br />
                Présentez-les au commerçant lors du retrait.
              </p>
            )}
          </div>

          <div className="px-6 pb-5 shrink-0">
            <Button
              label="Fermer"
              onClick={onSuccess}
              variant="sapin"
              showArrow={false}
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={isPending ? undefined : onClose}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl border-2 border-sapin/10 shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_15%,transparent)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sapin/4 border-b border-sapin/8 px-6 py-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime border border-lime/50 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-sapin" />
            </div>
            <div>
              <h3 className="font-black text-sapin text-sm">
                Planifier la récupération
              </h3>
              <p className="text-sapin/50 text-xs mt-0.5">
                {items.length} lot{items.length > 1 ? "s" : ""} sélectionné
                {items.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1 rounded-lg text-sapin/40 hover:text-sapin hover:bg-sapin/6 transition-colors disabled:opacity-30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-sapin/50 uppercase tracking-widest mb-2">
              <Calendar size={12} />
              Date de récupération
            </label>
            <input
              type="date"
              min={minStr}
              max={maxStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={isPending}
              className="w-full border border-sapin/15 rounded-xl px-4 py-3 text-sm text-sapin font-medium focus:outline-none focus:border-sapin/40 focus:ring-2 focus:ring-sapin/10 disabled:opacity-50"
            />
            <p className="text-xs text-sapin/35 mt-1.5">
              Disponible jusqu'à 14 jours à l'avance
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-sapin/50 uppercase tracking-widest mb-2">
              <Clock size={12} />
              Créneau horaire
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  disabled={isPending}
                  onClick={() => setSelectedSlot(slot.value)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedSlot === slot.value
                      ? "bg-sapin text-cream border-sapin shadow-[2px_2px_0_0_#04251c]"
                      : "border-sapin/15 text-sapin hover:bg-sapin/6 hover:border-sapin/30"
                    } disabled:opacity-50`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-peach font-medium bg-peach/8 border border-peach/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button
            label="Annuler"
            onClick={onClose}
            disabled={isPending}
            variant="sapin-outline"
            size="sm"
            showArrow={false}
            className="flex-1 justify-center"
          />
          <Button
            label={isPending ? "Réservation…" : "Confirmer"}
            onClick={handleSubmit}
            disabled={isPending || !selectedDate || !selectedSlot}
            variant="sapin"
            size="sm"
            showArrow={false}
            className="flex-1 justify-center"
          />
        </div>
      </div>
    </div>
  );
}
