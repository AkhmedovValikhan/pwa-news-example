export const getWindow = () => {
    return window;
};

export const isPromiseLike = (obj: any): obj is Promise<any> => {
    return !!obj.then;
};

export const tickMarcroTask = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
};
