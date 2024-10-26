// ./app/page.tsx
import ClientComponent from "@/components/ClientComponent";
import { fetchAccessToken } from "hume";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
export default async function Page() {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
  });

  if (!accessToken) {
    throw new Error();
  }

  return (
    <BackgroundBeamsWithCollision className="custom-beam-styles">
      <ClientComponent accessToken={accessToken} />
    </BackgroundBeamsWithCollision>
  );
}
