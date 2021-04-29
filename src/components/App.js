import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
    Switch,
    Router,
    Route,
    Redirect,
} from "react-router-dom";
import history from './Utils/history';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Dashboard from './Dashboard';
import Proposals from './Proposals';
import Leaderboard from './Leaderboard';
import DisplayProposal from './DisplayProposal';
import AddressInfo from './AddressInfo';
import Vesting from './Vesting';
import CreateProposal from './CreateProposal';

export default function App() {
    const routes = (
        <Switch>
            <Route path="/" exact>
                <Dashboard />
            </Route>
            <Route path="/proposals" exact>
                <Proposals />
            </Route>
            <Route path="/leaderboard" exact>
                <Leaderboard />
            </Route>
            <Route path="/proposals/:proposalId" exact>
                <DisplayProposal />
            </Route>
            <Route path="/address/:address" exact>
                <AddressInfo />
            </Route>
            <Route path="/vesting" exact>
                <Vesting />
            </Route>
            <Route path="/create-proposal" exact>
                <CreateProposal />
            </Route>
            <Redirect to="/" />
        </Switch>
    );

    return (
        <div className="App">
            <Router history={history}>
                <Header />
                {routes}
                <Footer />
            </Router>
        </div>
    );
}
