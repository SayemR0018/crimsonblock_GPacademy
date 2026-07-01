import { createFileRoute } from "@tanstack/react-router";
import brickImg from "@/assets/brick.png";
import { Header } from "@/components/crimson/Header";
import { Hero } from "@/components/crimson/Hero";
import { SpecsScroll } from "@/components/crimson/SpecsScroll";
import { BrickRunner } from "@/components/crimson/BrickRunner";
import { Checkout } from "@/components/crimson/Checkout";
import { Footer } from "@/components/crimson/Footer";

const productJsonLd = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "The Crimson Block",
  description:
    "The ultimate foundation, redefined. An ultra-exclusive, hand-fired luxury red brick — sold as a monument, not a material.",
  brand: { "@type": "Brand", name: "The Crimson Block" },
  image: brickImg,
  offers: {
    "@type": "Offer",
    priceCurrency: "BDT",
    price: "9999",
    availability: "https://schema.org/InStock",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Crimson Block — The Ultimate Foundation. Redefined." },
      {
        name: "description",
        content:
          "An ultra-exclusive luxury red brick. Play the arcade to unlock a discount code, then acquire yours in one frictionless checkout.",
      },
      { property: "og:title", content: "The Crimson Block — The Ultimate Foundation. Redefined." },
      {
        property: "og:description",
        content:
          "One brick. Numbered, hand-fired, sold as a monument. Play the arcade, earn your code, secure your block.",
      },
      { property: "og:image", content: brickImg },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Crimson Block" },
      {
        name: "twitter:description",
        content: "The ultimate foundation, redefined. An ultra-exclusive luxury red brick.",
      },
      { name: "twitter:image", content: brickImg },
      { name: "theme-color", content: "#07070a" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(productJsonLd),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-obsidian text-bone">
      <Header />
      <main>
        <Hero />
        <SpecsScroll />
        <BrickRunner />
        <Checkout />
      </main>
      <Footer />
    </div>
  );
}
