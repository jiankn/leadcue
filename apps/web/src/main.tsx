import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./i18n";
import "./styles.css";
import "./topbar-fixes.css";

const rootElement = document.getElementById("root")!;

function removeLiteralTopbarTokens() {
  const topbar = document.querySelector(".topbar-marketing");

  if (!topbar) {
    return;
  }

  const walker = document.createTreeWalker(topbar, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const normalizedText = node.textContent?.replace(/\s+/g, "");

      return normalizedText === "\\n" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => node.remove());
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const sanitizeTopbar = () => window.requestAnimationFrame(removeLiteralTopbarTokens);

sanitizeTopbar();

new MutationObserver(() => {
  sanitizeTopbar();
}).observe(rootElement, {
  childList: true,
  subtree: true,
  characterData: true
});
