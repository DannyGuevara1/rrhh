import React, { useEffect, useState } from "react";
import { Chip } from "@nextui-org/react";

const NotificationChip = ({ message, duration = 3000, props }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <Chip {...props} style={{ position: "fixed", top: 80, right: 20 }}>
      {message}
    </Chip>
  );
};

export default NotificationChip;
