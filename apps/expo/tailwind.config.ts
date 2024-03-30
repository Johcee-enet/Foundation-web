import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import { platformSelect } from "nativewind/theme";

import baseConfig from "@acme/tailwind-config/native";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      fontFamily: {
        nunito: [
          "./assets/fonts/NunitoSans/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf",
        ],
        system: platformSelect({
          ios: "Georgia",
          android: "sans-serif",
          default: "ui-sans-serif",
        }),
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
