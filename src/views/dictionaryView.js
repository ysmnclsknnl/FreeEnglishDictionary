function createHomeView(props) {
  const root = document.createElement("div");
  root.innerHTML = String.raw`
    <header class="header">
      <div class="header-content">
        <h3>Free Dictionary </h3>
      </div>
    </header>
    <div class="content-container whiteframe">
    <form action="" id="searchForm">
    <input type="text" id="word" name="word">
    <input type="submit" value="Search">
  </form>
  <div id="button-container"> 
      <button id="synonyms">Synonyms</button>
      <button id="antonyms">Antonyms</button>
      </div >
    </div>
    <div id="definition-container"></div>`;

  const searchForm = root.querySelector("#searchForm");
  searchForm.addEventListener("submit", props.searchDefinitions);

  const antonymsBtn = root.querySelector("#antonyms");
  antonymsBtn.addEventListener("click", props.listAntonyms);

  const synonymsBtn = root.querySelector("#synonyms");
  synonymsBtn.addEventListener("click", props.listSynonyms);

  const update = (state) => {
    counter.textContent = state.count;
    antonymsBtn.disabled = state.count <= 0;
  };

  return { root, update };
}

export default createHomeView;
