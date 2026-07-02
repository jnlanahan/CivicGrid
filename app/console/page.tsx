import { ConsoleClient } from "@/components/console/ConsoleClient";

export const metadata = {
  title: "Signal Console · CivicGrid",
};

export default function ConsolePage() {
  return (
    <div className="mx-auto min-h-screen max-w-[1280px] bg-app sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-shell">
      <ConsoleClient />
    </div>
  );
}
