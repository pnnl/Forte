let initialState = {
    blank_placeholder: null,
    start_date: 1577923200000,
    end_date: 1578009600000,
}

const reducer = (state = initialState, action) => {
    if (action.type === "blank_placeholder") {
        return {...state, blank_placeholder: action.value}
    }
    if (action.type === "start_date") {
        return {...state, start_date: action.value}
    }
    if (action.type === "end_date") {
        return {...state, end_date: action.value}
    }

    return state;
}

export default reducer;