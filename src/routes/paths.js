// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: "/auth",
  AUTH_DEMO: "/auth-demo",
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
  root:"/",
  chat: `/chat`,

  fileManager: `/file-manager`,
  general: {
    app: `/app`,
    analytics: `/analytics`,
  },
  artPiece: {
    home: `/art-piece`,
    create: `/art-piece/create`,
    details: (id) => `/art-piece/${id}`,
    update: (id) => `/art-piece/${id}/update`,
    delete: (id) => `/art-piece/${id}/delete`,
  },
  artPieceMaterial: {
    home: `/art-piece/art-piece-material`,
    details: (id) => `/art-piece/art-piece-material/${id}`,
  },
  artPieceType: {
    home: `/art-piece/art-piece-type`,
  },
  artPieceTags: {
    home: `/art-piece/art-piece-tag`,
  },
  artist: {
    home: `/artist`,
    create: `/artist/create`,
    details: (id) => `/artist/${id}`,
  },
  contact: {
    home: `/contact`,
  },
  documentation: {
    home: `/documentation`,
  },
  image: {
    home: `/image`,
    details: (id) => `/image/${id}`,
    moderation: `/image/moderation`,
  },
  invoice: {
    home: `/invoice`,
  },
  location: {
    home: `/location`,
    country: `/location/country`,
    state: `/location/state`,
    city: `/location/city`,
    countryDetails: (id) => `/location/country/${id}`,
    stateDetails: (id) => `/location/state/${id}`,
    cityDetails: (id) => `/location/city/${id}`,
  },
  notifications: {
    home: `/notifications`,
    create: `/notifications/create`,
    details: (id) => `/notifications/${id}`,
  },
  paths: {
    home: `/path`,
    create: `/path/create`,
    details: (id) => `/path/${id}`,
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
    home: `/review`,
    details: (id) => `/review/${id}`,
  },
  moderation: {
    root: `/moderation`,
    queue: `/moderation/queue`,
  },
  user: {
    root: `/user`,
    home: `/user`,
    list: `/user/list`,
    edit: (id) => `/user/${id}/edit`,
    details: (id) => `/user/${id}`,
  },
  email: {
    dashboard: `/email`,
    users: `/email/users`,
    management: `/email/management`,
    userHistory: (id) => `/email/users/${id}`,
    emailTemplates: `/email/email-templates`,
    createTemplate: `/email/email-templates/create`,
    templateDetails: (id) => `/email/email-templates/${id}`,
    editTemplate: (id) => `/email/email-templates/${id}/edit`,
  },
  emailTemplate: {
    root: `/email/email-templates`,
    create: `/email/email-templates/create`,
    details: (id) => `/email/email-templates/${id}`,
    edit: (id) => `/email/email-templates/${id}/edit`,
  },
  product: {
    root: `/product`,
    create: `/product/create`,
    details: (id) => `/product/${id}`,
    update: (id) => `/product/${id}/update`,
  },
  post: {
    root: `/post`,
    create: `/post/create`,
    details: (slug) => `/post/${slug}`,
    edit: (slug) => `/post/${slug}/edit`,
  },
  harvesting: {
    home: `/art-piece/harvesting`,
    queue: `/art-piece/harvesting/queue`,
    queueDetails: (id) => `/art-piece/harvesting/queue/${id}`,
    queueEdit: (id) =>
      `/art-piece/harvesting/queue/${id}/edit`,
    batches: `/art-piece/harvesting/batches`,
    batchDetails: (id) =>
      `/art-piece/harvesting/batches/${id}`,
    batchCreate: `/art-piece/harvesting/batches/create`,
    batchEdit: (id) =>
      `/art-piece/harvesting/batches/${id}/edit`,
    logs: `/art-piece/harvesting/logs`,
    logDetails: (id) => `/art-piece/harvesting/logs/${id}`,
  },
  indexNow: {
    root: `/index-now`,
    list: `/index-now`,
    details: (id) => `/index-now/${id}`,
    stats: `/index-now/stats`,
    process: `/index-now/process`,
  },
};
