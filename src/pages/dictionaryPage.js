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
  let state = {};
  const updateState = (updates) => {
    state = { ...state, ...updates };
    console.log("state", state);
    view.update(state);
  };

  const searchDefinitions = async (selectedSearchType) => {
    // Set the loading state and reset the error state.
    updateState({ loading: true, error: null });
    const word = document.querySelector("#word-input").value.trim();

    try {
      console.log(`${BASE_URL}/${word} `);
      const results = await fetchData(`${BASE_URL}/${word} `);
      console.log(results);
      const resultObject = {
        word: "",
        audio: null,
        searchType: selectedSearchType,
        arrayOfSearchResults: [],
      };

      for (const result of results) {
        const { searchType, arrayOfSearchResults } = resultObject;
        console.log(result);
        resultObject.word = result.word;
        for (const meaning of result.meanings) {
          const { partOfSpeech } = meaning;

          const searchResults = meaning[searchType];

          console.log("search Results");
          console.log(searchResults);
          console.log(searchType);
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

  // const listSynonyms = () => {
  //   state = { ...state, count: state.count + 1 };
  //   view.update(state);
  // };
  // const listAntonyms = () => {
  //   state = { ...state, count: state.count + 1 };
  //   view.update(state);
  // };

  const viewProps = { searchDefinitions };
  const view = createDictionaryView(viewProps);

  view.update(state);

  return view;
}

export default createDictionaryPage;
