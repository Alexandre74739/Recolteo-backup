"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar } from "@deemlol/next-icons";
import {
  readCookieConsent,
  CONSENT_CHANGE_EVENT,
} from "@/src/lib/cookie-consent";
import RadiusSlider, {
  RADIUS_STEPS,
} from "@/src/components/ui/primitives/RadiusSlider";
import CatalogueGrid from "@/src/components/sections/CatalogueGrid";
import type { Lot } from "@/src/components/ui/cards/LotCard";

type DateFilter = "all" | "today" | "week" | "month";

const DATE_STEPS = [
  "Toutes",
  "Aujourd'hui",
  "Cette semaine",
  "Ce mois",
] as const;
const DATE_FILTER_MAP: DateFilter[] = ["all", "today", "week", "month"];

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isWithinDays(dateStr: string, days: number): boolean {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return new Date(dateStr) >= cutoff;
}

interface Props {
  lots: Lot[];
  assoCoords: { lat: number; lng: number } | null;
  showCartButton?: boolean;
  title: string;
  description: string;
  radiusTitle: string;
  radiusDescription: string;
  dateTitle: string;
  dateDescription: string;
  emptyTitle: string;
  emptySubtitle: string;
}

export default function CatalogueLotsFilter({
  lots,
  assoCoords,
  showCartButton,
  title,
  description,
  radiusTitle,
  radiusDescription,
  dateTitle,
  dateDescription,
  emptyTitle,
  emptySubtitle,
}: Props) {
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [radiusIndex, setRadiusIndex] = useState(0);
  const [dateIndex, setDateIndex] = useState(0);

  useEffect(() => {
    const update = () => setGeoEnabled(readCookieConsent().geolocalisation);
    update();
    window.addEventListener(CONSENT_CHANGE_EVENT, update);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, update);
  }, []);

  const canUseRadius = geoEnabled && assoCoords !== null;
  const applyRadius = canUseRadius && radiusIndex > 0;
  const radiusKm = applyRadius ? RADIUS_STEPS[radiusIndex - 1] : null;

  const dateFilter = DATE_FILTER_MAP[dateIndex];
  const isDateFiltered = dateIndex > 0;
  const datePercent = (dateIndex / (DATE_STEPS.length - 1)) * 100;

  const filtered = lots.filter((lot) => {
    if (dateFilter === "today" && !isWithinDays(lot.created_at, 1))
      return false;
    if (dateFilter === "week" && !isWithinDays(lot.created_at, 7)) return false;
    if (dateFilter === "month" && !isWithinDays(lot.created_at, 30))
      return false;

    if (applyRadius && radiusKm !== null) {
      if (lot.lat == null || lot.lng == null) return false;
      const dist = haversineKm(
        assoCoords!.lat,
        assoCoords!.lng,
        lot.lat,
        lot.lng,
      );
      if (dist > radiusKm) return false;
    }

    return true;
  });

  const activeCount = (applyRadius ? 1 : 0) + (isDateFiltered ? 1 : 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-lime/5 border border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] px-6 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <h3 className="font-black text-sapin leading-tight">{title}</h3>
            {activeCount > 0 && (
              <span className="px-2.5 py-1 bg-sapin text-lime text-xs font-bold rounded-full leading-none">
                {activeCount} filtre{activeCount > 1 ? "s" : ""} actif
                {activeCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-sapin">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 border rounded-xl shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0 transition-colors ${
                  applyRadius
                    ? "bg-lime border-sapin text-sapin"
                    : "bg-lime/40 border-sapin/40 text-sapin/50"
                }`}
              >
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-sapin leading-tight">
                  {radiusTitle}
                </p>
                <p className="text-sapin/60 text-sm leading-snug mt-0.5">
                  {radiusDescription}
                </p>
              </div>
            </div>

            <RadiusSlider
              value={radiusIndex}
              onChange={setRadiusIndex}
              withOff
              disabled={!canUseRadius}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 border rounded-xl shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0 transition-colors ${
                  isDateFiltered
                    ? "bg-lime border-sapin text-sapin"
                    : "bg-lime/40 border-sapin/40 text-sapin/50"
                }`}
              >
                <Calendar size={18} />
              </div>
              <div>
                <p className="font-semibold text-sapin leading-tight">
                  {dateTitle}
                </p>
                <p className="text-sapin/60 text-sm leading-snug mt-0.5">
                  {dateDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-sapin">
                  Période de parution
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                    isDateFiltered
                      ? "text-sapin bg-lime/50 border-lime"
                      : "text-sapin/50 bg-sapin/8 border-sapin/20"
                  }`}
                >
                  {DATE_STEPS[dateIndex]}
                </span>
              </div>

              <div className="relative h-10 flex items-center select-none">
                <div className="absolute w-full h-1.5 bg-sapin/10 rounded-full" />
                <div
                  className={`absolute h-1.5 rounded-full transition-all duration-150 ${isDateFiltered ? "bg-sapin" : "bg-sapin/20"}`}
                  style={{ width: `${datePercent}%` }}
                />
                <div
                  className={`absolute w-5 h-5 rounded-full border-2 border-cream shadow-md -translate-x-1/2 transition-all duration-150 pointer-events-none ${
                    isDateFiltered ? "bg-sapin" : "bg-sapin/30"
                  }`}
                  style={{ left: `${datePercent}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={DATE_STEPS.length - 1}
                  step={1}
                  value={dateIndex}
                  onChange={(e) => setDateIndex(Number(e.target.value))}
                  className="absolute w-full h-10 opacity-0 cursor-pointer"
                  aria-label={`Période : ${DATE_STEPS[dateIndex]}`}
                />
              </div>

              <div className="flex justify-between">
                {DATE_STEPS.map((step, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-medium leading-none transition-colors ${
                      dateIndex === i ? "text-sapin font-bold" : "text-sapin/40"
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_6%,transparent)]">
          <p className="text-sapin font-semibold mb-2">{emptyTitle}</p>
          <span className="block text-sm text-sapin/60">{emptySubtitle}</span>
        </div>
      ) : (
        <CatalogueGrid lots={filtered} showCartButton={showCartButton} />
      )}
    </div>
  );
}
