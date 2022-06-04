import createDictionaryView from "../views/dictionaryView.js";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
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

  const searchDefinitions = async (e) => {
    e.preventDefault();

    // Set the loading state and reset the error state.
    updateState({ loading: true, error: null });
    const word = document.querySelector("#word-input").value.trim();

    console.log(`word+${word}`);

    try {
      console.log(BASE_URL + "/" + word);
      const data = await fetchData(BASE_URL + "/" + word);
      let partOfSpeechArray = [];
      for (const meaning of data[0].meanings) {
        const { partOfSpeech, definitions } = meaning;
        partOfSpeechArray.push();
        for (const definition of definitions) {
          partOfSpeechArray.push({ partOfSpeech, definition });
        }
      }

      // Loading was successful, update the state accordingly.
      console.log(data[0].meanings);
      updateState({
        definitions: partOfSpeechArray,
        loading: false,
      });
    } catch (error) {
      // Loading failed, update the state with the caught error.
      updateState({ error, loading: false });
    }
  };

  const listSynonyms = () => {
    state = { ...state, count: state.count + 1 };
    view.update(state);
  };
  const listAntonyms = () => {
    state = { ...state, count: state.count + 1 };
    view.update(state);
  };
  // const onDecrement = () => {
  //   state = { ...state, count: state.count - 1 };
  //   view.update(state);
  // };

  const viewProps = { searchDefinitions, listSynonyms, listAntonyms };
  const view = createDictionaryView(viewProps);

  view.update(state);

  return view;
}

export default createDictionaryPage;
