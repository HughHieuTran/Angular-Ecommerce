export function roundNumber(number: any, decimals: any) {
    var newnumber = new Number(number + '').toFixed(parseInt(decimals));
    return parseFloat(newnumber);
}