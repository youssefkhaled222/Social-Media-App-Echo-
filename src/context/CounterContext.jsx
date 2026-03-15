import { createContext, useState } from "react";

export const CounterContext = createContext();

export default function CounterContextProvider(props){

    const [counter , setCounter] = useState()

    return <CounterContext.Provider value={{counter , setCounter}}>
        {props.children}
    </CounterContext.Provider> 
}