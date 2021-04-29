import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { precision } from "../../../utils/precision";
import AlertModal from "../../Utils/AlertModal";
import SuccessModal from "../../Utils/SuccessModal";
import "../../../styles/proposalBody.css";

const ProposalBody = ({ proposal, callback }) => {
    const [userVote, setUserVote] = useState("");
    const [userVotePower, setUserVotePower] = useState("");
    const [castingVote, setCastingVote] = useState(false);

    const [supportVotes, setSupportVotes] = useState({
        total: "",
        votes: [{
            voter: "",
            quantity: "",
        }]
    });

    const [againstVotes, setAgainstVotes] = useState({
        total: "",
        votes: [{
            voter: "",
            quantity: "",
        }]
    });

    const [successModal, setSuccessModal] = useState({
        msg: "",
        open: false,
    });

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false,
    });

    const getLocalDate = (unixTimestamp) => {
        const data = new Date(1000 * unixTimestamp);
        const date = data.toDateString();
        return date;
    };

    const getLocalTime = (unixTimestamp) => {
        const data = new Date(1000 * unixTimestamp);
        const time = data.toLocaleTimeString();
        return time;
    };

    const handleCastVote = () => {
        window.govContract.methods
            .castVote(
                proposal.id,
                userVote
            )
            .send({ from: window.userAddress })
            .on("transactionHash", () => {
                setCastingVote(true);
            })
            .on("receipt", () => {
                setCastingVote(false);
                setSuccessModal({
                    open: true,
                    msg: "Congratulations 🎉 !! " +
                        "You have successfully casted your vote !!",
                });
            })
            .catch((error) => {
                setCastingVote(false);
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    }

    const getUserCurrentVotes = async () => {
        const currentVotes = await window.votxContract
            .methods
            .getCurrentVotes(window.userAddress)
            .call();

        setUserVotePower(currentVotes);
    }

    useEffect(() => {
        let supportCount = 0, againstCount = 0;
        let supportVotes = [], againstVotes = [];

        if (proposal.votes) {
            proposal.votes.forEach((element, key) => {
                if (element.support) {
                    supportCount += Number(element.votes);
                    supportVotes.push({
                        voter: element.voter.id,
                        quantity: element.votes
                    });
                } else {
                    againstCount += Number(element.votes);
                    againstVotes.push({
                        voter: element.voter.id,
                        quantity: element.votes
                    });
                }

                if (key === proposal.votes.length - 1) {
                    setSupportVotes({
                        total: supportCount,
                        votes: supportVotes,
                    });
                    setAgainstVotes({
                        total: againstCount,
                        votes: againstVotes,
                    });
                }
            });
        }

        if (window.userAddress) {
            getUserCurrentVotes();
        }

    }, [proposal.votes]);

    return (
        <section className="proposal-detail">
            <div className="container">
                <div className="content">
                    <div className="row">
                        <div className="col-xs-12 col-sm-8 details-panel">
                            <div className="governance-panel">
                                <div className="governance-panel__header">
                                    <h4>Details</h4>
                                </div>

                                <div className="details-panel__description" style={{ color: "white" }}>
                                    {proposal.description ? proposal.description.split(/\r?\n/)
                                        .map((element, key) => (
                                            key !== 0 ?
                                                <div key={key} className="details-panel__description__paragraph">
                                                    {element}
                                                </div>
                                                : null
                                        )) : null}
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-4 history-panel--loading">
                            <div className="governance-panel">
                                <div className="governance-panel__header">
                                    <h4>Proposal History</h4>
                                </div>

                                <div className="history-panel__time-line">
                                    {proposal.startTime ?
                                        <div>
                                            <div className="history-panel__time-line__point history-panel__time-line__point--inactive-succeeded">
                                                <div className="history-panel__time-line__point__content">
                                                    <div>
                                                        <div className="history-panel__time-line__point__title">
                                                            Created
                                                        </div>
                                                        <div className="history-panel__time-line__point__timestamp">
                                                            {getLocalDate(proposal.startTime)} – {getLocalTime(proposal.startTime)}
                                                        </div>
                                                    </div>
                                                    <a
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href="https://etherscan.io/tx/0x0d7aa757997b9da3381ed6b8125c2358d30857f2cfc41d92381433475fa3bd5d"
                                                        className="external-link"
                                                    >
                                                        <div className="line-icon line-icon--external-link line-icon--external-link--green" />
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="history-panel__time-line__point history-panel__time-line__point--inactive-succeeded">
                                                <div className="history-panel__time-line__point__content">
                                                    <div>
                                                        <div className="history-panel__time-line__point__title">
                                                            Active
                                                        </div>
                                                        <div className="history-panel__time-line__point__timestamp">
                                                            {getLocalDate(proposal.startTime + 15)} – {getLocalTime(proposal.startTime + 15)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}


                                    {proposal.status === "QUEUED" || proposal.status === "EXECUTED" ?
                                        <div>
                                            <div className="history-panel__time-line__point history-panel__time-line__point--active">
                                                <div className="history-panel__time-line__point__content">
                                                    <div>
                                                        <div className="history-panel__time-line__point__title">
                                                            Succeeded
                                                        </div>
                                                        <div className="history-panel__time-line__point__timestamp">
                                                            {getLocalDate(proposal.endTime)} – {getLocalTime(proposal.endTime)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="history-panel__time-line__point history-panel__time-line__point--active">
                                                <div className="history-panel__time-line__point__content">
                                                    <div>
                                                        <div className="history-panel__time-line__point__title">
                                                            Queued
                                                        </div>
                                                        <div className="history-panel__time-line__point__timestamp">
                                                            {getLocalDate(proposal.endTime)} – {getLocalTime(proposal.endTime)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                    }

                                    {proposal.status === "EXECUTED" ?
                                        <div className="history-panel__time-line__point history-panel__time-line__point--active">
                                            <div className="history-panel__time-line__point__content">
                                                <div>
                                                    <div className="history-panel__time-line__point__title">
                                                        Executed
                                                        </div>
                                                    <div className="history-panel__time-line__point__timestamp">
                                                        {getLocalDate(Number(proposal.endTime) + 172800)}
                                                        <span> – </span>
                                                        {getLocalTime(Number(proposal.endTime) + 172800)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        (proposal.status === "CANCELLED" ?
                                            <div className="history-panel__time-line__point history-panel__time-line__point--failed">
                                                <div className="history-panel__time-line__point__content">
                                                    <div>
                                                        <div className="history-panel__time-line__point__title">
                                                            Canceled
                                                    </div>
                                                        <div className="history-panel__time-line__point__timestamp">
                                                            {getLocalDate(proposal.endTime)} – {getLocalTime(proposal.endTime)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {window.userAddress && proposal.status === "ACTIVE" ?
                        <div className="row">
                            <div className="col-xs-12 details-panel">
                                <div className="d-flex justify-content-center">
                                    <div className="governance-panel">
                                        <div className="governance-panel__header votes-panel__header">
                                            <div className="votes-panel__header__title-bar">
                                                <h4 style={{ color: "#ffc107" }}>Cast Your Vote</h4>
                                                <h4 style={{ fontSize: "18px" }}>
                                                    Vote Power: {precision.remove(userVotePower).toFixed(4)}
                                                </h4>
                                            </div>
                                            <div className="votes-panel__header__vote-bar">
                                                <div
                                                    className="votes-panel__header__vote-bar__fill"
                                                    style={{ width: "100%" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-3">
                                                <button
                                                    className="vote-button mb-3"
                                                    onClick={() => setUserVote(true)}
                                                >
                                                    Yes, I support this proposal
                                                </button>
                                                <button
                                                    className="vote-button mb-3"
                                                    onClick={() => setUserVote(false)}
                                                >
                                                    No, I don't support this proposal
                                                </button>
                                            </div>

                                            <button
                                                className="submit-button"
                                                disabled={userVotePower <= 0 ? "disabled" : null}
                                                onClick={handleCastVote}
                                            >
                                                {castingVote ?
                                                    <div className="d-flex align-items-center">
                                                        Processing
                                                        <span className="loading ml-2"></span>
                                                    </div>
                                                    :
                                                    <div>Vote</div>
                                                }
                                            </button>

                                            {userVotePower && userVotePower <= 0 ?
                                                <div className="warning-info">
                                                    You can't cast vote because either You don't have VOTX
                                                    or you have not delegated your votes
                                                </div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                    }

                    <div className="row">
                        <div className="col-xs-12 col-sm-6 votes-panel">
                            <div className="governance-panel">
                                <div className="governance-panel__header votes-panel__header">
                                    <div className="votes-panel__header__title-bar">
                                        <h4>For</h4>
                                        <h4>{Number(supportVotes.total).toFixed(0)}</h4>
                                    </div>
                                    <div className="votes-panel__header__vote-bar">
                                        <div
                                            className="votes-panel__header__vote-bar__fill votes-panel__header__vote-bar__fill--for"
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                </div>
                                <div className="governance-panel__labels">
                                    <div className="col-xs-6 text-left">
                                        <label>{supportVotes.votes.length} Addresses</label>
                                    </div>
                                    <div className="col-xs-6 text-right">
                                        <label>Votes</label>
                                    </div>
                                </div>
                                {supportVotes.votes.splice(0, 3).map((element, key) => (
                                    <Link
                                        key={key}
                                        className="votes-panel__vote-row"
                                        to="/governance/address/0x6626593c237f530d15ae9980a95ef938ac15c35c"
                                    >
                                        <div className="votes-panel__vote-row__account">
                                            {element.voter.substr(0, 5)}...
                                            {element.voter.substr(38, 42)}
                                        </div>
                                        <div className="votes-panel__vote-row__votes">
                                            {Number(element.quantity).toFixed(4)}
                                        </div>
                                    </Link>
                                ))}

                                {supportVotes.votes.length < 3 ?
                                    <div className="votes-panel__vote-row votes-panel__vote-row--empty">
                                        <div className="votes-panel__vote-row__account votes-panel__vote-row__account--empty">
                                            —
                                        </div>
                                        <div className="votes-panel__vote-row__votes votes-panel__vote-row__votes--empty">
                                            —
                                        </div>
                                    </div>
                                    :
                                    <Link to="/" className="governance-panel__footer">View All</Link>
                                }
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-6 votes-panel">
                            <div className="governance-panel">
                                <div className="governance-panel__header votes-panel__header">
                                    <div className="votes-panel__header__title-bar">
                                        <h4>Against</h4>
                                        <h4>{Number(againstVotes.total).toFixed(0)}</h4>
                                    </div>
                                    <div className="votes-panel__header__vote-bar">
                                        <div
                                            className="votes-panel__header__vote-bar__fill votes-panel__header__vote-bar__fill--against"
                                            style={{ width: "0%" }}
                                        />
                                    </div>
                                </div>
                                <div className="governance-panel__labels">
                                    <div className="col-xs-6 text-left">
                                        <label>{againstVotes.votes.length} Addresses</label>
                                    </div>
                                    <div className="col-xs-6 text-right">
                                        <label>Votes</label>
                                    </div>
                                </div>

                                {againstVotes.votes.splice(0, 3).map((element, key) => (
                                    <Link
                                        key={key}
                                        className="votes-panel__vote-row"
                                        to="/governance/address/0x6626593c237f530d15ae9980a95ef938ac15c35c"
                                    >
                                        <div className="votes-panel__vote-row__account">
                                            {element.voter.substr(0, 5)}...
                                            {element.voter.substr(38, 42)}
                                        </div>
                                        <div className="votes-panel__vote-row__votes">
                                            {Number(element.quantity).toFixed(4)}
                                        </div>
                                    </Link>
                                ))}

                                {againstVotes.votes.length < 3 ?
                                    <div className="votes-panel__vote-row votes-panel__vote-row--empty">
                                        <div className="votes-panel__vote-row__account votes-panel__vote-row__account--empty">
                                            —
                                        </div>
                                        <div className="votes-panel__vote-row__votes votes-panel__vote-row__votes--empty">
                                            —
                                        </div>
                                    </div>
                                    :
                                    <Link to="/" className="governance-panel__footer">View All</Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessModal
                open={successModal.open}
                toggle={() => setSuccessModal({
                    ...successModal, open: false
                })}
                onConfirm={callback}
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
        </section >
    );
};

export default ProposalBody;
