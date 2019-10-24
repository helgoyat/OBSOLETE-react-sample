// GET JSON DATA FROM BE

// NO PARAM
export const getJSON = async (url) => {
    const res = await fetch(`/utils/${url}`);
    const result = await res.json();
    return result;
};

// ONE PARAM
export const getOneJSON = async (url, param) => {
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ param: param })
    };
    const res = await fetch(`/utils/${url}`, options);
    const result = await res.json();
    return result;
};

// // TWO PARAMS
export const getTwoJSON = async (url, param1, param2) => {
    const data = { param1, param2 };
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    };
    const res = await fetch(`/utils/${url}`, options);
    const result = await res.json();
    return result;
};