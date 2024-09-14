import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Modal from "./components/Modal.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
const colors = {
  brand: {
    light: "#E6E6FA",
    dark: "#213145",
    // 'dark': '#153e75'
  },
  box: {
    light: "#f5f5f5",
    dark: "#213145",
  },
  message: {
    dark: "#050505",
    light: "#f0f0f0",
  },
};
const overrides = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("white", "#101010")(props),
    },
  }),
};
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
const theme = extendTheme({ config, overrides, colors });
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Modal />
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </BrowserRouter>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
);
