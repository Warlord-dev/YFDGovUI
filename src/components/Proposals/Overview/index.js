import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { thegraph } from "../../../utils/thegraph";
import AlertModal from "../../Utils/AlertModal";
import "../../../styles/proposalsOverview.css";

const ProposalsOverview = () => {
    const [data, setData] = useState({});

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const fetchData = () => {
        thegraph.fetchAggregatedData()
            .then((data) => {
                setData(data);
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
        <section className="hero">
            <div className="container">
                <div className="page-header">
                    <div className="page-header__main-section">
                        <Link className="page-header__main-section__back" to="/">
                            <p className="small page-header__main-section__back__text">
                                Dashboard
                            </p>
                        </Link>

                        <div className="page-header__main-section__title">
                            <div className="proposal-overview">
                                <div className="proposal-overview__header">
                                    Proposals
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-header__detail-section">
                        <div className="proposals-pie-view">
                            <div className="proposal-pie-wrapper">
                                <div className="proposals-pie-chart">
                                    <svg viewBox="0 0 140 140" width="100%">
                                        <path
                                            d="M 70 70 L  70 0 A 70 70 0 0 1 70 0 Z"
                                            stroke="transparent"
                                            fill="#9669ED"
                                        />
                                        <path
                                            d="M 70 70 L  70 0 A 70 70 0 1 1 16.648656141065423 24.68296006527209 Z"
                                            stroke="transparent"
                                            fill="#00D395"
                                        />
                                        <path
                                            d="M 70 70 L  16.648656141065423 24.68296006527209 A 70 70 0 0 1 69.99999999999993 0 Z"
                                            stroke="transparent"
                                            fill="#657786"
                                        />
                                    </svg>
                                </div>
                                <div className="proposal-pie-description">
                                    <div className="headline">
                                        {data.proposals ? data.proposals :
                                            <span> — </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="proposal-pie-labels">
                                <label className="active">Active</label>
                                <label className="passed">Passed</label>
                                <label className="failed">Failed</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertModal
                open={errorModal.open}
                toggle={() => setErrorModal({
                    ...errorModal, open: false
                })}
            >
                {errorModal.msg}
            </AlertModal>
        </section>
    );
};

export default ProposalsOverview;
