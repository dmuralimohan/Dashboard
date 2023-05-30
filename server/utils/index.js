/*
    Contains have common functions
*/

const createCookie = ({path, httpOnly, sameSite, expires, data}) => {
    const cookieOptions = {
        path: path ?? "/",
        httpOnly: httpOnly ?? true,
        secure: true,
        sameSite: sameSite ?? "none",
        expires: expires ?? new Date(new Date().getSeconds() + 900)
    };
    const cookie = `${data}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;

    return cookie;
};

module.exports = {
    createCookie
}