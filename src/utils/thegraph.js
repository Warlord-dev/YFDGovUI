import axios from 'axios';
const apiUrl = "https://api.thegraph.com/subgraphs/name/zoracles/governance";
const blockApi = "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks";

const fetchAggregatedData = () => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${apiUrl}`,
                {
                    "query": `{
                        governance(id: "GOVERNANCE") {
                            proposals,
                            totalDelegates,
                            totalTokenHolders,
                            currentDelegates,
                            currentTokenHolders,
                            delegatedVotes,
                            delegatedVotesRaw,
                            proposalsQueued,
                        }
                    }`
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                resolve(res.data.data.governance);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchProposal = (proposalId) => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${apiUrl}`,
                {
                    "query": `
                        query ($proposalId: String!) {
                            proposals(
                                where: {
                                    id: $proposalId
                                }
                            ) 
                        {
                            id,
                            proposer {
                                id,
                            },
                            targets,
                            values,
                            signatures,
                            calldatas,
                            startBlock,
                            endBlock,
                            description,
                            status,
                            executionETA,
                            votes {
                                support,
                                votes,
                                voter {
                                    id
                                },
                            },
                        }
                    }`,
                    variables: {
                        proposalId: String(proposalId)
                    }
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async (res) => {
                const proposal = res.data.data.proposals[0];

                const startUnixTime = await fetchBlockTimestamp(proposal.startBlock);
                proposal.startTime = startUnixTime;

                const endUnixTime = await fetchBlockTimestamp(proposal.endBlock);
                proposal.endTime = endUnixTime;

                resolve(proposal);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchProposals = () => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${apiUrl}`,
                {
                    "query": `{
                        proposals(
                            orderBy: startBlock,
                            orderDirection: desc,
                        ) {
                            id,
                            proposer {
                                id,
                            },
                            targets,
                            values,
                            signatures,
                            calldatas,
                            startBlock,
                            endBlock,
                            description,
                            status,
                            executionETA,
                            votes {
                                support,
                                votes,
                            },
                        }
                    }`
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                resolve(res.data.data.proposals);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchActiveDelegates = () => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${apiUrl}`,
                {
                    "query": `{
                        delegates(
                            first: 100,
                            orderBy: delegatedVotesRaw,
                            orderDirection: desc,
                            where: {delegatedVotes_gt: 0}
                        ) {
                            id,
                            delegatedVotesRaw,
                            delegatedVotes,
                            tokenHoldersRepresentedAmount,
                            tokenHoldersRepresented {
                                id,
                            },
                            votes {
                                id,
                                support,
                                votes,
                                proposal {
                                    id,
                                },
                            },
                            proposals {
                                id,
                                status,
                            },
                        },
                    }`
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                resolve(res.data.data.delegates);
            })
            .catch((error) => {
                console.log(error)
                reject(error);
            });
    });
};

const fetchDelegateInfo = (address) => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${apiUrl}`,
                {
                    "query": `
                        query ($address: String!) {
                            delegates(
                                where: {
                                    id: $address
                                }
                            ) 
                        {
                            id,
                            delegatedVotes,
                            delegatedVotesRaw,
                            tokenHoldersRepresentedAmount,
                            proposals {
                                id,
                                description,
                                status
                            },
                            votes {
                                id,
                                support,
                                proposal {
                                    id,
                                    description,
                                    status,
                                }
                            },
                        }
                    }`,
                    variables: {
                        address: String(address)
                    }
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                resolve(res.data.data.delegates[0]);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchAddressBalance = (address) => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${apiUrl}`,
                {
                    "query": `
                        query ($address: String!) {
                            tokenHolders(
                                where: {
                                    id: $address
                                }
                            ) 
                        {
                            tokenBalance,
                            tokenBalanceRaw,
                        }
                    }`,
                    variables: {
                        address: String(address)
                    }
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                resolve(res.data.data.tokenHolders[0]);
            })
            .catch((error) => {
                reject(error);
            });
    });
};


const fetchBlockTimestamp = (blockNumber) => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${blockApi}`,
                {
                    "query": `
                        query ($blockNumber: String!) {
                            blocks(
                                where: {
                                    number: $blockNumber
                                }
                            ) 
                        {
                            timestamp
                        }
                    }`,
                    variables: {
                        blockNumber: String(blockNumber)
                    }
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                const timestamp = res.data.data.blocks[0].timestamp;
                resolve(Number(timestamp));
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const thegraph = {
    fetchProposal,
    fetchProposals,
    fetchAggregatedData,
    fetchActiveDelegates,
    fetchDelegateInfo,
    fetchAddressBalance,
    fetchBlockTimestamp,
};
