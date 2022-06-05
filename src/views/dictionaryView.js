function createHomeView(props) {
  const root = document.createElement("div");
  root.innerHTML = String.raw`
    <header class="header">
      <div class="header-content">
        <h3>Free Dictionary </h3>
      </div>
    </header>
    <div class="content-container whiteframe">
    <form action="" id="search-form">
    <input type="text" id="word-input" name="word">
    <input type="submit" value="Search">
  </form>
  <div class="button-container"> 
      <button id="synonyms" class="hide">Synonyms</button>
      <button id="antonyms" class="hide">Antonyms</button>
      </div >
    </div>
    <div class="display-container hide"></div>`;
  const displayContainer = root.querySelector(".display-container");

  const searchForm = root.querySelector("#search-form");
  searchForm.addEventListener("submit", props.searchDefinitions);

  const antonymsBtn = root.querySelector("#antonyms");
  antonymsBtn.addEventListener("click", props.listAntonyms);

  const synonymsBtn = root.querySelector("#synonyms");
  synonymsBtn.addEventListener("click", props.listSynonyms);

  const update = (state) => {
    if (state.loading) {
      antonymsBtn.classList.add("hide");
      synonymsBtn.classList.add("hide");
      displayContainer.classList.add("hide");

      return;
    }

    antonymsBtn.classList.remove("hide");
    synonymsBtn.classList.remove("hide");
    displayContainer.classList.remove("hide");

    if (state.error) {
      displayContainer.textContent = state.error.message;
      return;
    }
    console.log(`state.definitions ${state.definitions}`);
    if (state.definitions && state.error === null) {
      const arrayOfDefinitions = state.definitions;
      let input = "";

      arrayOfDefinitions.forEach((element) => {
        const { partOfSpeech, definitions } = element;
        input += `<h3> <span>${partOfSpeech} </span></h3>`;
        for (const definition of definitions) {
          input += `<p> ${definition.definition}</p>`;
        }
      });
      displayContainer.innerHTML = input;
    }
  };

  return { root, update };
}

export default createHomeView;
