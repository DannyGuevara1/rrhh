'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Image } from "@nextui-org/image";
import { Checkbox } from "@nextui-org/checkbox";
import { Link } from "@nextui-org/link";

import EmailInput from "./ui/EmailInput";
import Inputpassword from "./ui/Inputpassword";

const Separator = () => {
  return (
    <div className="flex items-center gap-4 py-2 w-full max-w-xs">
      <Divider className="flex-1" />
      <p className="shrink-0 text-tiny text-default-500">OR</p>
      <Divider className="flex-1" />
    </div>
  );
};

const SocialBtns = ({ variant, color }) => {
  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <Button
        className="flex items-center justify-center w-full rounded-medium h-10 font-medium shadow-input max-w-xs"
        color={color}
        variant={variant}
      >
        <FcGoogle size={20} />
        Login with Google
      </Button>
      <Button
        className="flex items-center justify-center w-full rounded-medium h-10 font-medium shadow-input max-w-xs"
        color={color}
        variant={variant}
      >
        <FaGithub size={20} />
        Login with Github
      </Button>
    </div>
  );
};

const SocialBtnsContainer = () => {
  return (
    <>
      <Separator />
      <SocialBtns color="default" variant="bordered" />
    </>
  );
};

const Header = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full">
      <Image
        alt="Logo"
        className="rounded-full"
        height={30}
        src="/logo.webp" // add image with same name in /public dir.
        width={30}
      />
      <span className="flex flex-col w-full items-center">
        <p className="text-xl font-medium">Welcome Back</p>
        <p className="text-small text-default-500">
          Log in to your account to continue
        </p>
      </span>
    </div>
  );
};

const Content = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    contrasena: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      alert("Login exitoso");
      localStorage.setItem("token", result.token); // Guarda el token en localStorage
      localStorage.setItem("id_usuario", result.id_usuario);
      router.push("/dashboard");
    } else if (response.status === 401) {
      alert("Usuario o contraseña incorrectos");
    } else {
      alert("Error en el login");
    }
  };

  return (
    <form
      className="w-full h-full flex flex-col gap-4 items-center"
      onSubmit={handleSubmit}
    >
      <Header />

      <EmailInput
        isRequired
        name="nombreUsuario"
        value={formData.nombreUsuario}
        onChange={handleChange}
        description="Enter your email"
        id="nameUser"
        labelPlacement="inside"
      />
      <Inputpassword
        isRequired
        className="max-w-xs"
        name="contrasena"
        value={formData.contrasena}
        onChange={handleChange}
        description="Enter your password"
        id="password"
        label="Password"
        labelPlacement="inside"
      />
      <div className="flex w-full max-w-xs justify-between gap-4">
        <Checkbox name="remember">Remember Me</Checkbox>
        <Link href="#">Forgor Password?</Link>
      </div>
      <Button
        className="max-w-xs"
        color="primary"
        fullWidth={true}
        href="/dashboard"
        id="login-btn"
        type="submit"
        variant="solid"
      >
        Log In
      </Button>
      <SocialBtnsContainer />
    </form>
  );
};

export default function LoginPage() {
  return (
    <div className="flex w-full h-full rounded-md justify-center items-center gap-4">
      <Card className="w-full max-w-sm m-4">
        <CardBody>
          <Content />
        </CardBody>
      </Card>
    </div>
  );
}

// export const getServerSideProps = async (context) => {
//   const { req, res } = context;
//   const name = document.getElementById("nameUser").value;
//   const password = document.getElementById("password").value;

//   req = fetch("http://localhost:8080/api/v1/auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       nombreUsuario: name,
//       contrasena: password,
//     }),
//   });

//   res = await req.json();

//   return {
//     props: {
//       data: res,
//     },
//   };
// };
