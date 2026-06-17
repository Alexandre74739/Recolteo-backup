import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CookieManager from "../components/ui/cookie/CookieManager";
import { createClient } from "@/src/lib/supabase/server";
import { CartProvider } from "@/src/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Récoltéo",
  description:
    "Connecte commerçants et associations pour une solidarité simple et rapide.",
};

async function HeaderWithAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <Header />;

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("nom, prenom")
    .maybeSingle();

  if (adminRow) {
    return <Header user={{ nom: `${adminRow.prenom} ${adminRow.nom}`, role: "admin" }} />;
  }

  const { data: userRow } = await supabase
    .from("user")
    .select("id_user, nom")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (!userRow) return <Header />;

  const [{ data: commercant }, { data: association }] = await Promise.all([
    supabase.from("commercant").select("name_entreprise").eq("id_user", userRow.id_user).maybeSingle(),
    supabase.from("association").select("name_entreprise").eq("id_user", userRow.id_user).maybeSingle(),
  ]);

  if (commercant) {
    return <Header user={{ nom: userRow.nom ?? commercant.name_entreprise, role: "commercant" }} />;
  }
  if (association) {
    return <Header user={{ nom: userRow.nom ?? association.name_entreprise, role: "association" }} />;
  }

  return <Header />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <CartProvider>
          <Suspense fallback={<Header />}>
            <HeaderWithAuth />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <CookieManager />
        </CartProvider>
      </body>
    </html>
  );
}
