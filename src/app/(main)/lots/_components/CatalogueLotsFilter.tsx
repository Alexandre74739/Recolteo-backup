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
import StepSlider from "@/src/components/ui/primitives/StepSlider";
import FilterPart from "@/src/components/ui/parts/FilterPart";
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
          <FilterPart
            icon={<MapPin size={20} />}
            title={radiusTitle}
            subtitle={radiusDescription}
            isActive={applyRadius}
          >
            <RadiusSlider
              value={radiusIndex}
              onChange={setRadiusIndex}
              withOff
              disabled={!canUseRadius}
            />
          </FilterPart>

          <FilterPart
            icon={<Calendar size={20} />}
            title={dateTitle}
            subtitle={dateDescription}
            isActive={isDateFiltered}
          >
            <StepSlider
              steps={DATE_STEPS}
              value={dateIndex}
              onChange={setDateIndex}
              label="Période de parution"
            />
          </FilterPart>
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
