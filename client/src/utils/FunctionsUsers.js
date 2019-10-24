// USER
export const getMyProfile = async () => {
    const res = await fetch('/user/account/profile');
    const result = await res.json();
    return result;
};

export const getMyPicture = async () => {
    const res = await fetch('/user/account/picture');
    const result = await res.json();
    return result;
};

export const updateMyProfile = async (data) => {
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    };
    const res = await fetch('/user/account/update-profile', options);
    if (res.status === 200) {
        return true;
    } else {
        return false;
    };
};

export const updateMyPicture = async (data) => {
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    };
    const res = await fetch('/user/account/update-picture', options);
    if (res.status === 200) {
        return true;
    } else {
        return false;
    };
};