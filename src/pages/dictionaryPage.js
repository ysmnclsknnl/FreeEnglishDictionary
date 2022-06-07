import createDictionaryView from "../views/dictionaryView.js";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

async function fetchData(url) {
  const response = await fetch(url);
  if (response.status === 404) {
    const errorInfo = await response.json();
    throw new Error(errorInfo.message);
  } else {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  }
}

function createDictionaryPage() {
  //Initialize state object
  let state = {
    searchInput: "",
    selectedSearchType: "definitions",
    searchResults: null,
    error: null,
  };

  const updateState = (updates) => {
    state = { ...state, ...updates };
    console.log("state", state);
    view.update(state);
  };

  //Search input is entered update the searchInput state and reset SearchResults state
  const onSearchInput = (e) =>
    updateState({ searchInput: e.target.value, searchResults: null });

  //Search Type is selected update the selectedSearchType state
  const onSelectSearchType = (e) =>
    updateState({ selectedSearchType: e.target.value });

  const search = async (e) => {
    e.preventDefault();

    const word = state.searchInput;

    // Set the loading state and reset the error state.
    updateState({ loading: true, error: null });

    try {
      const results = await fetchData(`${BASE_URL}/${word} `);

      const resultObject = {
        word: word,
        phonetic: null,
        audio: null,
        searchType: state.selectedSearchType,
        arrayOfSearchResults: [],
      };

      //Result objects sometimes contains more than one result object so for of method is used to iterate through results.
      for (const result of results) {
        //arrayOfSearchResults store data such as definition, synonym and antonym
        const { searchType, arrayOfSearchResults } = resultObject;

        resultObject.phonetic = result.phonetic;

        //Words have more than one meaning so each result has meanings key . This key store objects .
        for (const meaning of result.meanings) {
          const { partOfSpeech } = meaning;
          const searchResults = meaning[searchType];

          if (searchResults.length !== 0) {
            arrayOfSearchResults.push({ partOfSpeech, searchResults });
          }
        }

        for (const phonetic of result.phonetics) {
          resultObject.audio = phonetic.audio;
        }
      }

      // Loading was successful, update the state accordingly.

      updateState({
        searchResults: resultObject,
        loading: false,
      });
    } catch (error) {
      // Loading failed, update the state with the caught error.
      updateState({ error, loading: false });
    }
  };

  const viewProps = { search, onSearchInput, onSelectSearchType };
  const view = createDictionaryView(viewProps);

  view.update(state);

  return view;
}

export default createDictionaryPage;
