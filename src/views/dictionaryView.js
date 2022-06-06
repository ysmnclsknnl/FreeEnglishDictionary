import findElementsWithIds from "../lib/findElementsWithIds.js";

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
    <select id="dropdownList">
          <option selected value="definitions">Search Definitions</option>
          <option value="synonyms">Search Synonyms</option>
          <option value="antonyms">Search Antonyms</option>
        </select>
    <input type="text" id="searchInput" name="word">
    <input type="submit" value="Search">
  </form>
    </div>
    <div id="displayContainer" class= "hide"></div>`;

  const { displayContainer, searchForm, searchInput, dropdownList } =
    findElementsWithIds(root);

  searchInput.addEventListener("input", props.onSearchInput);

  dropdownList.addEventListener("change", props.onSelectSearchType);

  searchForm.addEventListener("submit", props.search);

  const update = (state) => {
    if (state.loading) {
      searchInput.value = "";
      displayContainer.classList.remove("hide");
      return;
    }

    if (state.error) {
      displayContainer.textContent = state.error.message;
      return;
    }

    if (state.searchResults && state.error === null) {
      const { word, audio, searchType, ...rest } = state.searchResults;

      let displayItems = `<h2>${word}</h2> <br>
                   `;
      if (audio) {
        displayItems += `<audio controls>
                  <source src=${audio} type="audio/mpeg">
                  Your browser does not support the audio tag.
                </audio>`;
      }
      if (searchType !== "definitions") {
        const title = searchType.toUpperCase();
        displayItems += `<h3> <span>${title} </span></h3>`;
      }
      for (const element of rest.arrayOfSearchResults) {
        console.log(`element ${element}`);

        const { partOfSpeech, searchResults } = element;
        console.log("search Results");
        console.log(searchResults);
        if (searchType !== "definitions") {
          searchResults.forEach(
            (searchResult) => (displayItems += `<p> ${searchResult}</p>`)
          );
        } else {
          displayItems += `<h3> <span>${partOfSpeech} </span></h3>`;

          for (const searchResult of searchResults) {
            const definition = searchResult["definition"];
            displayItems += `<p> ${definition}</p>`;
          }
        }
      }

      displayContainer.innerHTML = displayItems;
    }
  };

  return { root, update };
}

export default createHomeView;
