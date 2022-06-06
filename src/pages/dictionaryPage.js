import createDictionaryView from "../views/dictionaryView.js";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Definition is not found");
  }
  return response.json();
}

function createDictionaryPage() {
  let state = { searchInput: "", selectedSearchType: "definitions" };

  const updateState = (updates) => {
    state = { ...state, ...updates };
    console.log("state", state);
    view.update(state);
  };

  const onSearchInput = (e) => updateState({ searchInput: e.target.value });
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
        audio: null,
        searchType: state.selectedSearchType,
        arrayOfSearchResults: [],
      };

      for (const result of results) {
        const { searchType, arrayOfSearchResults } = resultObject;

        for (const meaning of result.meanings) {
          const { partOfSpeech } = meaning;
          const searchResults = meaning[searchType];
          arrayOfSearchResults.push({ partOfSpeech, searchResults });
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
