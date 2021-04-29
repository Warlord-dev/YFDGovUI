import { Decimal } from "decimal.js";

const defaultDecimal = 9;

const add = (value, decimals) => {
    return String(new Decimal(value)
        .times(new Decimal(10).pow(
            decimals ? decimals : defaultDecimal
        )));
}

const remove = (value, decimals) => {
    return Number(new Decimal(value)
        .dividedBy(new Decimal(10).pow(
            decimals ? decimals : defaultDecimal
        )));
}

export const precision = {
    add,
    remove,
};
