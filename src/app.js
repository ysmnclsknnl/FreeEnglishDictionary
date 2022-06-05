import createDictionaryPage from "./pages/dictionaryPage.js";

function loadApp() {
  const appRoot = document.getElementById("app-root");

  const { root } = createDictionaryPage();
  appRoot.appendChild(root);
}

export default loadApp;
