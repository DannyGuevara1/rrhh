"use client";
import { useState, useEffect } from "react";
import { Card } from "@nextui-org/react";
import {
  IdentificationIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  InboxStackIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NavbarAdmin from "../../components/navbarAdmin";
export default function ConfiguracionLayout({ children }) {
  const pathname = usePathname();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && pathname) {
      const path =
        pathname === "/configuracion" ? null : pathname.split("/")[2];

      setSelectedOption(path || null);
    }
  }, [pathname]);

  const menuItems = [
    {
      label: "Departamentos",
      icon: BuildingOfficeIcon,
      href: "/configuracion/departamentos",
      key: "departamentos",
    },
    {
      label: "Rangos Salariales",
      icon: CurrencyDollarIcon,
      href: "/configuracion/rangos",
      key: "rangos",
    },
    {
      label: "Tipos de contratos",
      icon: IdentificationIcon,
      href: "/configuracion/contratos",
      key: "contratos",
    },
    {
      label: "Categorias de salarios",
      icon: InboxStackIcon,
      href: "/configuracion/categorias",
      key: "categorias",
    },
    {
      label: "Beneficios",
      icon: HeartIcon,
      href: "/configuracion/beneficios",
      key: "beneficios",
    },
  ];

  return (
    <>
      <NavbarAdmin />
      <div className="container mx-auto max-w-8xl pt-6 px-6 flex-grow flex">
        <Card className="w-64 min-h-screen shadow-lg p-6">
          <div className="flex flex-col space-y-8">
            <div className="text-2xl font-bold">Configuracion</div>
            {menuItems.map((item) => (
              <div key={item.key}>
                <Link
                  passHref
                  className={`flex items-center space-x-3 p-2 rounded-lg ${selectedOption === item.key ? "bg-[#32d4be] dark:bg-[#7b3bed]" : "hover:bg-[#f2ee8d] dark:hover:bg-[#5046e5]"}`}
                  color="foreground"
                  href={item.href}
                  role="button"
                  onClick={() => setSelectedOption(item.key)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex-1 p-8">{children}</div>
      </div>
    </>
  );
}
