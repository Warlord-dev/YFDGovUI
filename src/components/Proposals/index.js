import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { thegraph } from "../../utils/thegraph";
import ProposalsHeader from "./Overview";
import AlertModal from "../Utils/AlertModal";
import "../../styles/proposals.css";

const Proposals = () => {
    const [proposals, setProposals] = useState([]);

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const fetchData = () => {
        thegraph.fetchProposals()
            .then((data) => {
                setProposals(data);
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <ProposalsHeader />

            <section>
                <div className="container">
                    <div className="content">
                        <div style={{ marginBottom: "20%" }} className="governance-panel">
                            <div className="governance-panel__header">
                                <h4>All Proposals</h4>
                            </div>

                            <div className="proposals">
                                {proposals.map((proposal, key) => (
                                    proposal.status !== "CANCELLED" ?
                                        <Link key={key} className="proposal" to={`/proposals/${proposal.id}`}>
                                            <div className="proposal__content">
                                                <div className="proposal__content__description">
                                                    <div className="proposal__content__description__title">
                                                        {proposal.description.split(/\r?\n/)[0]}
                                                    </div>
                                                    <div className="proposal__content__description__details">
                                                        <div className="proposal__content__description__details__tag proposal__content__description__details__tag--passed">
                                                            {proposal.status === "ACTIVE" ? "Active" : (
                                                                proposal.status === "QUEUED"
                                                            ) ? "In Queue" : "Created"}
                                                        </div>
                                                        <div className="proposal__content__description__details__text proposal__content__description__details__text">
                                                            <span>{proposal.id}</span>
                                                            <span>•</span>
                                                            <span>{proposal.status} {proposal.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="proposal__current-state-view">
                                                <div className="proposal__current-state-view__state proposal__current-state-view__state--active">
                                                    <p className="proposal__current-state-view__state__text">
                                                        {proposal.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        :
                                        <Link key={key} className="proposal" to={`/proposals/${proposal.id}`}>
                                            <div className="proposal__content">
                                                <div className="proposal__content__description">
                                                    <div className="proposal__content__description__title">
                                                        {proposal.description.split(/\r?\n/)[0]}
                                                    </div>
                                                    <div className="proposal__content__description__details">
                                                        <div className="proposal__content__description__details__tag proposal__content__description__details__tag--not-passed">
                                                            Failed
                                                        </div>
                                                        <div className="proposal__content__description__details__text proposal__content__description__details__text">
                                                            <span>{proposal.id}</span>
                                                            <span>•</span>
                                                            <span>{proposal.status} {proposal.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="proposal__current-state-view">
                                                <div className="proposal__current-state-view__state proposal__current-state-view__state--failed">
                                                    <p className="proposal__current-state-view__state__text">
                                                        {proposal.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                ))}

                                {proposals.length === 0 ?
                                    <div className="proposals">
                                        <div className="proposal">
                                            <div className="proposal__content">
                                                <div className="proposal__content__description">
                                                    <div className="proposal__content__description__title">
                                                        —
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="proposal__current-state-view__state proposal__current-state-view__state">
                                                <p className="proposal__current-state-view__state__text">
                                                    —
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
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
        </>
    );
};

export default Proposals;
