// Sceau de la Maison — reprend le monogramme réel (double cercle, Tour
// Métallique en ligne, "AG") fourni par Laurent, en SVG vectoriel pour
// pouvoir l'utiliser à n'importe quelle taille (cartes produit, en-tête,
// pied de page) sans fichier image.

type Props = {
  taille?: number;
  couleur?: string;
};

export default function Sceau({ taille = 64, couleur = "currentColor" }: Props) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 200 200"
      fill="none"
      stroke={couleur}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="93" strokeWidth="4" />
      <circle cx="100" cy="100" r="85" strokeWidth="1.2" />

      <circle cx="100" cy="40" r="3.4" fill={couleur} stroke="none" />
      <line x1="100" y1="43.5" x2="100" y2="57" strokeWidth="2.4" />

      <path
        d="M91 57 H109 L115 89 H85 Z M85 89 H115 L122 123 H78 Z M78 123 H122 L131 157 H69 Z"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M91 57 L115 89 M109 57 L85 89 M85 89 L115 123 M115 89 L85 123 M78 123 L122 157 M122 123 L78 157"
        strokeWidth="1.3"
      />
      <path d="M69 157 H131 M57 157 Q57 139 77 139 M143 157 Q143 139 123 139" strokeWidth="2.2" />
      <line x1="50" y1="157" x2="150" y2="157" strokeWidth="2.6" />

      <text
        x="100"
        y="182"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontWeight={700}
        fontSize="25"
        letterSpacing="1"
        fill={couleur}
        stroke="none"
      >
        AG
      </text>
    </svg>
  );
}
