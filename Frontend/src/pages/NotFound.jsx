import { Link } from "react-router-dom";
import SlantButton from "@/components/common/SlantButton";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="space-y-6">
        <p className="font-display text-6xl">404</p>
        <p className="text-muted-foreground">That page doesn't exist.</p>
        <SlantButton as={Link} to="/" accent="red">
          Back home
        </SlantButton>
      </div>
    </main>
  );
}
