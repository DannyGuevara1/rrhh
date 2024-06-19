"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  User,
  Button,
  Link as NextUiLink,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Input,
  Kbd,
} from "@nextui-org/react";

import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "./icons";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { DashboardListPage } from "@/config/site";
interface UserData {
  id_postulante: number;
  nombre: string;
  apellido: string;
  email: string;
  url_image: string;
  tipoUsuario: string;
}

export default function NavbarAdmin() {
  const [userData, setUserData] = useState<UserData | null>();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const id_usuario = localStorage.getItem("id_usuario");

    if (id_usuario) {
      fetch(
        `http://localhost:8080/api/v1/postulante/usuario/${id_usuario}/info`,
      )
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          if (data.tipoUsuario === "Postulante") {
            //router.push("/postulantes");
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, [router]);
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token del localStorage
    localStorage.removeItem("id_usuario"); // Elimina el usuario del localStorage
    router.push("/"); // Redirige al usuario a la página de inicio
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <Navbar
      className="bg-gradient-to-r from-teal-400 to-yellow-200  dark:bg-gradient-to-r dark:from-violet-600 dark:to-indigo-600"
      isMenuOpen={isMenuOpen}
      maxWidth="2xl"
      position="static"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent
        className="sm:hidden"
        justify="start"
        style={{ flexGrow: 0 }}
      >
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/dashboard">
            <p className="font-bold text-inherit">Optica</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link href="/dashboard">
            <p className="font-bold text-inherit">Optica</p>
          </Link>
        </NavbarBrand>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
              >
                Reclutamiento de personal
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem key="autoscaling" startContent={icons.scale}>
              <Link href="/dashboard/JobsDescriptor">
                Descripción de los Puestos de Trabajo
              </Link>
            </DropdownItem>

            <DropdownItem key="usage_metrics" startContent={icons.activity}>
              <Link href="/dashboard/reclutamiento">
                Proceso de Reclutamiento
              </Link>
            </DropdownItem>
            <DropdownItem key="production_ready" startContent={icons.flash}>
              Seguimiento de Candidatos
            </DropdownItem>
            <DropdownItem key="99_uptime" startContent={icons.server}>
              Pruebas de Selección
            </DropdownItem>
            <DropdownItem key="supreme_support" startContent={icons.user}>
              Expediente de los Trabajadores
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem isActive>
          <NextUiLink aria-current="page" color="warning" href="/">
            Home
          </NextUiLink>
        </NavbarItem>
        <NavbarItem>
          <NextUiLink color="foreground" href="#">
            Integrations
          </NextUiLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <User
              avatarProps={{
                src: userData
                  ? userData.url_image
                  : "https://i.pravatar.cc/150?u=a04258114e29026702d",
                size: "md",
              }}
              name={
                userData
                  ? `${userData.nombre.split(" ")[0]} ${userData.apellido.split(" ")[0]}`
                  : "Jane Doe"
              }
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">
                {userData ? userData.email : "zoey@example.com"}
              </p>
            </DropdownItem>
            <DropdownItem key="system">Sistema</DropdownItem>

            <DropdownItem key="configurations">
              <Link href="/configuracion">Configuracion</Link>
            </DropdownItem>

            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {DashboardListPage.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextUiLink
                color={
                  index === 1
                    ? "primary"
                    : index === DashboardListPage.navItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={`${item.href}`}
                size="lg"
              >
                {item.label}
              </NextUiLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
