let initialState = {
    blank_placeholder: null,
}

const reducer = (state = initialState, action) => {
    if (action.type === "blank_placeholder") {
        return {...state, blank_placeholder: action.value}
    }

    return state;
}

export default reducer;