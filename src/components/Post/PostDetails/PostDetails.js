"use strict";
// React
import React from "react";
import PropTypes from "prop-types";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
// Material UI Core
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// Material UI Icons
import ImageIcon from "@material-ui/icons/Image";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SwapHorizOutlinedIcon from "@material-ui/icons/SwapHorizOutlined";
// Components
import Item from "./Item";
import PostImage from "./PostImage";

const styles = theme => ({
    cardHeader: {
        backgroundColor: theme.palette.header.backgroundColor(),
        color: theme.palette.header.textColor(),
    },
    gridContainer: {
        width: "100%",
        margin: "auto",
        direction: "row",
        justify: "center",
        alignItems: "stretch",
    },
    arrow: {
        textAlign: "center",
        fontSize: "100px",
        margin: "auto",
    },
    slidingImage: {
        maxWidth: "100%",
        maxHeight: "100%",
    },
    itemTitle: {
        fontWeight: "bold",
        fontSize: "1.75em",
    },
    boldText: {
        fontWeight: "bold",
        marginRight: theme.spacing(1),
    },
    fullHeightCard: {
        height: "100%",
    },
    input: {
        display: "none",
    },
    formButton: {
        backgroundColor: theme.palette.button.backgroundColor(),
        color: theme.palette.button.textColor(),
        "&:hover": {
            backgroundColor: theme.palette.button.hover.backgroundColor(),
        },
        marginTop: theme.spacing(1),
    },
});

class PostDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            openedImageUrl: "",
        };

        this.onImageUpload = this.onImageUpload.bind(this);
        this.handleImageSelection = this.handleImageSelection.bind(this);
        this.handleImageClose = this.handleImageClose.bind(this);
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            post: PropTypes.object.isRequired,
            isOwnPost: PropTypes.bool,
            editPhotos: PropTypes.func,
            categories: PropTypes.array,
            editItemOwned: PropTypes.func,
            editItemDesired: PropTypes.func,
        };
    }

    onImageUpload(e) {
        let photos = [];
        for (let i = 0; i < e.target.files.length; i++) {
            photos.push(e.target.files[i]);
        }
        this.setState({photos: photos});
        if (photos.length > 0) {
            this.props.editPhotos(photos);
        }
    }

    handleImageSelection(photoUrl) {
        this.setState({
            openedImageUrl: photoUrl,
        });
    }

    handleImageClose() {
        this.setState({
            openedImageUrl: "",
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <Grid container className={classes.gridContainer} spacing={1}>
                    <Grid item xs={5}>
                        <Card elevation={5} className={classes.fullHeightCard}>
                            <CardHeader className={classes.cardHeader} title="Offered Item" />
                            <CardContent>
                                <List>
                                    <ListItem dense>
                                        <AwesomeSlider bullets={false} organicArrows={true}>
                                            {this.props.post.photos.map((photo, idx) => (
                                                <div key={idx} onClick={this.handleImageSelection.bind(this, photo.url)}>
                                                    <img className={classes.slidingImage} src={photo.url} />
                                                </div>
                                            ))}
                                        </AwesomeSlider>
                                    </ListItem>
                                    <ListItem>
                                        {this.props.isOwnPost ? (
                                            <FormControl fullWidth>
                                                <input
                                                    accept="image/*"
                                                    className={classes.input}
                                                    id="post-details-upload"
                                                    multiple
                                                    type="file"
                                                    onChange={this.onImageUpload}
                                                />
                                                <label htmlFor="post-details-upload">
                                                    <Button fullWidth className={classes.formButton} component="span" endIcon={<CloudUploadIcon />}>
                                                        Upload *
                                                    </Button>
                                                </label>
                                                <FormHelperText>
                                                    {"You can replace the photos here with up to 3 new photos and at least 1"}
                                                </FormHelperText>
                                                {this.state.photos.map((photo, idx) => (
                                                    <Typography key={idx} align="center">
                                                        <ImageIcon />
                                                        {photo.name}
                                                    </Typography>
                                                ))}
                                            </FormControl>
                                        ) : (
                                            <React.Fragment />
                                        )}
                                    </ListItem>
                                    <Item
                                        item={this.props.post.itemOwned}
                                        isOwnPost={this.props.isOwnPost}
                                        categories={this.props.categories}
                                        onChange={this.props.editItemOwned}
                                    />
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={2} className={classes.arrow}>
                        <SwapHorizOutlinedIcon fontSize="inherit" />
                    </Grid>
                    <Grid item xs={5}>
                        <Card elevation={5} className={classes.fullHeightCard}>
                            <CardHeader className={classes.cardHeader} title="Desired Item" />
                            <CardContent>
                                <List>
                                    <Item
                                        item={this.props.post.itemDesired}
                                        isOwnPost={this.props.isOwnPost}
                                        categories={this.props.categories}
                                        onChange={this.props.editItemDesired}
                                    />
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <PostImage open={Boolean(this.state.openedImageUrl)} image={this.state.openedImageUrl} onImageClose={this.handleImageClose} />
            </React.Fragment>
        );
    }
}
export default withStyles(styles)(PostDetails);
