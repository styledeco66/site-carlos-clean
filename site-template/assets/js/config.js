/* assets/js/config.js */
window.SITE_CONFIG = {
  // IdentitÃ©
  brand: {
    name: "AE Mateus da Silva",
    tagline: "Professionnel & Réactif",
    profession: "Artisan / Pro",
    logoText: "LOGO",              // texte dans le logo si pas de SVG
    logoImage: "assets/icons/logo-1.webp", // optionnel (si tu veux afficher une image)
  },

  // Style (thÃ¨me dark + gold comme ton exemple)
  theme: {
    primary: "#F5B301",            // or/jaune bouton
    primaryHover: "#FFCC33",
    background: "#0B1220",         // fond gÃ©nÃ©ral
    cardBg: "rgba(20, 30, 55, 0.85)",
    text: "#FFFFFF",
    muted: "#C7CBD6",
  },

  // CoordonnÃ©es
  contact: {
    phoneDisplay: "06 59 13 66 31",
    phoneE164: "+33659136631",     // format tel: (important)
    email: "a.emateusdasilva@gmail.com",
    addressLine: "2 rond point du Cahot",
    city: "Condé-en-Brie",
    serviceAreas: [
      "Château-Thierry",
      "Condé-en-Brie",
      "Essômes-sur-Marne",
      "Étampes-sur-Marne",
      "Nogentel",
      "Chierry",
      "Brasles",
      "Courboin",
      "Montigny-lès-Condé",
      "Celles-lès-Condé",
      "Monthurel",
      "Vallées-en-Champagne"
    ]
  },

  // Contenu page (titres + sections)
  content: {
    hero: {
      title: "Votre artisan de confiance à Château-Thierry",
      subtitle: "Placo, parquet, maçonnerie à Château-Thierry, Condé-en-Brie et alentours",
      ctaPrimaryText: "Appeler",
      ctaNote: "Réponse rapide • Devis gratuit",
      introLogo: {
        enabled: false,
        image: "assets/icons/logo-1.webp",
        durationMs: 3000
      },
      // Image de fond hero
      heroImage: "assets/images/banniere-1.webp",
      heroImages: [
        "assets/images/banniere-1.webp",
        "assets/images/banniere-2.webp",
        "assets/images/banniere-3.webp",
        "assets/images/banniere-5.webp"
      ],
    },

    services: [
      { icon: "assets/icons/service-1.webp", title: "", photoTile: true, photoPositionY: "40%", alt: "R\u00E9alisation service 1" },
      { icon: "assets/icons/service-2.webp", title: "", photoTile: true, photoScale: 1, photoPositionX: "57%", photoPositionY: "80%", alt: "R\u00E9alisation service 2" },
      { icon: "assets/icons/service-5.webp", title: "", photoTile: true, photoScale: 1, photoPositionX: "45%", photoPositionY: "50%", alt: "R\u00E9alisation service 5" },
      { icon: "assets/icons/service-4.webp", title: "", photoTile: true, photoPositionY: "50%", alt: "R\u00E9alisation service 4" },
    ],

    gallery: {
      title: "Nos R\u00E9alisations",
      items: [
        { image: "assets/images/real-1.jpg", alt: "R\u00E9alisation 1" },
        { image: "assets/images/real-2.jpg", alt: "R\u00E9alisation 2" },
        { image: "assets/images/real-3.jpg", alt: "R\u00E9alisation 3" },
      ],
      moreButtonText: "Voir plus",
    },

    testimonials: {
      title: "Avis de Nos Clients",
      items: [
        {
          name: "M. Laurent",
          rating: 5,
          text: "Intervention rapide et chantier propre. Très satisfait du résultat.",
          avatar: ""
        },
        {
          name: "Mme Dubois",
          rating: 5,
          text: "Devis clair, délais respectés et équipe sérieuse. Je recommande.",
          avatar: ""
        },
        {
          name: "M. Bernard",
          rating: 5,
          text: "Travail soigné, bonne communication et finitions impeccables.",
          avatar: ""
        }
      ]
    },

    contactSection: {
      title: "Contactez-nous",
      // texte optionnel sous le formulaire
      note: "Intervention à Château-Thierry, Condé-en-Brie et communes voisines. Réponse rapide selon disponibilité."
    }
  },

  // Formulaire (remplace WhatsApp)
  form: {
    // Netlify Forms : nom du formulaire
    name: "demande",

    // Page aprÃ¨s envoi (merci.html)
    successRedirect: "/merci.html",

    // Options du select â€œbesoinâ€
    needOptions: [
      "Demande de devis",
      "Demande de rappel",
      "Renseignement",
      "Autre"
    ],

    // LibellÃ©s (si tu veux personnaliser)
    labels: {
      name: "Votre Nom",
      phone: "Téléphone",
      email: "Votre Email",
      need: "Votre demande",
      message: "Message",
      submit: "Envoyer"
    }
  },

  // SEO (simple, change rapide)
  seo: {
    title: "AE Mateus da Silva | Placo, parquet et maçonnerie à Château-Thierry, Condé-en-Brie et alentours",
    description: "Travaux de placo, parquet, maçonnerie, peinture, carrelage, réagréage, pose de cuisine et dressing à Château-Thierry, Condé-en-Brie, Essômes-sur-Marne, Étampes-sur-Marne, Nogentel, Chierry et communes voisines. Devis gratuit, intervention rapide.",
    url: "https://ton-site.netlify.app", // A remplacer dès que le nom de domaine final est connu
    ogImage: "assets/images/og-image.webp",
    serviceTypes: [
      "Placo",
      "Parquet",
      "Petits travaux de maçonnerie",
      "Peinture",
      "Carrelage",
      "Plafond dalle",
      "Réagréage",
      "Pose de cuisine",
      "Pose de dressing"
    ]
  },

  // CTA sticky mobile (WhatsApp supprimÃ©)
  stickyCta: {
    callText: "Appeler",
    quoteText: "Demande de devis" // ouvre/scroll vers formulaire
  }
};





