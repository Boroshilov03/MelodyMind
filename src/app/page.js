// ./app/page.tsx
import ClientComponent from "@/components/ClientComponent";
import { fetchAccessToken } from "hume";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FloatingNav } from "@/components/ui/floating-navbar";

export default async function Page() {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
  });

  if (!accessToken) {
    return <div>Error fetching access token.</div>; // Handle error gracefully
  }

  // Define your nav items
  const navItems = [
    { name: "About", link: "/home" },
    { name: "Home", link: "/" },
    { name: "Songs", link: "/recs" },
  ];

  return (
    <BackgroundBeamsWithCollision className="custom-beam-styles">
      <FloatingNav navItems={navItems} />
      <ClientComponent accessToken={accessToken} />
    </BackgroundBeamsWithCollision>
  );
}
