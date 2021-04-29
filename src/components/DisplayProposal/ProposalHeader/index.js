import React from "react";
import { Link } from "react-router-dom";
import userLogo from "../../../assets/images/user.png";

const ProposalHeader = ({ proposal }) => {
    const getLocalDate = (unixTimestamp) => {
        const data = new Date(1000 * unixTimestamp);
        const date = data.toDateString();
        return date;
    };

    return (
        <section className="hero">
            <div className="container">
                <div className="page-header">
                    <div className="page-header__main-section">
                        <Link className="page-header__main-section__back" to="/proposals">
                            <p className="small page-header__main-section__back__text">
                                Proposals
                            </p>
                        </Link>

                        <div className="page-header__main-section__title">
                            <div className="proposal__content proposal__content--header">
                                <div className="proposal__content__description">
                                    <div className={proposal.id ?
                                        "proposal__content__description__title proposal__content__description__title--header" :
                                        "proposal__content__description__title proposal__content__description__title--header--loading"
                                    }>
                                        {proposal.id ?
                                            <div>{String(proposal.description).split(/\r?\n/)[0]}</div> :
                                            null}
                                    </div>

                                    {proposal.id ?
                                        <div className="proposal__content__description__details proposal__content__description__details--large">
                                            <div className="proposal__content__description__details__tag proposal__content__description__details__tag--passed">
                                                {proposal.status === "EXECUTED" ? "Passed" : (
                                                    proposal.status === "CANCELLED" ? "Failed" : "Active"
                                                )}
                                            </div>
                                            <div className="proposal__content__description__details__text proposal__content__description__details__text">
                                                <span>{proposal.id}</span>
                                                <span>•</span>
                                                {proposal.status === "EXECUTED" ?
                                                    <span>{getLocalDate(proposal.endTime + 172800)}</span>
                                                    : (proposal.status === "ACTIVE" || proposal.status === "PENDING" ?
                                                        <span>{getLocalDate(proposal.startTime)}</span>
                                                        : (proposal.status === "QUEUED" ?
                                                            <span>{getLocalDate(proposal.endTime)}</span>
                                                            : (proposal.status === "CANCELLED" ?
                                                                <span>{getLocalDate(proposal.endTime)}</span>
                                                                : null
                                                            )
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-header__detail-section">
                        <Link
                            className="proposer-pane"
                            to={`/address/${proposal.proposer ? proposal.proposer.id : null}`}
                        >
                            <div className="gov-profile-image">
                                <img
                                    id="img-0x54a37d93e57c5da659f508069cf65a381b61e189"
                                    alt="User Wallet"
                                    className="gov-profile-image__raw-image"
                                    src={userLogo}
                                />
                                <div className="gov-profile-image__proposer-icon" />
                            </div>

                            <div className="proposer-pane__details">
                                <div className="proposer-pane__details__address">
                                    {proposal.proposer ?
                                        <div>
                                            {proposal.proposer.id.substr(0, 5)}...
                                            {proposal.proposer.id.substr(38, 42)}
                                        </div>
                                        : null
                                    }
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default ProposalHeader;
