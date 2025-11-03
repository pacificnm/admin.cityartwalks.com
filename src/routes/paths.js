// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: "/auth",
  AUTH_DEMO: "/auth-demo",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  home: "/",
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  notFound: "/404",
  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
  components: "/components",
  auth: {
    auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
  },
  root: ROOTS.DASHBOARD,
  chat: `${ROOTS.DASHBOARD}/chat`,

  fileManager: `${ROOTS.DASHBOARD}/file-manager`,
  general: {
    app: `${ROOTS.DASHBOARD}/app`,
    analytics: `${ROOTS.DASHBOARD}/analytics`,
  },
  artPiece: {
    home: `${ROOTS.DASHBOARD}/art-piece`,
    create: `${ROOTS.DASHBOARD}/art-piece/create`,
    details: (id) => `${ROOTS.DASHBOARD}/art-piece/${id}`,
    update: (id) => `${ROOTS.DASHBOARD}/art-piece/${id}/update`,
    delete: (id) => `${ROOTS.DASHBOARD}/art-piece/${id}/delete`,
  },
  artPieceMaterial: {
    home: `${ROOTS.DASHBOARD}/art-piece/art-piece-material`,
    details: (id) => `${ROOTS.DASHBOARD}/art-piece/art-piece-material/${id}`,
  },
  artPieceType: {
    home: `${ROOTS.DASHBOARD}/art-piece/art-piece-type`,
  },
  artPieceTags: {
    home: `${ROOTS.DASHBOARD}/art-piece/art-piece-tag`,
  },
  artist: {
    home: `${ROOTS.DASHBOARD}/artist`,
    create: `${ROOTS.DASHBOARD}/artist/create`,
  },
  contact: {
    home: `${ROOTS.DASHBOARD}/contact`,
  },
  documentation: {
    home: `${ROOTS.DASHBOARD}/documentation`,
  },
  image: {
    home: `${ROOTS.DASHBOARD}/image`,
    moderation: `${ROOTS.DASHBOARD}/image/moderation`,
  },
  invoice: {
    home: `${ROOTS.DASHBOARD}/invoice`,
  },
  location: {
    home: `${ROOTS.DASHBOARD}/location`,
    country: `${ROOTS.DASHBOARD}/location/country`,
    state: `${ROOTS.DASHBOARD}/location/state`,
    city: `${ROOTS.DASHBOARD}/location/city`,
    countryDetails: (id) => `${ROOTS.DASHBOARD}/location/country/${id}`,
    stateDetails: (id) => `${ROOTS.DASHBOARD}/location/state/${id}`,
    cityDetails: (id) => `${ROOTS.DASHBOARD}/location/city/${id}`,
  },
  notifications: {
    home: `${ROOTS.DASHBOARD}/notifications`,
    create: `${ROOTS.DASHBOARD}/notifications/create`,
    details: (id) => `${ROOTS.DASHBOARD}/notifications/${id}`,
  },
  paths: {
    home: `${ROOTS.DASHBOARD}/path`,
    create: `${ROOTS.DASHBOARD}/path/create`,
    details: (id) => `${ROOTS.DASHBOARD}/path/${id}`,
  },
   profile: {
    home: `/profile`,
    account: `/profile/account`,
    settings: `/profile/account/settings`,
    invoices: `/profile/account/invoices`,
    notifications: `/profile/account/notifications`,
    notificationDetail: (id) => `/profile/account/notifications/${id}`,
    art: `/profile/art`,
    paths: `/profile/art/paths`,
    artists: `/profile/art/artists`,
    artPieces: `/profile/art/art-pieces`,
    images: `/profile/art/images`,
    reviews: `/profile/art/reviews`,
    reviewEdit: (id) => `/profile/art/reviews/${id}/edit`,
    upgrade: `/profile/upgrade`,
    downgrade: `/profile/downgrade`,
  },
  review: {
    home: `${ROOTS.DASHBOARD}/review`,
    details: (id) => `${ROOTS.DASHBOARD}/review/${id}`,
  },
  moderation: {
    root: `${ROOTS.DASHBOARD}/moderation`,
    queue: `${ROOTS.DASHBOARD}/moderation/queue`,
  },
  user: {
    root: `${ROOTS.DASHBOARD}/user`,
    list: `${ROOTS.DASHBOARD}/user/list`,
    edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
  },
  email: {
    dashboard: `${ROOTS.DASHBOARD}/email`,
    users: `${ROOTS.DASHBOARD}/email/users`,
    management: `${ROOTS.DASHBOARD}/email/management`,
    userHistory: (id) => `${ROOTS.DASHBOARD}/email/users/${id}`,
    emailTemplates: `${ROOTS.DASHBOARD}/email/email-templates`,
    createTemplate: `${ROOTS.DASHBOARD}/email/email-templates/create`,
    templateDetails: (id) => `${ROOTS.DASHBOARD}/email/email-templates/${id}`,
    editTemplate: (id) => `${ROOTS.DASHBOARD}/email/email-templates/${id}/edit`,
  },
  emailTemplate: {
    root: `${ROOTS.DASHBOARD}/email/email-templates`,
    create: `${ROOTS.DASHBOARD}/email/email-templates/create`,
    details: (id) => `${ROOTS.DASHBOARD}/email/email-templates/${id}`,
    edit: (id) => `${ROOTS.DASHBOARD}/email/email-templates/${id}/edit`,
  },
  product: {
    root: `${ROOTS.DASHBOARD}/product`,
    create: `${ROOTS.DASHBOARD}/product/create`,
    details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
    update: (id) => `${ROOTS.DASHBOARD}/product/${id}/update`,
  },
  post: {
    root: `${ROOTS.DASHBOARD}/post`,
    create: `${ROOTS.DASHBOARD}/post/create`,
    details: (slug) => `${ROOTS.DASHBOARD}/post/${slug}`,
    edit: (slug) => `${ROOTS.DASHBOARD}/post/${slug}/edit`,
  },
  harvesting: {
    home: `${ROOTS.DASHBOARD}/art-piece/harvesting`,
    queue: `${ROOTS.DASHBOARD}/art-piece/harvesting/queue`,
    queueDetails: (id) => `${ROOTS.DASHBOARD}/art-piece/harvesting/queue/${id}`,
    queueEdit: (id) =>
      `${ROOTS.DASHBOARD}/art-piece/harvesting/queue/${id}/edit`,
    batches: `${ROOTS.DASHBOARD}/art-piece/harvesting/batches`,
    batchDetails: (id) =>
      `${ROOTS.DASHBOARD}/art-piece/harvesting/batches/${id}`,
    batchCreate: `${ROOTS.DASHBOARD}/art-piece/harvesting/batches/create`,
    batchEdit: (id) =>
      `${ROOTS.DASHBOARD}/art-piece/harvesting/batches/${id}/edit`,
    logs: `${ROOTS.DASHBOARD}/art-piece/harvesting/logs`,
    logDetails: (id) => `${ROOTS.DASHBOARD}/art-piece/harvesting/logs/${id}`,
  },
  indexNow: {
    root: `${ROOTS.DASHBOARD}/index-now`,
    list: `${ROOTS.DASHBOARD}/index-now`,
    details: (id) => `${ROOTS.DASHBOARD}/index-now/${id}`,
    stats: `${ROOTS.DASHBOARD}/index-now/stats`,
    process: `${ROOTS.DASHBOARD}/index-now/process`,
  },
};
