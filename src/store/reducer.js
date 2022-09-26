let initialState = {
    blank_placeholder: null,
    url: "http://localhost:5000",
    start_date: 1588291200000, // https://www.epochconverter.com/ (Use the timestamp in milliseconds)
    end_date: 1588464000000,
    start_date_temp: 1588291200000,
    end_date_temp: 1588464000000,
    isLoadingUpdate: false,
    color_buttons: {"general": "rgb(224,224,224)", "focused": "rgb(108, 117, 125)"},
    actual_net_load: [],
    predicted_net_load: [],
    apparent_power: [],
    humidity: [],
    temperature: [],
    net_load_df: [],
    temperature_df: [],
    humidity_df: [],
    apparent_power_df: [],
    temperature_nans_percentage: 0,
    humidity_nans_percentage: 0,
    apparent_power_nans_percentage: 0,
    solar_penetration_temp: 50,
    solar_penetration: 50,
    temp_check: {"temperature":[], "humidity":[], "apparent_power":[]},
    updated_temperature:[],
    updated_humidity:[],
    updated_apparent_power:[],
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
    if (action.type === "net_load_df") {
        return { ...state, net_load_df: action.value }
     }
    if (action.type === "temperature_df") {
        return { ...state, temperature_df: action.value }
     } 
    if (action.type === "humidity_df") {
        return { ...state, humidity_df: action.value }
     } 
    if (action.type === "apparent_power_df") {
        return { ...state, apparent_power_df: action.value }
     } 
    if (action.type === "temperature_nans_percentage") {
        return { ...state, temperature_nans_percentage: action.value }
     } 
    if (action.type === "humidity_nans_percentage") {
        return { ...state, humidity_nans_percentage: action.value }
     } 
    if (action.type === "apparent_power_nans_percentage") {
        return { ...state, apparent_power_nans_percentage: action.value }
     }
    if (action.type === "solar_penetration_temp") {
        return { ...state, solar_penetration_temp: action.value }
    } 
    if (action.type === "solar_penetration") {
        return { ...state, solar_penetration: action.value }
     }
    if (action.type === "temp_check") {
        return { ...state, temp_check: action.value }
    }  
    if (action.type === "updated_temperature") {
        return { ...state, updated_temperature: action.value }
    }
    if (action.type === "updated_humidity") {
        return { ...state, updated_apparent_power: action.value }
    }
    if (action.type === "updated_apparent_power") {
        return { ...state, updated_apparent_power: action.value }
    }         

    return state;
}

export default reducer;