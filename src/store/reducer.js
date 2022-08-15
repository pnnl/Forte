let initialState = {
    blank_placeholder: null,
    url: "http://localhost:5000",
    start_date: 1577923200000,
    end_date: 1578009600000,
    start_date_temp: 1577923200000,
    end_date_temp: 1578009600000,
    isLoadingUpdate: false,
    color_buttons: {"general": "rgb(224,224,224)", "focused": "rgb(108, 117, 125)"},
    actual_net_load: [],
    predicted_net_load: [],
    apparent_power: [],
    humidity: [],
    temperature: [],
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
    if (action.type === "start_date_temp") {
        return {...state, start_date_temp: action.value}
    }
    if (action.type === "end_date_temp") {
        return {...state, end_date_temp: action.value}
    }
    if (action.type === "isLoadingUpdate") {
        return { ...state, isLoadingUpdate: action.value }
     }
    if (action.type === "actual_net_load") {
        return { ...state, actual_net_load: action.value }
     } 
    if (action.type === "predicted_net_load") {
        return { ...state, predicted_net_load: action.value }
     }
    if (action.type === "apparent_power") {
        return { ...state, apparent_power: action.value }
     }
    if (action.type === "humidity") {
        return { ...state, humidity: action.value }
     }
    if (action.type === "temperature") {
        return { ...state, temperature: action.value }
     }  

    return state;
}

export default reducer;