import React from "react";
import { Input } from "@nextui-org/input";

const EmailInput = (props) => {
  return (
    <Input
      label="Username"
      name="nameUser"
      className="max-w-xs"
      {...props}
    />
  );
};

export default EmailInput;