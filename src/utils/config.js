import * as tokenAbi from './abis/tokenAbi.json';
import * as govAbi from './abis/govAbi.json';
import * as vestingAbi from './abis/vestingAbi.json';

export const config = {
    networkId: 1,
    votxAbi: tokenAbi.default,
    votxAddress: "0xD8E3FB3b08eBA982F2754988d70D57eDc0055ae6",
    govAbi: govAbi.default,
    govAddress: "0xA7D2556Ac0F6cdCf264Ab882e5145A850e0cf7c3",
    vestingAbi: vestingAbi.default,
    vestingAddress: "0x2369921551f2417d8d5cD4C1EDb1ac7eEe156380",
    timelockAddress: "0x1e3c7B78d1c50Eb08e1bf85622b3e1611aeA9C51",
    etherscanLink: "https://etherscan.io",
};
