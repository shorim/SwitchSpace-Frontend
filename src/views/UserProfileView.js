"use strict";

import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import {withStyles} from "@material-ui/core/styles";
import UserProfile from "../components/UserProfile";
import PostService from "../services/PostService";

const styles = {
    centered: {
        position: "fixed",
        top: "50%",
        left: "50%",
        marginLeft: "-50px",
        marginTop: "-50px",
    },
};

class UserProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageLoading: true,
            selectedTab: "reviews",
            userId: this.props.match.params.id,
            userInfo: {},
        };

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            match: PropTypes.object.isRequired,
        };
    }

    async componentDidMount() {
        // TODO: get userInfo from a service
        const userInfo = {
            name: "Frodo Baggins",
            profilePicture: {
                url: "https://tipsmake.com/data/thumbs/how-to-hide-facebook-profile-picture-thumb-EhRnrBzAY.jpg",
                key: "awsKey",
            },
            commRate: 3.5,
            conditionRate: 3.7,
            descriptionRate: 3.2,
        };

        let response = await this.getUserPosts();
        this.setState({
            pageLoading: false,
            userInfo: userInfo,
            posts: response.data.data,
        });
    }

    async getUserPosts() {
        try {
            let posts = await PostService.getUserPosts(this.state.userId);
            return posts;
        } catch (err) {
            // TODO: add feedback for the error
            console.log(err);
        }
    }

    handleTabChange(event, newValue) {
        this.setState({
            selectedTab: newValue,
        });
    }

    render() {
        const {classes} = this.props;

        // TODO: use a common loader for all components
        if (this.state.pageLoading) {
            return (
                <div>
                    <CircularProgress size={100} className={classes.centered} />
                </div>
            );
        }

        return (
            <UserProfile
                userInfo={this.state.userInfo}
                selectedTab={this.state.selectedTab}
                onTabChange={this.handleTabChange}
                posts={this.state.posts}
            />
        );
    }
}

export default withStyles(styles)(UserProfileView);
