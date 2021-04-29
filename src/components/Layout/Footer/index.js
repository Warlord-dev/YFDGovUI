import React from "react";
import "../../../styles/footer.css"

const Footer = () => {
    return (
        <footer id="footer" className="landing">
            <div className="container-large">
                <div className="row" style={{ marginTop: "4%" }}>
                    <div className="col-md-3">
                        <div className="footer-widget">
                            <h4 className="header">About VOTX</h4>
                            <p className="info">
                                VOTX partners with DeFi projects using Open Oracle with
                                zero-knowledge proofs to provide confidential data to smart contracts.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="footer-widget">
                            <h4 className="header">Quick Links</h4>
                            <ul className="stack-link">
                                <li><a href="https://yfd.io">Home</a></li>
                                {/* <li>
                                    <a
                                        href="https://finance.yahoo.com/news/zoracles-develops-next-generation-oracle-093003499.html?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAABB1kCfe07jcqCQcmla2GXEHe_i1jXF1Siyf702Sd7MCKdHUjd3LTk5XdP8_PiI_raEAUOc03x9vgwYu7PJJ-L6Kc-g0FqDpBzfNoPUWSCLclAuow6M39K46V--gL3gGoJr5YIEoxRvYdUvMqoYqsPBcaovCYrVSGI5KSWMDbe8i">
                                        Press
                                    </a>
                                </li> */}
                                {/* <li>
                                    <a href="#features">
                                        Features
                                    </a>
                                </li> */}
                                <li>
                                    <a href="https://github.com/YfDFI-Finance">
                                        Github
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-3" id="contact">
                        <div className="footer-widget">
                            <h4 className="header">More Links</h4>
                            <ul className="stack-link">
                                <li>
                                    <a href="https://discord.gg/jUTNmpp">
                                        Discord
                                    </a>
                                </li>
                                <li>
                                    <a href="https://t.me/yourfinancedecentralized">
                                        Telegram
                                    </a>
                                </li>
                                <li>
                                    <a href="https://twitter.com/YFDecentralized">
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a href="https://medium.com/yourfinancedecentralized">
                                        Medium
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.reddit.com/r/YfDFI">
                                        Reddit
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="footer-widget">
                            <h4 className="header">Subscribe</h4>
                            <form action="#">
                                <div className="form-field">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your email"
                                    />
                                    <button className="btn btn-subscribe">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="row copyright">
                    <div className="col-md-6">
                        <div className="footer-widget">
                            <p className="copyright info">
                                © 2020 <a href="https://yfd.io/">
                                    YfDFI Finance
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
