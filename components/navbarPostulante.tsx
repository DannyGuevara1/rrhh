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
  Link as NextUiLink,
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

interface UserData {
  id_postulante: number;
  nombre: string;
  apellido: string;
  email: string;
  url_image: string;
  tipoUsuario: string;
}

export default function NavbarPostulante() {
  const [userData, setUserData] = useState<UserData | null>();
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
          if (data.tipoUsuario != "Postulante") {
            router.push("/error");
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

  return (
    <Navbar
      isBlurred
      className="bg-gradient-to-r from-teal-400 to-yellow-200  dark:bg-gradient-to-r dark:from-violet-600 dark:to-indigo-600"
      maxWidth="2xl"
    >
      <NavbarBrand>
        <Link href="/postulantes">
          <p className="font-bold text-inherit">ACME</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
            <DropdownItem key="system">Systema</DropdownItem>
            <DropdownItem key="configurations">Configuracion</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
