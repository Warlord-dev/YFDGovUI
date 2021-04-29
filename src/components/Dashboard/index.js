import React from "react";
import Overview from "./Overview";
import RecentProposals from "./RecentProposals";
import TopAddresses from "./TopAddresses";

const Dashboard = () => {
    return (
        <>
            <div id="Dashboard">
                <section className="hero">
                    <Overview />
                </section>

                <section>
                    <div className="container">
                        <div className="content">
                            <RecentProposals />
                            <TopAddresses />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Dashboard;
