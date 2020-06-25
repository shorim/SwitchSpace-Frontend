"use strict";

import React from "react";
import {
    HashRouter as Router,
    Route,
    Switch,
    // Redirect,
} from "react-router-dom";

import UserLoginView from "./views/UserLoginView";
import UserSignupView from "./views/UserSignupView";
import TrendingView from "./views/TrendingView";
import PostView from "./views/PostView";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "Switch Space",
            routes: [
                {component: UserLoginView, path: "/login"},
                {component: UserSignupView, path: "/register"},
                {component: TrendingView, path: "/trending"},
                {component: PostView, path: "/post"},
            ],
        };
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        {this.state.routes.map((route, i) => (
                            <Route key={i} {...route} />
                        ))}
                    </Switch>
                </Router>
            </div>
        );
    }
}
