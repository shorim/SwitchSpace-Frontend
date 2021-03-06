"use strict";
// React
import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
// Material UI Core
import {fade, withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
//Components
import Page from "./Page";
// MISC
import Carousel from "react-material-ui-carousel";
// Assets
import slide1 from "../../public/assets/sliders/Find_close_people_16_9.jpeg";
import slide2 from "../../public/assets/sliders/Save_Money_16_9.jpg";
import slide3 from "../../public/assets/sliders/Communication_16_9.jpeg";
import subcategories from "./utils/Subcategories";

const styles = theme => ({
    gridContainer: {
        width: "80%",
        margin: "auto",
        textAlign: "center",
    },
    sliderMedia: {
        height: 0,
        paddingTop: "56.25%", // 16:9
    },
    card: {
        position: "relative",
    },
    textOverlay: {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        backgroundColor: fade(theme.palette.common.black, 0.35),
        textAlign: "Left",
        color: theme.palette.common.white,
        padding: theme.spacing(1, 0, 1, 2),
    },
    cardMedia: {
        height: 0,
        paddingTop: "75%", // 4:3
    },
});

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.sliderData = [
            {
                header: "Find people who are close",
                subtitle: "No need to travel long distances",
                url: slide1,
            },
            {
                header: "Save money",
                subtitle: "Get the items you want for a much lower cost",
                url: slide2,
            },
            {
                header: "Fast and easy communication",
                subtitle: "Chat with other users and discuss deals",
                url: slide3,
            },
        ];
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            categories: PropTypes.array.isRequired,
            history: PropTypes.object.isRequired,
        };
    }

    goToSearch(category, subcategory) {
        this.props.history.push(`/search?wantedCategory=${category}&wantedSubcategory=${subcategory}`);
    }

    render() {
        const {classes} = this.props;
        return (
            <Page>
                <Grid container spacing={2} className={classes.gridContainer} justify="center" alignItems="center">
                    <Grid item xs={12}>
                        <Carousel animation="slide">
                            {this.sliderData.map((data, idx) => (
                                <Card key={idx} className={classes.card}>
                                    <CardMedia className={classes.sliderMedia} image={data.url} />
                                    <div className={classes.textOverlay}>
                                        <Typography variant="h4" color="inherit">
                                            {data.header}
                                        </Typography>
                                        <Typography variant="h6" color="inherit">
                                            {data.subtitle}
                                        </Typography>
                                    </div>
                                </Card>
                            ))}
                        </Carousel>
                    </Grid>
                    {this.props.categories.map(category =>
                        category.subcategories.map((subcategory, idx) => (
                            <Grid item xs={3} key={idx}>
                                <CardActionArea onClick={() => this.goToSearch(category.title, subcategory.title)}>
                                    <Card key={idx} elevation={5} className={classes.card}>
                                        <CardMedia className={classes.cardMedia} image={subcategories[subcategory.title]} />
                                        <CardContent>
                                            <Typography variant="h5" color="inherit">
                                                {subcategory.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Page>
        );
    }
}

export default withRouter(withStyles(styles)(HomePage));
