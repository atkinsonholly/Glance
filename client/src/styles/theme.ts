import { extendTheme, theme } from "@chakra-ui/react";

const customTheme = extendTheme({
  ...theme,
  fonts: {
    heading: "Rubik Glitch",
    body: "Rubik Regular",
    caption: "Rubik SemiBold Italic",
    accent: "Rubik Light",
    body_bold: "Rubik Bold",
    body_regular: "Rubik Regular",
    alt: "Rubik MonoOne Regular"
  },
  colors: {
    background: "#FFFFFF",
    yellow: "#f9e5c2",
    dark_yellow: "#daac5c",
    blue: "#0a2ab3",
    green: "#08e0a0",
    grey:"#edf2f6",
    black:"#000000"
   
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default customTheme;
