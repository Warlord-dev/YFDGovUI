import React, { useEffect, useState } from "react";
import "../../styles/addressInfo.css";
import AlertModal from "../Utils/AlertModal";
import { Row, Col } from "react-bootstrap";
import { precision } from "../../utils/precision";
import { config } from '../../utils/config';
import redirectIcon from "../../assets/images/redirect-icon.png";

const CreateProposal = () => {
    const [state, setState] = useState({
        timelockBalance: "",
    });

    const [details, setDetails] = useState({
        receiverAddress: "",
        releaseAmount: "",
    });

    const [processing, setProcessing] = useState(false);
    const [metamaskError, showMetamaskError] = useState(false);
    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const getState = async () => {
        const timelockBalance = await window.votxContract
            .methods
            .balanceOf(config.timelockAddress)
            .call();


        setState({ timelockBalance });
    };

    const handleVerifyAndSubmit = async () => {
        let message = null;

        if (!details.receiverAddress || !details.releaseAmount) {
            message = "Both fields are mandatory !!";
        } else if (details.receiverAddress.length !== 42) {
            message = "receiverAddress must be an ethereum address !!";
        } else if (
            Number(state.timelockBalance) <=
            Number(precision.add(details.releaseAmount))
        ) {
            message = "Release amount must be less than locked balance !!";
        }

        if (message) {
            setErrorModal({
                open: true,
                msg: message,
            });
        } else {
            createProposal();
        }
    };

    const createProposal = () => {
        window.govContract
            .methods
            .propose(
                [window.votxAddress],
                ['0'],
                ['transfer(address,uint256)'],
                [encodeParameters(
                    ['address', 'uint256'],
                    [
                        details.receiverAddress,
                        precision.add(
                            details.releaseAmount
                        ),
                    ]
                )],
                `Release ${details.releaseAmount} VOTXv2 From Timelock`,
            )
            .send({ from: window.userAddress })
            .on("transactionHash", () => {
                setProcessing(true);
            })
            .then(() => {
                setProcessing(false);
                getState();
            })
            .catch((error) => {
                setProcessing(false);
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    };

    const encodeParameters = (types, values) => {
        console.log(window.web3.eth.abi
            .encodeParameters(
                types, values,
            ))
        return window.web3.eth.abi
            .encodeParameters(
                types, values,
            );
    };

    useEffect(() => {
        if (typeof window.ethereum === 'undefined' ||
            !window.ethereum.isConnected() ||
            !window.ethereum.selectedAddress ||
            config.networkId !== Number(window.chainId)
        ) {
            showMetamaskError(true);
        } else {
            getState();
        }
    }, []);

    return (
        <div id="Account-Profile" style={{ paddingBottom: "0px" }}>
            <section className="hero">
                <div className="container">
                    <div className="page-header">
                        <h3 style={{ marginLeft: "10px" }}>
                            Create Proposal
                        </h3>

                        <div className="profile-header__details">
                            <span className="profile-header__details__address mobile-hide">
                                {config.govAddress}
                                <a
                                    className="links"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`${config.etherscanLink}/address/${config.govAddress}`}
                                >
                                    <img
                                        className="holdings-panel__holdings__row__votes-label__icon"
                                        alt="Redirect Icon"
                                        src={redirectIcon}
                                        style={{ height: "25px", width: "25px", marginBottom: "5px" }}
                                    />
                                </a>
                            </span>

                            <span className="profile-header__details__address profile-header__details__address--mobile">
                                {config.govAddress.substr(0, 10)}.....{config.govAddress.substr(32, 42)}
                                <a
                                    className="links"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`${config.etherscanLink}/address/${config.govAddress}`}
                                >
                                    <img
                                        className="holdings-panel__holdings__row__votes-label__icon"
                                        alt="Redirect Icon"
                                        src={redirectIcon}
                                        style={{ height: "25px", width: "25px", marginBottom: "5px" }}
                                    />
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="account-details">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-4 holdings-panel">
                            <div className="governance-panel">
                                <div className="governance-panel__header">
                                    <h4>Future Token Summary</h4>
                                </div>
                                <div className="holdings-panel__holdings">
                                    <div className="holdings-panel__holdings__row">
                                        <label className="holdings-panel__holdings__row__label">
                                            VOTXv2 Locked
                                        </label>
                                        <p className="holdings-panel__holdings__row__value">
                                            {state.timelockBalance ?
                                                <span>{precision.remove(Number(state.timelockBalance))} </span> :
                                                <span> — </span>}
                                        </p>
                                    </div>

                                    <div className="holdings-panel__holdings__row">
                                        <div className="holdings-panel__holdings__row__votes-label">
                                            <label className="holdings-panel__holdings__row__label">
                                                Voting Duration
                                            </label>
                                        </div>

                                        <p className="holdings-panel__holdings__row__value">
                                            5 days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-8 transactions-panel">
                            <div className="governance-panel">
                                <div>
                                    <div className="governance-panel__header votes-panel__header">
                                        <div className="votes-panel__header__title-bar">
                                            <h4 style={{ color: "#ffc107" }}>
                                                Create Proposal To Release VOTXv2
                                            </h4>
                                        </div>
                                        <div className="votes-panel__header__vote-bar">
                                            <div
                                                className="votes-panel__header__vote-bar__fill"
                                                style={{ width: "100%" }}
                                            />
                                        </div>
                                    </div>

                                    {!metamaskError ?
                                        <div className="p-4">
                                            <Row style={{ marginBottom: "15px", marginTop: "8px" }}>
                                                <Col className="vesting-form-text">
                                                    Receiver Address:
                                                </Col>
                                                <Col sm={8}>
                                                    <input
                                                        className="vote-button mb-3"
                                                        placeholder="Address who will receive VOTXv2"
                                                        type="text"
                                                        onChange={(e) => setDetails({
                                                            ...details,
                                                            receiverAddress: e.target.value
                                                        })}
                                                        value={details.receiverAddress}
                                                    />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginBottom: "20px" }}>
                                                <Col className="vesting-form-text">
                                                    Release Amount:
                                                </Col>
                                                <Col sm={8}>
                                                    <input
                                                        className="vote-button mb-3"
                                                        placeholder="Number of VOTXv2 to Release"
                                                        type="number"
                                                        step="0"
                                                        min="0"
                                                        onChange={(e) => setDetails({
                                                            ...details,
                                                            releaseAmount: e.target.value
                                                        })}
                                                        value={details.releaseAmount}
                                                    />
                                                </Col>
                                            </Row>

                                            <button
                                                style={{
                                                    width: "50%",
                                                    marginLeft: "25%",
                                                    marginBottom: "10px",
                                                    textAlign: "center"
                                                }}
                                                className="submit-button"
                                                onClick={handleVerifyAndSubmit}
                                            >
                                                {processing ?
                                                    <div
                                                        className="d-flex align-items-center"
                                                    >
                                                        Processing
                                                        <span className="loading ml-2"></span>
                                                    </div>
                                                    :
                                                    <div>Submit Proposal</div>
                                                }
                                            </button>
                                        </div>
                                        :
                                        <div
                                            style={{ marginTop: "18%", paddingBottom: "18%" }}
                                        >
                                            <p style={{ textAlign: "center", fontSize: "large", color: "orange" }}>
                                                You have not connected to metamask or You don't have Metamask.<br />
                                                Please connect first !!
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AlertModal
                open={errorModal.open}
                toggle={() => setErrorModal({
                    ...errorModal, open: false
                })}
            >
                {errorModal.msg}
            </AlertModal>
        </div>
    );
};

export default CreateProposal;
