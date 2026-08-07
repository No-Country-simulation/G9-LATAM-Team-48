import { monthsFull, monthsShort } from '../shared/monthsCalendar.js'

export const pagesFr = {
  "states": {
    "loading": "Chargement...",
    "loadingConsumo": "Chargement des données de consommation...",
    "loadingHistorial": "Chargement de l'historique...",
    "loadingRecomendaciones": "Chargement des recommandations...",
    "empty": "Aucune donnée à afficher.",
    "error": "Impossible de charger les données.",
    "retry": "Réessayer"
  },
  "dashboard": {
    "title": "Dashboard",
    "subtitle": "Hackathon ONE G9 - TEAM 48",
    "lastMonthUsage": "Consommation du dernier mois",
    "lastMonthCost": "Coût du dernier mois",
    "monthlyAverage": "Moyenne mensuelle"
  },
  "consumos": {
    "title": "Consommations énergétiques",
    "subtitle": "Détail mensuel de la consommation en kWh et du coût estimé.",
    "totalUsage": "Consommation totale",
    "totalCost": "Coût total",
    "monthlyAverage": "Moyenne mensuelle",
    "history": "Historique mensuel",
    "peak": "Pic de consommation",
    "month": "Mois",
    "usageKwh": "Consommation (kWh)",
    "estimatedCost": "Coût estimé",
    "status": "État",
    "aboveAverage": "Au-dessus de la moyenne",
    "normal": "Normal"
  },
  "chart": {
    "title": "Consommation énergétique mensuelle (kWh)",
    "actualVsPredicted": "Réel vs prévision (kWh)",
    "actualVsPredictedHint": "Mock pour Data Analysis : comparer la conso mesurée à la prévision du modèle.",
    "peakVsOffPeak": "Pointe vs heures creuses (kWh)",
    "peakVsOffPeakHint": "Mock pour Data Analysis : séparer la conso en heures de pointe et creuses.",
    "seriesActual": "Réel",
    "seriesPredicted": "Prévu",
    "seriesPeak": "Pointe",
    "seriesOffPeak": "Heures creuses",
    "axisMonth": "Mois",
    "axisKwh": "kWh",
    "confidence": "Confiance du modèle",
    "categories": {
      "LOW_CONSUMPTION": "Faible consommation",
      "MEDIUM_CONSUMPTION": "Consommation moyenne",
      "HIGH_CONSUMPTION": "Forte consommation"
    }
  },
  "analysis": {
    "title": "Analyse intelligente IA",
    "subtitle": "Évaluation de la consommation selon le type d'installation",
    "installationType": "Type d'installation",
    "types": {
      "APARTAMENTO": "Appartement",
      "CASA_UNIFAMILIAR": "Maison individuelle",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Petit établissement commercial"
    },
    "typeHints": {
      "APARTAMENTO": "Données de l'appartement pour estimer conso. par personne et clim.",
      "CASA_UNIFAMILIAR": "Données de la maison pour estimer conso. par personne et clim.",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Données du local pour estimer conso. par occupation, équipements et horaires."
    },
    "monthlyUsage": "Consommation mensuelle (kWh)",
    "people": "Nombre de personnes",
    "peopleCommercial": "Nombre de personnes (occupation)",
    "devices": "Nombre d'appareils",
    "homeArea": "Surface du logement (m²)",
    "climateHours": "Heures de climatisation par jour",
    "peakUseHours": "Heures d'usage intensif par jour",
    "peakHoursUse": "Peak hours",
    "shifts": "Équipes par jour",
    "machines": "Nombre de machines",
    "area": "Surface de l'usine (m²)",
    "hoursPerDay": "Heures d'exploitation par jour",
    "processIntensity": "Intensité du process",
    "hasCompressedAir": "Utilise de l'air comprimé ?",
    "lines": "Lignes de production",
    "operatingDays": "Jours d'exploitation par mois",
    "capacityPct": "Capacité utilisée (%)",
    "hasMonitoring": "A un monitoring énergétique / SCADA ?",
    "intensity": {
      "baja": "Faible",
      "media": "Moyenne",
      "alta": "Élevée"
    },
    "yesNo": {
      "yes": "Oui",
      "no": "Non"
    },
    "submit": "Analyser la consommation",
    "submitting": "Analyse...",
    "panelHint": "Renseignez les champs du type choisi et lancez l'analyse.",
    "result": "Résultat IA",
    "level": "Niveau",
    "estimatedSavings": "Économies estimées",
    "tips": "Conseils pour améliorer la consommation",
    "confidence": "Confiance du modèle",
    "sourceMl": "modèle entraîné",
    "sourceLocal": "règles locales",
    "failed": "Impossible de terminer l'analyse.",
    "loginRequired": "Connectez-vous ou inscrivez-vous pour recevoir le rapport d'analyse par e-mail.",
    "emailLoginHint": "Connectez-vous ou inscrivez-vous pour recevoir le rapport d'analyse par e-mail.",
    "loginCta": "Connexion / Inscription",
    "emailHint": "Nous enverrons l'analyse a",
    "emailPending": "Nous vous enverrons aussi cette analyse par e-mail sous peu.",
    "emailSent": "Nous vous avons envoye cette analyse par e-mail.",
    "chart": {
      "title": "Votre conso. vs référence",
      "hint": "La référence s’ajuste aux données du formulaire.",
      "empty": "Saisissez la consommation mensuelle pour voir le graphique.",
      "seriesYours": "Votre consommation",
      "seriesBenchmark": "Référence"
    },
    "levels": {
      "efficient": "Efficace",
      "moderate": "Modéré",
      "inefficient": "Inefficace"
    },
    "tipsList": {
      "led": "Utiliser un éclairage LED",
      "peak": "Réduire la conso. aux heures de pointe",
      "appliances": "Optimiser l'usage des appareils",
      "ac": "Réduire la climatisation",
      "replace": "Remplacer les équipements anciens",
      "night": "Surveiller la consommation nocturne",
      "keep": "Maintenir les habitudes actuelles",
      "monitor": "Continuer à surveiller la consommation",
      "insulation": "Améliorer l’isolation thermique du logement",
      "standby": "Couper le standby aux heures creuses",
      "solar": "Évaluer le solaire pour couvrir les pics",
      "shifts": "Décaler les processus intensifs hors pointe",
      "commercial": "Optimiser horaires et équipements du local commercial",
      "house": "Prioriser isolation et climatisation efficace à la maison",
      "apartment": "Profiter des espaces communs et réduire le standby en appartement",
      "default": "Prioriser éclairage LED et appareils à bonne efficacité énergétique",
      "motors": "Vérifier l'efficacité des moteurs et variateurs",
      "compressedAir": "Détecter les fuites d'air comprimé",
      "processHeat": "Récupérer la chaleur process ou isoler les fours",
      "loadBalancing": "Équilibrer la charge entre machines et équipes",
      "idleLines": "Arrêter ou mettre en veille les lignes inutilisées",
      "schedules": "Optimiser les plannings de production",
      "predictive": "Appliquer une maintenance prédictive",
      "scada": "Déployer ou étendre le monitoring / SCADA",
      "capacity": "Ajuster la production à la capacité réelle"
    }
  },
  "recommendations": {
    "title": "Recommandations IA",
    "subtitle": "Suggestions personnalisées pour optimiser la consommation.",
    "total": "Total des recommandations",
    "highPriority": "Priorité haute",
    "potentialSavings": "Économies potentielles cumulées",
    "estimatedSavings": "Économie estimée",
    "priority": {
      "high": "Haute",
      "medium": "Moyenne",
      "low": "Basse"
    },
    "category": {
      "lighting": "Éclairage",
      "habits": "Habitudes",
      "climate": "Climatisation",
      "equipment": "Équipement",
      "tech": "Technologie"
    },
    "items": {
      "1": {
        "title": "Remplacer l’éclairage traditionnel par des LED",
        "description": "Remplacer les ampoules à incandescence peut réduire jusqu’à 80 % de la consommation d’éclairage."
      },
      "2": {
        "title": "Réduire la consommation aux heures de pointe",
        "description": "Programmer les appareils hors de la plage 18:00–22:00 pour éviter les pics de demande."
      },
      "3": {
        "title": "Optimiser l’usage de la climatisation",
        "description": "Maintenir l’appareil entre 24 °C et 26 °C et utiliser le mode éco la nuit."
      },
      "4": {
        "title": "Évaluer les anciens appareils énergivores",
        "description": "Identifier réfrigérateurs, micro-ondes ou lave-linge de plus de 10 ans."
      },
      "5": {
        "title": "Débrancher les chargeurs en veille",
        "description": "Éviter la consommation fantôme en éteignant adaptateurs et appareils inutilisés."
      },
      "6": {
        "title": "Installer un thermostat intelligent",
        "description": "Automatiser chauffage et climatisation selon les horaires d’occupation."
      }
    }
  },
  "months": monthsFull.fr,
  "monthsShort": monthsShort.fr,
  "insights": {
    "title": "Comment va votre consommation ?",
    "subtitle": "Résumé simple, compréhensible par toute personne à la maison ou au travail.",
    "trend": {
      "up": "En {month}, vous avez consommé {pct}% de plus qu’en {prevMonth} ({kwh} kWh de plus).",
      "down": "En {month}, vous avez baissé de {pct}% par rapport à {prevMonth} ({kwh} kWh économisés).",
      "flat": "En {month}, votre conso est presque la même qu’en {prevMonth}."
    },
    "peak": "{pct}% de votre énergie en {month} a été utilisée aux heures de pointe (souvent plus chères).",
    "bill": {
      "up": "Facture estimée de {month} : ${amount} (environ ${diff} de plus que le mois dernier).",
      "down": "Facture estimée de {month} : ${amount} (environ ${diff} de moins que le mois dernier).",
      "flat": "Facture estimée de {month} : toujours ${amount}."
    },
    "level": {
      "good": "Votre conso est basse : c’est bien.",
      "ok": "Votre conso est moyenne : de petits gestes peuvent encore aider.",
      "high": "Votre conso est élevée : regardez les habitudes et les appareils gourmands."
    },
    "tip": {
      "good": "Conseil : continuez d’éteindre l’inutile et gardez la clim vers 24–26 °C.",
      "ok": "Conseil : lancez lave-linge ou lave-vaisselle hors 18:00–22:00 pour payer moins.",
      "high": "Conseil : vérifiez clim et vieux appareils ; c’est souvent le plus gros poste."
    }
  },
  adminUsers: {
    title: 'Utilisateurs — administration',
    subtitle: 'Créez, modifiez ou désactivez les comptes système.',
    create: 'Nouvel utilisateur',
    refresh: 'Actualiser',
    createTitle: 'Créer un utilisateur',
    editTitle: 'Modifier l\'utilisateur',
    name: 'Nom',
    email: 'Email',
    password: 'Mot de passe',
    passwordOptional: 'Mot de passe (optionnel)',
    passwordOptionalCreate: 'Mot de passe (optionnel)',
    passwordAutoHint: 'Si vide, nous générons un mot de passe temporaire et l\'envoyons par email.',
    temporaryPassword: 'Mot de passe temporaire',
    emailStatus: 'Statut email',
    createdTitle: 'Utilisateur créé. Conservez ces infos (le mot de passe n\'apparaît qu\'une fois).',
    dismiss: 'Fermer',
    passwordMin: 'Le mot de passe doit contenir au moins 8 caractères.',
    role: 'Rôle',
    roleUser: 'Utilisateur',
    roleAdmin: 'Admin',
    verified: 'Vérifié',
    verifiedYes: 'Oui',
    verifiedNo: 'En attente',
    emailVerified: 'Email vérifié (connexion sans lien)',
    emailVerifiedHint: 'Si coché, l\'utilisateur n\'a pas besoin de vérifier son email.',
    actions: 'Actions',
    edit: 'Modifier',
    delete: 'Désactiver',
    confirmDelete: 'Désactiver cet utilisateur ? (suppression logique)',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    loginRequired: 'Connectez-vous en tant qu\'administrateur pour gérer les utilisateurs.',
    forbidden: 'Seuls les administrateurs peuvent accéder à cette section.',
    sessionInvalid: 'Session invalide pour le backend. Déconnectez-vous et reconnectez-vous en admin.',
    loadFailed: 'Impossible de charger les utilisateurs.',
    saveFailed: 'Impossible d\'enregistrer l\'utilisateur.',
    deleteFailed: 'Impossible de désactiver l\'utilisateur.',
    cannotDeactivateAdmin: 'Impossible de désactiver un administrateur',
  },
  adminAnalisis: {
    title: 'Analyse IA — historique',
    subtitle: 'Requêtes enregistrées par les utilisateurs authentifiés.',
    refresh: 'Actualiser',
    recalculate: 'Recalculer avec les règles actuelles',
    recalculating: 'Recalcul…',
    recalculateConfirm:
      'Recalculer toutes les analyses enregistrées avec l’heuristique actuelle ? Aucun e-mail ni nouvelle requête.',
    recalculateDone:
      'Terminé : {total} requêtes · {updated} mises à jour · {unchanged} inchangées · {skipped} ignorées.',
    recalculateFailed: 'Impossible de recalculer les analyses.',
    email: 'Email',
    tipo: 'Type',
    nivel: 'Niveau',
    ahorro: 'Économies',
    confidence: 'Confiance',
    emailStatus: 'Email',
    createdAt: 'Date',
    actions: 'Actions',
    detail: 'Détail',
    detailTitle: 'Requête',
    request: 'Request',
    response: 'Response',
    loginRequired: 'Connectez-vous en tant qu\'administrateur pour voir les analyses.',
    forbidden: 'Seuls les administrateurs peuvent accéder à cette section.',
    sessionInvalid: 'Session invalide pour le backend. Déconnectez-vous et reconnectez-vous en admin.',
    loadFailed: 'Impossible de charger les analyses.',
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Envoyez votre demande et nous vous répondrons rapidement.',
    name: 'Nom',
    email: 'Email',
    message: 'Message',
    messageHint: 'Minimum 10 caractères.',
    submit: 'Envoyer le message',
    submitting: 'Envoi...',
    success: 'Message envoyé. Nous vous répondrons bientôt.',
    infoTitle: 'Coordonnées',
    infoText: 'Vous pouvez aussi nous écrire directement par email.',
    infoEmailLabel: 'Email',
    infoNote: 'Hackathon ONE G9 — Team 48 · EnergIA',
    errors: {
      incomplete: 'Remplissez le nom, l’email et un message d’au moins 10 caractères.',
      sendFailed: 'Impossible d’envoyer le message.',
    },
  },
  team: {
    title: 'Équipe 48',
    subtitle: 'Hackathon ONE G9 — LATAM. Ceux qui construisent EnergIA.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    instagram: 'Instagram',
    email: 'Email',
    cv: 'CV',
    linksSoon: 'Liens de profil bientôt.',
    tapHint: 'Touchez pour voir les liens',
    tapBack: 'Touchez pour revenir',
    flipFront: 'Voir les liens du profil',
    flipBack: 'Retour à la carte',
    roles: {
      fullstack: 'Full Stack Developer',
      dataAnalyst: 'Data Analyst',
      dataScientist: 'Data Scientist',
      backend: 'Backend Developer',
      pm: 'Project Manager',
    },
  },
}
