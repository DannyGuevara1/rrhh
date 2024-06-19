export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Ofertas de trabajo",
      href: "/home/docs",
    },
    {
      label: "About",
      href: "/home/about",
    },
  ],
  navMenuItems: [
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Plazas",
      href: "/home/docs",
    },
    {
      label: "About",
      href: "/home/about",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

export const DashboardListPage = {
  name: "Dashboard",
  descripcion: "Pagina de inicio",
  navItems: [
    {
      label: "Descripción de los Puestos de Trabajo",
      href: "/dashboard/JobsDescriptor",
      icon: "icons.scale",
      key: "autoscaling",
    },
    {
      label: "Proceso de Reclutamiento",
      href: "#",
      icon: "icons.activity",
      key: "usage_metrics",
    },
    {
      label: "Seguimiento de Candidatos",
      href: "#",
      icon: "icons.flash",
      key: "production_ready",
    },
    {
      label: "Pruebas de Selección",
      href: "#",
      icon: "icons.server",
      key: "99_uptime",
    },
    {
      label: "Expediente de los Trabajadores",
      href: "#",
      icon: "icons.user",
      key: "supreme_support",
    },
  ],
}
