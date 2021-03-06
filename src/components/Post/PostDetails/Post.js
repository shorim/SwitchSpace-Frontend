"use strict";
// React
import React from "react";
import PropTypes from "prop-types";
import Geocode from "react-geocode";
// Material UI Core
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
// Material UI Icons
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import LocationOnIcon from "@material-ui/icons/LocationOn";
// Components
import PostDetails from "./PostDetails";
import UserInfo from "../../UserProfile/UserInfo";
import Page from "../../Page";
import ReportModal from "./ReportModal";
import LocationModal from "../CreatePost/LocationModal";

// Services
import AdminAuthService from "../../../services/AdminAuthService";
import UserAuthService from "../../../services/UserAuthService";
Geocode.setApiKey(process.env.GOOGLE_API_KEY);

const styles = theme => ({
    conatiner: {
        textAlign: "center",
        width: "85%",
        margin: "0 auto",
    },
    icon: {
        minWidth: "auto",
    },
    date: {
        textAlign: "right",
        fontSize: "0.85em",
        marginBottom: theme.spacing(1),
    },
    rightGridItem: {
        textAlign: "right",
    },
    topContainer: {
        marginBottom: theme.spacing(1),
    },
    button: {
        color: theme.palette.button.textColor(),
        backgroundColor: theme.palette.button.backgroundColor(),
        "&:hover": {
            background: theme.palette.button.hover.backgroundColor(),
        },
        marginTop: theme.spacing(1),
    },
    reportButton: {
        backgroundColor: theme.palette.button.error,
        color: theme.palette.button.textColor(),
        marginTop: theme.spacing(1),
    },
    bottom: {
        textAlign: "right",
    },
});

class Post extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ReportModalOpen: false,
            reportContent: "",
            postLocation: "Unknown Location",
            locationModalOpen: false,
            editedItemOwned: null,
            editedItemDesired: null,
            editedPhotos: null,
            editedLocation: null,
            chatReceiverId: "",
        };

        this.toggleReportModal = this.toggleReportModal.bind(this);
        this.submitReport = this.submitReport.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.isOwnPost = this.isOwnPost.bind(this);
        this.toggleLocationModal = this.toggleLocationModal.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.isEdited = this.isEdited.bind(this);
        this.getPhotos = this.getPhotos.bind(this);
        this.getItemOwned = this.getItemOwned.bind(this);
        this.getItemDesired = this.getItemDesired.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.setReceiverId = this.setReceiverId.bind(this);
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            post: PropTypes.object.isRequired,
            submitReport: PropTypes.func.isRequired,
            userId: PropTypes.string.isRequired,
            categories: PropTypes.array.isRequired,
            editPost: PropTypes.func.isRequired,
            deletePost: PropTypes.func.isRequired,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.post.exchangeLocation !== this.props.post.exchangeLocation) {
            this.getLocation();
        }
    }

    isOwnPost() {
        // return false;
        return this.props.userId == this.props.post.creatorId._id;
    }
    isAdmin() {
        return AdminAuthService.isAdminUser(this.props.userId);
    }

    isEdited() {
        return this.state.editedItemDesired || this.state.editedItemOwned || this.state.editedPhotos || this.state.editedLocation;
    }

    toggleLocationModal() {
        this.setState({
            locationModalOpen: !this.state.locationModalOpen,
        });
    }

    setLocation(lat, lng) {
        this.setState({
            editedLocation: {
                type: "Point",
                coordinates: [lng, lat],
            },
        });
        this.toggleLocationModal();
    }

    async getLocation() {
        const coord = this.props.post.exchangeLocation.coordinates;
        let loc = await Geocode.fromLatLng(coord[1], coord[0]);
        let components = loc.results[0].address_components;
        let filtered = components.filter(elem => elem.types[0] == "locality")[0];
        if (filtered) {
            this.setState({postLocation: filtered.long_name});
        }
    }

    getPhotos(photos) {
        this.setState({
            editedPhotos: photos,
        });
    }

    getItemOwned(item) {
        this.setState({
            editedItemOwned: item,
        });
    }

    getItemDesired(item) {
        this.setState({
            editedItemDesired: item,
        });
    }

    toggleReportModal() {
        this.setState({
            ReportModalOpen: !this.state.ReportModalOpen,
        });
    }

    submitReport(report) {
        this.props.submitReport(report);
        this.toggleReportModal();
    }

    async submitEdit() {
        let formData = new FormData();
        if (this.state.editedItemOwned) {
            formData.append("itemOwned", JSON.stringify(this.state.editedItemOwned));
        }
        if (this.state.editedItemDesired) {
            formData.append("itemDesired", JSON.stringify(this.state.editedItemDesired));
        }
        if (this.state.editedLocation) {
            formData.append("exchangeLocation", JSON.stringify(this.state.editedLocation));
        }
        if (this.state.editedPhotos) {
            this.state.editedPhotos.map((file, index) => {
                formData.append(`postPicture[${index}]`, file);
            });
        }
        this.props.editPost(formData);
    }

    async submitDelete() {
        this.props.deletePost();
    }

    setReceiverId() {
        this.setState(
            {
                chatReceiverId: this.props.post.creatorId._id,
            },
            () => {
                this.setState({
                    chatReceiverId: "",
                });
            }
        );
    }

    render() {
        const {classes} = this.props;
        // to avoid undefined post
        if (!this.props.post._id) {
            return <React.Fragment />;
        }
        return (
            <Page chatReceiverIdFromPost={this.state.chatReceiverId}>
                <div>
                    <Container className={classes.conatiner}>
                        <Grid container justify="space-between" className={classes.topContainer}>
                            <Grid item>
                                <UserInfo userInfo={this.props.post.creatorId} provideLinkToProfile={true} />
                            </Grid>
                            <Grid item className={classes.rightGridItem}>
                                <div className={classes.date}>{this.props.post.createdAt.substring(0, 10)}</div>
                                <Grid container justify="flex-end">
                                    <div className={classes.icon}>
                                        <LocationOnOutlinedIcon />
                                    </div>
                                    {this.state.postLocation}
                                </Grid>
                                {this.isOwnPost() ? (
                                    <Button
                                        variant="contained"
                                        className={classes.button}
                                        endIcon={<LocationOnIcon />}
                                        onClick={this.toggleLocationModal}>
                                        Edit Location
                                    </Button>
                                ) : (
                                    // show "Contact for Exchange" button only for normal users and not admins
                                    UserAuthService.isNormalUser() && (
                                        <Button className={classes.button} onClick={this.setReceiverId}>
                                            Contact for Exchange
                                        </Button>
                                    )
                                )}
                            </Grid>
                        </Grid>
                        <PostDetails
                            post={this.props.post}
                            isOwnPost={this.isOwnPost()}
                            editPhotos={this.getPhotos}
                            categories={this.props.categories}
                            editItemOwned={this.getItemOwned}
                            editItemDesired={this.getItemDesired}
                        />
                        <div className={classes.bottom}>
                            {this.isOwnPost() || this.isAdmin() ? (
                                this.isEdited() ? (
                                    <Button className={classes.button} onClick={this.submitEdit}>
                                        Submit Edits
                                    </Button>
                                ) : (
                                    <Button variant="contained" className={classes.reportButton} onClick={this.submitDelete}>
                                        Delete Post
                                    </Button>
                                )
                            ) : (
                                <Button variant="contained" className={classes.reportButton} onClick={this.toggleReportModal}>
                                    Report Post
                                </Button>
                            )}
                        </div>
                    </Container>
                    <ReportModal modalOpen={this.state.ReportModalOpen} onClose={this.toggleReportModal} submitReport={this.submitReport} />
                    <LocationModal
                        modalOpen={this.state.locationModalOpen}
                        onClose={this.toggleLocationModal}
                        setLocation={this.setLocation}
                        oldMarker={this.props.post.exchangeLocation}
                    />
                </div>
            </Page>
        );
    }
}
export default withStyles(styles)(Post);
