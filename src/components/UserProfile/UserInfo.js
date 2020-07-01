"use strict";
// React
import React from "react";
import PropTypes from "prop-types";
// Material UI Core
import {withStyles} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
//Material UI Lab
import Rating from "@material-ui/lab/Rating";

const styles = theme => ({
    mainContainer: {
        display: "flex",
        flexDirection: "row",
    },
    ratingsContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        marginLeft: theme.spacing(2),
    },
    ratingItemContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    ratingText: {
        marginLeft: theme.spacing(2),
    },
    avatar: {
        width: theme.spacing(18),
        height: theme.spacing(18),
    },
    username: {
        fontSize: "18px",
    },
});

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            userInfo: PropTypes.object.isRequired,
        };
    }

    render() {
        const {classes, userInfo} = this.props;
        return (
            <div className={classes.mainContainer}>
                <Avatar className={classes.avatar} src={userInfo.profilePicture ? userInfo.profilePicture.url : null} />
                <div className={classes.ratingsContainer}>
                    <Typography className={classes.username}>
                        <b>{userInfo.name}</b>
                    </Typography>
                    <div className={classes.ratingItemContainer}>
                        <Rating value={userInfo.commRate} precision={0.5} size="large" readOnly />
                        <Typography className={classes.ratingText}> Communication </Typography>
                    </div>
                    <div className={classes.ratingItemContainer}>
                        <Rating value={userInfo.descriptionRate} precision={0.5} size="large" readOnly />
                        <Typography className={classes.ratingText}> Item as described </Typography>
                    </div>
                    <div className={classes.ratingItemContainer}>
                        <Rating value={userInfo.conditionRate} precision={0.5} size="large" readOnly />
                        <Typography className={classes.ratingText}> Item condition </Typography>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(UserInfo);