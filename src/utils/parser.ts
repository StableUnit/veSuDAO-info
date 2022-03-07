import BN from "bn.js";
import {CONTRACTS_ETHERSCAN_URL} from "../constants/contract";

export const EPS = 0.0001;
const FRACTION_DIGITS = 4;
const FRACTION_DIGITS_LONG = 8;

export const addNumberSpace = (num?: number, needBigFraction = false) => (
    num
        ? num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: needBigFraction ? FRACTION_DIGITS_LONG : FRACTION_DIGITS,
        })
        : '0'
);

export const removeFractions = (num: number, fraction = FRACTION_DIGITS) => +num.toFixed(fraction);

export const checkAddress = (address?: string) => address && address !== '0x0000000000000000000000000000000000000000';
export const getShortAddress = (address?: string) => (address && address.length > 8)
    ? `${address.slice(0, 4)}...${address.slice(address.length - 4)}`
    : address;

export const toHRNumber = (bn: BN, decimal = 0) => bn.div(new BN(10).pow(new BN(decimal))).toNumber();
export const toHRNumberFloat = (bn?: BN, decimal = 0) => bn ? toHRNumber(bn.muln(1000), decimal) / 1000 : 0;
export const ACCURACY = 100;
export const fromHRNumber = (n: number, decimal = 0) => new BN(10).pow(new BN(decimal)).muln(n * ACCURACY).divn(ACCURACY);

export const getTokenUrl = (addr: string) => `https://${CONTRACTS_ETHERSCAN_URL}/address/${addr}`;

export const mul1eN = (bn: BN, n: number) => bn.mul(new BN(10).pow(new BN(n)));