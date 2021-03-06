"use strict";
// React
import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
// Material UI Core
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
// Material UI Icons
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// Components
import Page from "../Page";
//MISC
import EmailValidator from "email-validator";

const styles = theme => ({
    paper: {
        // marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(2),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.button.backgroundColor(),
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    button: {
        backgroundColor: theme.palette.button.backgroundColor(),
        color: theme.palette.button.textColor(),
        "&:hover": {
            backgroundColor: theme.palette.button.hover.backgroundColor(),
        },
        margin: theme.spacing(3, 0, 2),
    },
    centerFold: {
        textAlign: "center",
        color: theme.palette.button.textColor(),
    },
    headerText: {
        color: theme.palette.header.textColor(),
    },
});

class UserLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            emailError: false,
            passwordError: false,
            password: "",
        };

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    onEmailChange(e) {
        const value = e.currentTarget.value;
        const error = EmailValidator.validate(value) ? false : true;
        this.setState({email: value, emailError: error});
    }

    onPasswordChange(e) {
        const value = e.currentTarget.value;
        const error = !value ? true : false;
        this.setState({password: value, passwordError: error});
    }

    submitHandler(ev) {
        ev.preventDefault();
        let user = {email: this.state.email, password: this.state.password};
        if (!this.state.emailError && this.state.password != "" && this.state.email != "") {
            this.props.onSubmit(user);
        } else {
            let emailError = this.state.emailError;
            let passwordError = this.state.passwordError;
            if (this.state.email === "") emailError = true;
            if (this.state.password === "") passwordError = true;
            this.setState({emailError: emailError, passwordError: passwordError});
        }
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            isAdmin: PropTypes.bool,
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <Page>
                <Container component="main" maxWidth="sm">
                    <Card className={classes.paper} elevation={5}>
                        <Avatar className={classes.avatar} variant="rounded">
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" className={classes.headerText}>
                            Sign in
                        </Typography>
                        <form className={classes.form} noValidate onSubmit={this.submitHandler}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={this.onEmailChange}
                                autoFocus
                                error={this.state.emailError}
                                helperText={this.state.emailError ? "Incorrect Email Address" : ""}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={this.onPasswordChange}
                                error={this.state.passwordError}
                                helperText={this.state.passwordError ? "Password is Required" : ""}
                            />

                            <Button fullWidth variant="contained" type="submit" className={classes.button} onClick={this.submitHandler}>
                                Sign In
                            </Button>
                            {!this.props.isAdmin ? (
                                <div className={classes.centerFold}>
                                    <Link to={"/signup"}>
                                        <Typography variant="body1" color="primary">
                                            {"Not a member? Register"}
                                        </Typography>
                                    </Link>
                                </div>
                            ) : (
                                ""
                            )}
                        </form>
                    </Card>
                </Container>
            </Page>
        );
    }
}

export default withStyles(styles)(UserLogin);
