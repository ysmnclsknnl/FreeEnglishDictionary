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

  const searchDefinitions = async (e) => {
    e.preventDefault();

    // Set the loading state and reset the error state.
    updateState({ loading: true, error: null });
    const word = document.querySelector("#word-input").value.trim();

    try {
      console.log(`${BASE_URL}/${word} `);
      const results = await fetchData(`${BASE_URL}/${word} `);
      const arrayOfDefinitions = [];
      for (const result of results) {
        for (const meaning of result.meanings) {
          const { partOfSpeech, definitions } = meaning;
          for (const obj of definitions) {
            const { definition } = obj;
            arrayOfDefinitions.push({ partOfSpeech, definition });
          }
        }
      }

      // Loading was successful, update the state accordingly.

      updateState({
        definitions: arrayOfDefinitions,
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
