import createDictionaryView from "../views/dictionaryView.js";

function createDictionaryPage() {
  let state = { count: 0 };

  const onSearch = () => {
    state = { ...state, count: state.count + 1 };
    view.update(state);
  };

  // const onDecrement = () => {
  //   state = { ...state, count: state.count - 1 };
  //   view.update(state);
  // };

  const viewProps = { onSearch };
  const view = createDictionaryView(viewProps);

  view.update(state);

  return view;
}

export default createDictionaryPage;
