"use strict";

import React from "react";

import UserSignup from "../components/UserSignup";

import UserAuthService from "../services/UserAuthService";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class UserSignupView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.notify = this.notify.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
    }

    // need to defince prop type for every function
    static get propTypes() {
        return {
            history: PropTypes.object,
        };
    }

    notify(message) {
        let customId;

        customId = "toast-error";
        toast.error(message, {
            position: "bottom-right",
            toastId: customId,
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    async signup(user) {
        this.setState({loading: true});

        const data = new FormData();
        for (let key in user) {
            data.append(key, user[key]);
        }
        console.log(data);

        try {
            await UserAuthService.register(data);
            // TODO: redirects

            this.notify("Account created succesfully", true);
            this.setState({loading: false});
            this.props.history.push("/");
        } catch (err) {
            // TODO: send notification message
            this.notify(err);
            console.error(err);
            this.setState({loading: false});
        }
    }

    renderLoading() {
        return (
            <div>
                <CircularProgress />
                <CircularProgress color="secondary" />
            </div>
        );
    }

    renderComponent() {
        return <UserSignup onSubmit={user => this.signup(user)}></UserSignup>;
    }

    render() {
        return <div>{this.state.loading ? this.renderLoading() : this.renderComponent()}</div>;
    }
}
