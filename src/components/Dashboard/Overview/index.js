import React, { useEffect, useState } from "react";
import { config } from "../../../utils/config";
import { thegraph } from "../../../utils/thegraph";
import AlertModal from "../../Utils/AlertModal";

const Overview = () => {
    const [governanceData, setGovernanceData] = useState({});

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const fetchData = () => {
        thegraph.fetchAggregatedData()
            .then((data) => {
                setGovernanceData(data);
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
        <div className="container">
            <h2>DFI Governance</h2>

            <div id="dashboard-overview" className="row">
                <div className="col-sm-6 col-xs-12">
                    <div className="panel dark">
                        <a
                            id="votx-distribution-panel"
                            className="content"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${config.etherscanLink}/token/${config.votxAddress}#balances`}
                        >
                            <div>
                                <div className="headline">100,000 VOTXv2</div>
                                <label>VOTXv2 Total Supply</label>
                            </div>

                            <div className="votx-remaining-view">
                                <div className="view-action">
                                    <span className="action-text">View</span>
                                    <span id="arrow" className="arrow" />
                                </div>
                                <div className="votx-remaining__bar">
                                    <div
                                        className="votx-remaining__bar__fill"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="col-sm-3 col-xs-6">
                    <div className="panel dark">
                        <div className="content">
                            <div className={governanceData.delegatedVotes ?
                                "headline" :
                                "headline headline--loading"
                            }>
                                {governanceData.delegatedVotes ?
                                    Number(governanceData.delegatedVotes).toFixed(0) :
                                    null}
                            </div>
                            <label className={governanceData.delegatedVotes ?
                                "panel__label" :
                                "panel__label panel__label--loading"
                            }>
                                {governanceData.delegatedVotes ?
                                    <div>Votes Delegated</div> :
                                    null}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="col-sm-3 col-xs-6">
                    <div className="panel dark">
                        <div className="content">
                            <div className={governanceData.delegatedVotes ?
                                "headline" :
                                "headline headline--loading"
                            }>
                                {governanceData.currentDelegates}
                            </div>
                            <label className={governanceData.delegatedVotes ?
                                "panel__label" :
                                "panel__label panel__label--loading"
                            }>
                                {governanceData.delegatedVotes ?
                                    <div>Total Voters</div> :
                                    null}
                            </label>
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
        </div>
    );
};

export default Overview;
