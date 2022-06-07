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

  const createInnerHTMLAccordingToSearchTypes = (
    arrayOfSearchResults,
    searchType
  ) => {
    let output = "";
    for (const element of arrayOfSearchResults) {
      const { partOfSpeech, searchResults } = element;
      console.log(`search type is ${searchType}`);

      if (searchType !== "definitions") {
        searchResults.forEach(
          (searchResult) => (output += `<p> ${searchResult}</p>`)
        );
        return output;
      }
      output += `<h3> <span>${partOfSpeech} </span></h3>`;

      for (const searchResult of searchResults) {
        const definition = searchResult["definition"];
        output += `<p> ${definition}</p>`;
      }
    }
    return output;
  };

  const update = (state) => {
    if (state.loading) {
      displayContainer.classList.remove("hide");
      displayContainer.innerHTML = String.raw`<h3 class="loading">Loading............</h3>`;
      return;
    }

    if (state.error) {
      displayContainer.innerHTML = String.raw`<h3 class="error">${state.error.message}</h3>`;
      return;
    }

    if (state.searchResults) {
      const { word, audio, phonetic, searchType, arrayOfSearchResults } =
        state.searchResults;
      console.log(arrayOfSearchResults);
      let displayItems = `<h2>${word}</h2> `;
      if (phonetic) {
        displayItems += `<span>${phonetic}</span>`;
      }

      if (audio) {
        displayItems += `<audio controls>
                  <source src=${audio} type="audio/mpeg">
                  Your browser does not support the audio tag.
                </audio>`;
      }
      if (searchType !== "definitions") {
        const title = searchType.toUpperCase();
        displayItems += `<h3> <span>${title} </span></h3>`;
        if (arrayOfSearchResults.length === 0) {
          const wordType = searchType === "antonyms" ? "antonym" : "synonym";
          displayItems += `<p> No ${wordType} is found for this word`;
          displayContainer.innerHTML = displayItems;
          return;
        }
      }
      displayItems += createInnerHTMLAccordingToSearchTypes(
        arrayOfSearchResults,
        searchType
      );

      displayContainer.innerHTML = displayItems;
    }
  };

  return { root, update };
}

export default createHomeView;
