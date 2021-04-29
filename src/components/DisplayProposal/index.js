import React, { useEffect, useState } from "react";
import ProposalBody from "./ProposalBody";
import ProposalHeader from "./ProposalHeader";
import { thegraph } from "../../utils/thegraph";
import { useParams } from "react-router-dom";
import AlertModal from "../Utils/AlertModal";

const DisplayProposal = () => {
    const { proposalId } = useParams();
    const [proposal, setProposal] = useState({});

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const fetchData = () => {
        thegraph.fetchProposal(proposalId)
            .then((data) => {
                setProposal(data);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="Proposal-Detail">
                <ProposalHeader proposal={proposal} />
                <ProposalBody proposal={proposal} callback={fetchData} />
            </div>

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

export default DisplayProposal;
