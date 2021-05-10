import React, { useEffect, useState } from "react";
import "../../styles/addressInfo.css";
import AlertModal from "../Utils/AlertModal";
import { Row, Col } from "react-bootstrap";
import { precision } from "../../utils/precision";
import { config } from '../../utils/config';
import redirectIcon from "../../assets/images/redirect-icon.png";

const Vesting = () => {
    const [state, setState] = useState({
        balance: 0,
        votxInLockup: 0,
        cliffPeriod: "",
        vestingPeriod: "",
        amountAvailable: "",
        vestingStartTime: "",
        daysAlreadyPassed: "",
        isCliffPeriodPassed: false,
        totalTokenVested: "",
    });

    const [details, setDetails] = useState({
        beneficiary: "",
        amount: "",
        cliffPeriod: "",
        vestingPeriod: "",
    });

    const [processing, setProcessing] = useState(false);
    const [depositing, setDepositing] = useState(false);

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });
    const [metamaskError, showMetamaskError] =
        useState(false);

    const getHoldings = async () => {
        const balance = await window.votxContract
            .methods
            .balanceOf(window.userAddress)
            .call();

        const info = await window.vestingContract
            .methods
            .addressInfo(window.userAddress)
            .call();


        const totalTokenVested = await window.vestingContract
            .methods
            .totalTokensVested()
            .call();

        if (info) {
            const amountAvailable = await window.vestingContract
                .methods
                .getAvailableTokens(window.userAddress)
                .call();

            const alreadyWithdrawn = await window.vestingContract
                .methods
                .tokensAlreadyWithdrawn(window.userAddress)
                .call();

            const votxInLockup = Number(info.vestedTokens) -
                Number(alreadyWithdrawn)

            const daysAlreadyPassed = (Math.floor(Date.now() / 1000) -
                Number(info.vestingStartTime)) / 86400;

            const isCliffPeriodPassed = (Math.floor(Date.now() / 1000)) >
                (Number(info.vestingStartTime) + (Number(info.vestingPeriod) * 86400))

            setState({
                balance,
                votxInLockup,
                amountAvailable,
                daysAlreadyPassed,
                isCliffPeriodPassed,
                totalTokenVested,
                cliffPeriod: info.cliffPeriod,
                vestingPeriod: info.vestingPeriod,
                vestingStartTime: info.vestingStartTime,
            });
        }
    };

    const handleVerifyAndDeposit = async () => {
        let info = null;
        let message = null;

        if (details.beneficiary) {
            info = await window.vestingContract
                .methods
                .addressInfo(details.beneficiary)
                .call();
        }

        if (
            !details.beneficiary || !details.amount ||
            !details.cliffPeriod || !details.vestingPeriod
        ) {
            message = "All four fields are mandatory !!";
        } else if (details.beneficiary.length !== 42) {
            message = "Beneficiary must be an ethereum address !!";
        } else if (Number(details.vestingPeriod) < Number(details.cliffPeriod)) {
            message = "Vesting period must be more than cliff period !!";
        } else if (
            Number(state.balance) <=
            Number(precision.add(details.amount))
        ) {
            message = "Lockup Token amount must be less than available balance !!";
        } else if (Number(info.vestedTokens) > 0) {
            message = "Beneficiary already have locked VOTXv2 in vesting contract !!";
        }

        if (message) {
            setErrorModal({
                open: true,
                msg: message,
            });
        } else {
            checkTokenApproval();
        }
    };

    const checkTokenApproval = async () => {
        const tokenApproved = await window.votxContract
            .methods.allowance(
                details.beneficiary,
                config.vestingAddress,
            )
            .call();

        if (Number(tokenApproved) < Number(details.amount)) {
            window.votxContract.methods.approve
                (
                    config.vestingAddress,
                    precision.add(10000),
                )
                .send({ from: window.userAddress })
                .on("transactionHash", () => {
                    setDepositing(true);
                })
                .then(() => {
                    setDepositing(false);
                    handleDeposit();
                })
                .catch((error) => {
                    setDepositing(false);
                    setErrorModal({
                        open: true,
                        msg: error.message,
                    });
                });
        } else {
            handleDeposit();
        }
    };

    const handleDeposit = () => {
        window.vestingContract
            .methods
            .deposit(
                details.beneficiary,
                precision.add(details.amount),
                details.cliffPeriod,
                details.vestingPeriod,
            )
            .send({ from: window.userAddress })
            .on("transactionHash", () => {
                setDepositing(true);
            })
            .on("receipt", () => {
                setDepositing(false);
                getHoldings();
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    };

    const handleWithdraw = () => {
        window.vestingContract
            .methods
            .withdraw()
            .send({ from: window.userAddress })
            .on("transactionHash", () => {
                setProcessing(true);
            })
            .on("receipt", () => {
                setProcessing(false);
                getHoldings();
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    };

    useEffect(() => {
        if (typeof window.ethereum === 'undefined' ||
            !window.ethereum.isConnected() ||
            !window.ethereum.selectedAddress ||
            config.networkId !== Number(window.chainId)
        ) {
            showMetamaskError(true);
        } else {
            getHoldings();
        }
    }, []);

    return (
        <div id="Account-Profile">
            <section className="hero">
                <div className="container">
                    <div className="page-header">
                        <h3 style={{ marginLeft: "10px" }}>
                            Vesting
                        </h3>

                        <div className="profile-header__details">
                            <span className="profile-header__details__address mobile-hide">
                                {config.vestingAddress}
                                <a
                                    className="links"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`${config.etherscanLink}/address/${config.vestingAddress}`}
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
                                {config.vestingAddress.substr(0, 10)}.....{config.vestingAddress.substr(32, 42)}
                                <a
                                    className="links"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`${config.etherscanLink}/address/${config.vestingAddress}`}
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
                                    <h4>Account Summary</h4>
                                </div>
                                <div className="holdings-panel__holdings">
                                    <div className="holdings-panel__holdings__row">
                                        <label className="holdings-panel__holdings__row__label">
                                            VOTXv2 In Lockup
                                        </label>
                                        <p className="holdings-panel__holdings__row__value">
                                            <span>{precision.remove(Number(state.votxInLockup))} </span>
                                        </p>
                                    </div>

                                    {Number(state.votxInLockup) > 0 ?
                                        <div>
                                            <div className="holdings-panel__holdings__row">
                                                <div className="holdings-panel__holdings__row__votes-label">
                                                    <label className="holdings-panel__holdings__row__label">
                                                        Amount Available To Withdraw
                                                    </label>
                                                </div>

                                                <p className="holdings-panel__holdings__row__value">
                                                    {state.amountAvailable ?
                                                        <span>{precision.remove(Number(state.amountAvailable))} </span> :
                                                        <span> — </span>}
                                                </p>

                                                {Number(state.amountAvailable) > 0 ?
                                                    <span
                                                        className="btn delegate-token"
                                                        onClick={handleWithdraw}
                                                    >
                                                        {processing ?
                                                            <div className="d-flex align-items-center">
                                                                Processing
                                                                <span className="loading ml-2"></span>
                                                            </div>
                                                            :
                                                            <div>Withdraw Tokens</div>
                                                        }
                                                    </span>
                                                    : null
                                                }
                                            </div>

                                            <div className="holdings-panel__holdings__row">
                                                <div className="holdings-panel__holdings__row__votes-label">
                                                    <label className="holdings-panel__holdings__row__label">
                                                        Days Already Passed
                                                    </label>
                                                </div>

                                                <p className="holdings-panel__holdings__row__value">
                                                    {state.daysAlreadyPassed ?
                                                        <span>{state.daysAlreadyPassed.toFixed(2)} Days</span> :
                                                        <span> — </span>}
                                                </p>
                                            </div>
                                        </div>
                                        : null
                                    }

                                    <div className="holdings-panel__holdings__row">
                                        <div className="holdings-panel__holdings__row__votes-label">
                                            <label className="holdings-panel__holdings__row__label">
                                                Cliff Period
                                            </label>
                                        </div>

                                        <p className="holdings-panel__holdings__row__value">
                                            {Number(state.cliffPeriod) > 0 ?
                                                <span>{state.cliffPeriod} Days</span> :
                                                <span> — </span>}
                                        </p>
                                    </div>

                                    <div className="holdings-panel__holdings__row">
                                        <div className="holdings-panel__holdings__row__votes-label">
                                            <label className="holdings-panel__holdings__row__label">
                                                Vesting Period
                                            </label>
                                        </div>

                                        <p className="holdings-panel__holdings__row__value">
                                            {Number(state.vestingPeriod) > 0 ?
                                                <span>{state.vestingPeriod} Days</span> :
                                                <span> — </span>}
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
                                                Deposit In Vesting Contract
                                            </h4>
                                            <h5 style={{ color: "gray", fontWeight: "bold" }}>
                                                {Number(state.totalTokenVested) > 0 ?
                                                    <span>
                                                        <span>Total Vested: </span>
                                                        <span>
                                                            {precision.remove(state.totalTokenVested)}
                                                        </span>
                                                        <span> VOTXv2</span>
                                                    </span>
                                                    : <span>0.00 VOTXv2</span>
                                                }
                                            </h5>
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
                                            <Row style={{ marginBottom: "10px", marginTop: "8px" }}>
                                                <Col className="vesting-form-text">
                                                    Beneficiary Address:
                                                </Col>
                                                <Col sm={8}>
                                                    <input
                                                        className="vote-button mb-3"
                                                        placeholder="Ethereum address of beneficiary"
                                                        type="text"
                                                        onChange={(e) => setDetails({
                                                            ...details,
                                                            beneficiary: e.target.value
                                                        })}
                                                        value={details.beneficiary}
                                                    />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginBottom: "10px" }}>
                                                <Col className="vesting-form-text">
                                                    Deposit Amount:
                                                </Col>
                                                <Col sm={8}>
                                                    <input
                                                        className="vote-button mb-3"
                                                        placeholder="Number of VOTXv2 to Lock"
                                                        type="number"
                                                        step="0"
                                                        min="0"
                                                        onChange={(e) => setDetails({
                                                            ...details,
                                                            amount: e.target.value
                                                        })}
                                                        value={details.amount}
                                                    />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginBottom: "10px" }}>
                                                <Col className="vesting-form-text">
                                                    Cliff Period:
                                                </Col>
                                                <Col sm={8}>
                                                    <input
                                                        className="vote-button mb-3"
                                                        placeholder="Cliff Period in days (eg. 180)"
                                                        type="number"
                                                        step="0"
                                                        min="0"
                                                        onChange={(e) => setDetails({
                                                            ...details,
                                                            cliffPeriod: e.target.value
                                                        })}
                                                        value={details.cliffPeriod}
                                                    />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginBottom: "10px" }}>
                                                <Col className="vesting-form-text">
                                                    Vesting Period:
                                                </Col>
                                                <Col sm={8}>
                                                    <input
                                                        className="vote-button mb-3"
                                                        placeholder="Vesting Period in days (eg. 360)"
                                                        type="number"
                                                        step="0"
                                                        min="0"
                                                        onChange={(e) => setDetails({
                                                            ...details,
                                                            vestingPeriod: e.target.value
                                                        })}
                                                        value={details.vestingPeriod}
                                                    />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginBottom: "18px" }}>
                                                <Col className="vesting-form-text">
                                                    Withdrawal Per Day:
                                                </Col>
                                                <Col sm={8}>
                                                    <input
                                                        disabled
                                                        className="vote-button mb-3"
                                                        placeholder="Amount that can be withdrawn every day"
                                                        value={
                                                            Number(details.vestingPeriod) ?
                                                                (Number(details.amount) / Number(details.vestingPeriod)) + " VOTXv2"
                                                                : ""
                                                        }
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
                                                onClick={handleVerifyAndDeposit}
                                            >
                                                {depositing ?
                                                    <div
                                                        className="d-flex align-items-center"
                                                    >
                                                        Processing
                                                        <span className="loading ml-2"></span>
                                                    </div>
                                                    :
                                                    <div>Deposit</div>
                                                }
                                            </button>

                                            {Number(state.votxInLockup) > 0 ?
                                                <div className="warning-info">
                                                    You already have locked VOTXv2 in Vesting contract.
                                                </div>
                                                : null
                                            }
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

export default Vesting;
