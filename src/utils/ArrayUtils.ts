export const times = (count: number) => {
    const res = new Array(count);
    for(let i = 0; i < count; i++){
        res[i] = i;
    }
    return res;
}