import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { thegraph } from "../../utils/thegraph";
import userLogo from "../../assets/images/user.png";
import "../../styles/leaderboard.css";
import AlertModal from "../Utils/AlertModal";

const Leaderboard = () => {
    const [addresses, setAddresses] = useState([]);
    const [
        totalVoteDelegated,
        setTotalVoteDelegated
    ] = useState("");

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const fetchData = () => {
        thegraph.fetchActiveDelegates()
            .then((data) => {
                setAddresses(data);
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });

        thegraph.fetchAggregatedData()
            .then((data) => {
                setTotalVoteDelegated(
                    data.delegatedVotes
                );
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
                                <div>Leaderboard</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="content">
                        <div style={{marginBottom: "20%"}} id="top-addresses-pane">
                            <div className="governance-panel">
                                <div className="governance-panel__header">
                                    <h4>Top VOTXv2 Voting Power</h4>
                                </div>
                                <div className="governance-panel__labels">
                                    <div className="col-xs-10 col-sm-6">
                                        <label>Address</label>
                                    </div>
                                    <div className="col-xs-2 text-right mobile-hide">
                                        <label>Votes</label>
                                    </div>
                                    <div className="col-xs-2 text-right">
                                        <label>Vote Weight</label>
                                    </div>
                                    <div className="col-xs-2 text-right mobile-hide">
                                        <label>Proposals Voted</label>
                                    </div>
                                </div>

                                <div className="top-addresses">
                                    {addresses.map((element, key) => (
                                        <Link
                                            key={key}
                                            className="delegatee-summary"
                                            to={`/address/${element.id}`}
                                        >
                                            <div className="col-xs-10 col-sm-6">
                                                <div className="delegatee-summary__details">
                                                    <div className="delegatee-summary__details__rank-view">
                                                        <label className="delegatee-summary__details__rank">
                                                            {key + 1}
                                                        </label>
                                                    </div>

                                                    <div className="gov-profile-image gov-profile-image--small">
                                                        <img
                                                            id="img-0x9aa835bc7b8ce13b9b0c9764a52fbf71ac62ccf1"
                                                            alt="User Wallet"
                                                            className="gov-profile-image__raw-image"
                                                            src={userLogo}
                                                        />
                                                        <div
                                                            className="gov-profile-image__proposer-icon 
                                                                gov-profile-image__proposer-icon--small 
                                                                gov-profile-image__proposer-icon--light"
                                                        />
                                                    </div>

                                                    <span className="delegatee-summary__details__display-name mobile-hide">
                                                        {element.id}
                                                    </span>
                                                    <span
                                                        className="delegatee-summary__details__display-name 
                                                            delegatee-summary__details__display-name--mobile"
                                                    >
                                                        {element.id.substr(0, 24)}...
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="col-xs-2 text-right mobile-hide">
                                                {Number(element.delegatedVotes).toFixed(2)}
                                            </div>

                                            <div className="col-xs-2 text-right" style={{ color: "#ffc107" }}>
                                                {((Number(element.delegatedVotes) /
                                                    Number(totalVoteDelegated)) * 100).toFixed(0)} %
                                            </div>

                                            <div className="col-xs-2 text-right mobile-hide">
                                                {element.votes.length}
                                            </div>
                                        </Link>
                                    ))}
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
        </>
    );
};

export default Leaderboard;
