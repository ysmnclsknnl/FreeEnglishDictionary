import findElementsWithIds from "../lib/findElementsWithIds.js";

function createHomeView(props) {
  const root = document.createElement("div");
  root.innerHTML = String.raw`
    <header class="header">
      <div class="header-content">
        <h3> Free <span class='black-text'> Dictionary </span></h3>
      </div>
    </header>
    <div class="content-container whiteframe">
    <form action="" id="searchForm">
    <select id="dropdownList">
          <option selected value="definitions">Search Definitions</option>
          <option value="synonyms">Search Synonyms</option>
          <option value="antonyms">Search Antonyms</option>
        </select>
        <div class="search-box-wrapper">
    <input type="text" id="searchInput" placeholder='Search......' >
    <button class='search-btn' 'type="submit"> Search</div>
  </form>
    </div>
    <div id="displayContainer" class= "display-container  hide"></div>`;

  const { displayContainer, searchForm, searchInput, dropdownList } =
    findElementsWithIds(root);

  searchInput.addEventListener("input", props.onSearchInput);

  dropdownList.addEventListener("change", props.onSelectSearchType);

  searchForm.addEventListener("submit", props.search);

  // This function  create HTML elements  to display definitions, synonyms

  const createInnerHTMLAccordingToSearchTypes = (
    arrayOfSearchResults,
    searchType
  ) => {
    let output = "";
    for (const element of arrayOfSearchResults) {
      const { partOfSpeech, searchResults } = element;

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

      //If Search Type Is Synonym Or Antonym
      if (searchType !== "definitions") {
        const title = searchType.toUpperCase();
        displayItems += `<h3> <span>${title} </span></h3>`;

        //If there is no synonym or antonym then display a message to user and return
        if (arrayOfSearchResults.length === 0) {
          const wordType = searchType === "antonyms" ? "antonym" : "synonym";
          displayItems += `<p> No ${wordType} is found for this word`;
          displayContainer.innerHTML = displayItems;
          return;
        }
      }

      //If there is a synonym, antonym or definition then create html to display them
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
