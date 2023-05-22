
const ResourceObject = {
    1000: "Unauthorized user",
    1001: "Token Expired Error",
    1002: "Refreshtoken Expired Error",
    1003: "Invalid Credentials",
    1004: "User not Found",
    1005: "Success"
};

export const getResourceValue = (key) =>{
    if(key in ResourceObject)
    {
        return ResourceObject[key];
    }
    else{
        return key;
    }
}