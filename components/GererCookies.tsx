"use client";

import { EVENEMENT_OUVRIR_COOKIES } from "@/lib/cookies";

// Lien du pied de page qui rouvre le bandeau pour changer son choix.
export default function GererCookies({ style }: { style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EVENEMENT_OUVRIR_COOKIES))}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontFamily: "inherit",
        ...style,
      }}
    >
      Gérer les cookies
    </button>
  );
}
