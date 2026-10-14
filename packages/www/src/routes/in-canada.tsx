import { createFileRoute } from "@tanstack/react-router";
import InCanadaApp from "../app/in-canada/InCanadaApp";
import { useOwnerAllowlist } from "../app/in-canada/useOwnerAllowlist";
import AuthGate, { signedInEmail } from "../lib/AuthGate";
import { useAuth } from "../lib/useAuth";

export const Route = createFileRoute("/in-canada")({
  head: () => ({
    meta: [
      { title: "In-Canada Days Counter | Developer Sam" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CanadaPage,
});

function CanadaPage(): React.JSX.Element {
  const auth = useAuth();
  const access = useOwnerAllowlist(signedInEmail(auth));
  return (
    <AuthGate
      title="In-Canada"
      signedOutPrompt="Sign in to view the counter."
      deniedMessage="This app is restricted to its owner."
      auth={auth}
      access={access}
    >
      <InCanadaApp />
    </AuthGate>
  );
}
