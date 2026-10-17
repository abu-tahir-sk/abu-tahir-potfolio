import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/portfolio/ContactSection";

export const metadata: Metadata = {
  title: "Get In Touch — Contact Abu Tahir Sk",
  description:
    "Contact Abu Tahir Sk regarding software development opportunities, freelance engineering, or full-stack web projects.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-12">
        <ContactSection settings={settings || undefined} />
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
