import {useCallback, useState} from "react";

const useGlance = () => {
    const [mints, setMints] = useState([])

    const fetchMints = async() => {
        try {
            const response = await fetch(`https://api.thegraph.com/subgraphs/name/atkinsonholly/glance`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
                body: JSON.stringify({
                    query: `
                        query {
                            mints(first: 10) {
                            tokenId
                            owner
                        }
                    }`
                }),
            })
            const parsedResponse = await response.json();
            setMints(parsedResponse.data.mints)
        } catch(error) {
            console.log(error)
        }
    }
    return {
        fetchMints: useCallback(fetchMints, []),
        mints: mints
    }
};

export { useGlance };