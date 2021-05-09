import * as tokenAbi from './abis/tokenAbi.json';
import * as govAbi from './abis/govAbi.json';
import * as vestingAbi from './abis/vestingAbi.json';

export const config = {
    networkId: 1,
    votxAbi: tokenAbi.default,
    votxAddress: "0x3BEbdcE1219c394DFaA1df781F9Aa31D179dFf47",
    govAbi: govAbi.default,
    govAddress: "0x2018f98B50C707AECfbd2F22622869Bc02A3f869",
    vestingAbi: vestingAbi.default,
    vestingAddress: "0x2EBEfac1C07AF7976A098e1F4AEF47AB42a122E3",
    timelockAddress: "0xfe15bb51fe50ec38e636b0a1a1ed785016455c89",
    etherscanLink: "https://etherscan.io",
};
