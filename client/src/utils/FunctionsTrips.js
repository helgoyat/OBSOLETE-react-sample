// TRIPS
export const createTrip = async (data) => {
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    };
    const res = await fetch('/trip/create', options);
    if (res.status === 200) {
        return true;
    } else {
        return false;
    };
};

export const deleteMyTrip = async (trip) => {
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ trip: trip })
    };
    const res = await fetch('/trip/delete', options);
    if (res.status === 200) {
        return true;
    } else {
        return false;
    };
};

export const countAvailableTrips = async (filter) => {
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(filter)
    };
    const res = await fetch('/trip/count-available', options);
    const result = await res.json();
    return result;
};

export const getAvailableTrips = async (filter, offset) => {
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(filter)
    };
    const res = await fetch(`/trip/available?offset=${offset}`, options);
    const result = await res.json();
    return result;
};

export const getMyAvailableTripsCondensed = async () => {
    const res = await fetch('/trip/account/available-condensed');
    const result = await res.json();
    return result;
};

export const countMyAvailableTrips = async () => {
    const res = await fetch('/trip/account/count-available');
    const result = await res.json();
    return result;
};

export const getMyAvailableTrips = async (offset) => {
    const res = await fetch(`/trip/account/available?offset=${offset}`);
    const result = await res.json();
    return result;
};

export const countMyCurrentTrips = async () => {
    const res = await fetch('/trip/account/count-current');
    const result = await res.json();
    return result;
};

export const getMyCurrentTrips = async (offset) => {
    const res = await fetch(`/trip/account/current?offset=${offset}`);
    const result = await res.json();
    return result;
};

export const countMyCompletedTrips = async () => {
    const res = await fetch('/trip/account/count-completed');
    const result = await res.json();
    return result;
};

export const getMyCompletedTrips = async (offset) => {
    const res = await fetch(`/trip/account/completed?offset=${offset}`);
    const result = await res.json();
    return result;
};