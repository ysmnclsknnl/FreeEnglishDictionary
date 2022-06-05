function createHomeView(props) {
  let selectedSearchType = "definitions";
  const root = document.createElement("div");
  root.innerHTML = String.raw`
    <header class="header">
      <div class="header-content">
        <h3>Free Dictionary </h3>
      </div>
    </header>
    <div class="content-container whiteframe">
    <form action="" id="search-form">
    <select id="search-dropdown-list">
          <option selected value="definitions">Search Definitions</option>
          <option value="synonyms">Search Synonyms</option>
          <option value="antonyms">Search Antonyms</option>
        </select>
    <input type="text" id="word-input" name="word">
    <input type="submit" value="Search">
  </form>
    </div>
    <div class="display-container hide"></div>`;
  const displayContainer = root.querySelector(".display-container");
  const dropdownList = root.querySelector("#search-dropdown-list");
  dropdownList.addEventListener("change", (e) => {
    selectedSearchType = e.target.value;
  });

  const searchForm = root.querySelector("#search-form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    props.searchDefinitions(selectedSearchType);
  });

  // const antonymsBtn = root.querySelector("#antonyms");
  // antonymsBtn.addEventListener("click", props.listAntonyms);

  // const synonymsBtn = root.querySelector("#synonyms");
  // synonymsBtn.addEventListener("click", props.listSynonyms);

  const update = (state) => {
    if (state.loading) {
      displayContainer.classList.add("hide");

      return;
    }

    displayContainer.classList.remove("hide");

    if (state.error) {
      displayContainer.textContent = state.error.message;
      return;
    }

    if (state.searchResults && state.error === null) {
      const { word, audio, searchType, ...rest } = state.searchResults;
      let input = `<h2>${word}</h2> <br>
                   `;
      if (audio) {
        input += `<audio controls>
                  <source src=${audio} type="audio/mpeg">
                  Your browser does not support the audio tag.
                </audio>`;
      }
      if (searchType !== "definitions") {
        const title = searchType.toUpperCase();
        input += `<h3> <span>${title} </span></h3>`;
      }
      for (const element of rest.arrayOfSearchResults) {
        console.log(`element ${element}`);

        const { partOfSpeech, searchResults } = element;
        console.log("search Results");
        console.log(searchResults);
        if (searchType !== "definitions") {
          searchResults.forEach(
            (searchResult) => (input += `<p> ${searchResult}</p>`)
          );
        } else {
          input += `<h3> <span>${partOfSpeech} </span></h3>`;
          for (const searchResult of searchResults) {
            const data = searchResult["definition"];
            input += `<p> ${data}</p>`;
          }
        }
      }

      displayContainer.innerHTML = input;
    }
  };

  return { root, update };
}

export default createHomeView;
