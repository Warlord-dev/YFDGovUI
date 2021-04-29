import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import userLogo from "../../assets/images/user.png";
import iconAvatar from "../../assets/images/icon-avatar.svg";
import redirectIcon from "../../assets/images/redirect-icon.png";
import { thegraph } from "../../utils/thegraph";
import AlertModal from "../Utils/AlertModal";
import SuccessModal from "../Utils/SuccessModal";
import { config } from "../../utils/config";
import "../../styles/addressInfo.css";

const AddressInfo = () => {
    const { address } = useParams();
    const [delegateInfo, setDelegateInfo] = useState({
        id: "",
        delegatedVotes: "",
        delegatedVotesRaw: "",
        tokenHoldersRepresentedAmount: "",
        proposals: [],
        votes: [],
    });

    const [votxBalance, setVotxBalance] = useState(0);
    const [delegating, setDelegating] = useState(false);
    const [addressRank, setAddressRank] = useState("");

    const [successModal, setSuccessModal] = useState({
        msg: "",
        open: false,
    });

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false,
    });

    const fetchAddressInfo = () => {
        thegraph.fetchAddressBalance(address)
            .then((data) => {
                setVotxBalance(
                    data ? data.tokenBalance : 0
                );
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });

        thegraph.fetchDelegateInfo(address)
            .then((data) => {
                setDelegateInfo(
                    data ? data : {
                        id: "",
                        delegatedVotes: "",
                        delegatedVotesRaw: "",
                        proposals: [],
                        votes: [],
                    }
                );
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });

        thegraph.fetchActiveDelegates()
            .then((data) => {
                if (data && data.length > 0) {
                    data.forEach((element, position) => {
                        if (element.id.toLowerCase() ===
                            address.toLowerCase()
                        ) {
                            setAddressRank(position + 1);
                        }
                    });
                }
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    }

    const handleDelegate = () => {
        window.votxContract.methods
            .delegate(window.userAddress)
            .send({ from: window.userAddress })
            .on("transactionHash", () => {
                setDelegating(true);
            })
            .on("receipt", () => {
                setDelegating(false);
                setSuccessModal({
                    open: true,
                    msg: "Congratulations 🎉 !! " +
                        "You have successfully delegated your VOTX !!",
                });
            })
            .catch((error) => {
                setDelegating(false);
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    };

    useEffect(() => {
        fetchAddressInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div id="Account-Profile">
            <section className="hero">
                <div className="container">
                    <div className="page-header">
                        <div className="page-header__main-section">
                            <Link
                                className="page-header__main-section__back"
                                to="/"
                            >
                                <p className="small page-header__main-section__back__text">
                                    Dashboard
                                </p>
                            </Link>
                            <div className="page-header__main-section__title">
                                <div className="profile-header">
                                    <div className="gov-profile-image gov-profile-image--large">
                                        <img
                                            className="gov-profile-image__raw-image"
                                            alt="User Logo"
                                            src={userLogo}
                                        />
                                        <div className="gov-profile-image__proposer-icon" />
                                    </div>
                                    <div className="profile-header__details">
                                        <span className="profile-header__details__address mobile-hide">
                                            {address}

                                            <a
                                                className="links"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`${config.etherscanLink}/address/${address}`}
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
                                            {address.substr(0, 10)}.....{address.substr(32, 42)}

                                            <a
                                                className="links"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`${config.etherscanLink}/address/${address}`}
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
                        </div>
                        <div className="page-header__detail-section">
                            <div className="rank-pane">
                                <label className="rank-pane__text">Rank</label>
                                <h4 className="rank-pane__number">
                                    {delegateInfo.id ? <span> {addressRank} </span> :
                                        <span> — </span>}
                                </h4>
                            </div>
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
                                    <h4>Holdings</h4>
                                </div>
                                <div className="holdings-panel__holdings">
                                    <div className="holdings-panel__holdings__row">
                                        <label className="holdings-panel__holdings__row__label">
                                            VOTX Balance
                                        </label>
                                        <p className="holdings-panel__holdings__row__value">
                                            {Number(votxBalance).toFixed(4)}
                                        </p>
                                    </div>

                                    <div className="holdings-panel__holdings__row">
                                        <div className="holdings-panel__holdings__row__votes-label">
                                            <label className="holdings-panel__holdings__row__label">
                                                Votes
                                            </label>
                                            <img
                                                className="holdings-panel__holdings__row__votes-label__icon"
                                                alt="Avatar"
                                                src={iconAvatar}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <label className="holdings-panel__holdings__row__label">
                                                {delegateInfo.id ? delegateInfo.votes.length :
                                                    null}
                                            </label>
                                        </div>

                                        <p className="holdings-panel__holdings__row__value">
                                            {delegateInfo.id ? Number(delegateInfo.delegatedVotes).toFixed(4) :
                                                <span> — </span>}
                                        </p>

                                        {window.userAddress && address === window.userAddress.toLowerCase() &&
                                            Number(delegateInfo.delegatedVotes) < Number(votxBalance) ?
                                            <div
                                                className="btn delegate-token"
                                                onClick={handleDelegate}
                                            >
                                                {delegating ?
                                                    <div className="d-flex align-items-center">
                                                        Processing
                                                        <span className="loading ml-2"></span>
                                                    </div>
                                                    :
                                                    <div>Delegate Token</div>
                                                }
                                            </div>
                                            : null
                                        }

                                        {/* <div className="tooltip">
                                            <div className="holdings-panel__holdings__row__vote-weight">
                                                <div
                                                    className="holdings-panel__holdings__row__vote-weight__fill"
                                                    style={{ width: "100%" }}
                                                />
                                                <div className="tooltip__text">
                                                    <p className="tooltip__text__headline">
                                                        345,028
                                                        <span className="holdings-panel__holdings__row__vote-weight__separator">
                                                        </span>
                                                        100,000
                                                    </p>

                                                    <p className="tooltip__text__subtext holdings-panel__holdings__row__vote-weight__tooltip">
                                                        If you have over 100,000 votes, you are able to
                                                        create a proposal.
                                                    </p>
                                                    <Link
                                                        className="tooltip__text__link"
                                                        target="__blank"
                                                        to="/docs/governance"
                                                    >
                                                        Learn more
                                                    </Link>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>

                                    <div className="holdings-panel__holdings__row">
                                        <label className="holdings-panel__holdings__row__label">
                                            Proposal Created
                                        </label>
                                        <p className="holdings-panel__holdings__row__value">
                                            {delegateInfo.id ? delegateInfo.proposals.length :
                                                <span> — </span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-8 transactions-panel">
                            <div className="governance-panel">
                                <div className="governance-panel__header">
                                    <h4>Voting History</h4>
                                </div>

                                <div className="proposals">
                                    {delegateInfo.votes.map((vote, key) => (
                                        <Link key={key} className="proposal" to={`/proposals/${vote.proposal.id}`}>
                                            <div className="proposal__content">
                                                <div className="proposal__content__description">
                                                    <div className="proposal__content__description__title">
                                                        <span className="mr-3">{vote.proposal.id}</span>
                                                        <span className="mr-3">•</span>
                                                        {vote.proposal.status === "CANCELLED" ?
                                                            <span className="mr-3 proposal__content__description__details__tag--failed">
                                                                Failed
                                                            </span>
                                                            :
                                                            <span className="mr-3 proposal__content__description__details__tag--passed">
                                                                {vote.proposal.status === "ACTIVE" ? "Active" : (
                                                                    vote.proposal.status === "QUEUED"
                                                                ) ? "In Queue" : "Created"}
                                                            </span>
                                                        }
                                                        {vote.proposal.description.split(/\r?\n/)[0]}
                                                    </div>
                                                </div>
                                            </div>
                                            {vote.support ?
                                                <div style={{ marginTop: "15px" }} className="proposal__receipt-support proposal__receipt-support--for">
                                                    <p className="proposal__receipt-support__text">For</p>
                                                </div>
                                                :
                                                <div className="proposal__receipt-support proposal__receipt-support--against">
                                                    <p className="proposal__receipt-support__text">Against</p>
                                                </div>
                                            }
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12 voting-history-panel">
                            <div className="governance-panel">
                                <div className="governance-panel__header">
                                    <h4>Proposals Created</h4>
                                </div>
                                <div className="proposals">
                                    {delegateInfo.proposals.map((proposal, key) => (
                                        <Link key={key} className="proposal" to={`/proposals/${proposal.id}`}>
                                            <div className="proposal__content">
                                                <div className="proposal__content__description">
                                                    <div className="proposal__content__description__title">
                                                        <span className="mr-3">{proposal.id}</span>
                                                        <span className="mr-3">•</span>
                                                        {proposal.status === "CANCELLED" ?
                                                            <span className="mr-3 proposal__content__description__details__tag--failed">
                                                                Failed
                                                            </span>
                                                            :
                                                            <span className="mr-3 proposal__content__description__details__tag--passed">
                                                                {proposal.status === "ACTIVE" ? "Active" : (
                                                                    proposal.status === "QUEUED"
                                                                ) ? "In Queue" : "Created"}
                                                            </span>
                                                        }
                                                        {proposal.description.split(/\r?\n/)[0]}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="proposal__current-state-view">
                                                <div className={proposal.status === "CANCELLED" ?
                                                    "proposal__current-state-view__state proposal__current-state-view__state--failed" :
                                                    "proposal__current-state-view__state proposal__current-state-view__state--active"
                                                }>
                                                    <p className="proposal__current-state-view__state__text">
                                                        {proposal.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SuccessModal
                open={successModal.open}
                toggle={() => setSuccessModal({
                    ...successModal, open: false
                })}
                onConfirm={fetchAddressInfo}
            >
                {successModal.msg}
            </SuccessModal>

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

export default AddressInfo;
