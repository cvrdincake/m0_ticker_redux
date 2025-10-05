import React, { useEffect } from "react";
import { renderOverlay } from "@/widgets/renderOverlay";

export default function Overlay() {
  useEffect(() => {
    document.documentElement.style.backgroundColor = "black"; // avoids white flashes in OBS
    document.body.style.margin = "0";
  }, []);
  return renderOverlay(); // your minimal, chrome-free renderer
}
