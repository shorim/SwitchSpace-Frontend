"use strict";
// React
import React from "react";
import PropTypes from "prop-types";
// Material UI CORE
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
// Material UI Lab
import Rating from "@material-ui/lab/Rating";
// Images
import defaultAvatar from "../../../public/assets/general/avatar.png";

const styles = theme => ({
    avatar: {
        width: theme.spacing(18),
        height: theme.spacing(18),
    },
    itemPadding: {
        padding: theme.spacing(2, 3),
    },
    itemMargin: {
        margin: theme.spacing(2, 0),
    },
    reviewerName: {
        fontWeight: "bold",
        fontSize: "1.5em",
    },
    description: {
        width: "750px",
    },
    extendedContainer: {
        flexGrow: 1,
        maxWidth: "100%",
    },
});

class ReviewListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            review: PropTypes.object.isRequired,
        };
    }

    render() {
        const {classes, review} = this.props;
        // handle the case when the reviewer has been deleted from the platform
        if (!review.reviewerId) {
            review.reviewerId = {
                profilePicture: null,
                name: "Deleted User",
            };
        }
        return (
            <Card elevation={5} className={classes.itemMargin}>
                <Grid container className={classes.itemPadding}>
                    <Grid item xs={2}>
                        <Avatar
                            variant="rounded"
                            className={classes.avatar}
                            src={review.reviewerId.profilePicture ? review.reviewerId.profilePicture.url : defaultAvatar}
                        />
                    </Grid>
                    <Grid item container xs={9} spacing={2} direction="column" justify="space-between" className={classes.extendedContainer}>
                        <Grid item container justify="space-between">
                            <Grid item>
                                <Typography className={classes.reviewerName} color="inherit">
                                    {review.reviewerId.name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography color="inherit"> Reviewed on {review.updatedAt.substring(0, 10)}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between">
                            <Grid item>
                                <Typography align="center" color="inherit">
                                    Communication
                                </Typography>
                                <Rating value={review.commRate} precision={0.5} size="medium" readOnly />
                            </Grid>
                            <Grid item>
                                <Typography align="center" color="inherit">
                                    Item as described
                                </Typography>
                                <Rating value={review.descriptionRate} precision={0.5} size="medium" readOnly />
                            </Grid>
                            <Grid item>
                                <Typography align="center" color="inherit">
                                    Item condition
                                </Typography>
                                <Rating value={review.conditionRate} precision={0.5} size="medium" readOnly />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography color="inherit"> {review.description} </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        );
    }
}

export default withStyles(styles)(ReviewListItem);
