"use strict";
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ReportIcon from "@material-ui/icons/Report";
import Page from "./Page";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: "1",
    backgroundColor: "#659dbd",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "1",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#659dbd",
    color: "#fbeec1",
    "&:hover": {
      background: "#558dad",
    },
  },
  centerFold: {
    textAlign: "center",
  },
});

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      report: "",
      repotEmpty: false,
    };
    this.onReportChange = this.onReportChange.bind(this);
  }
  static get propTypes() {
    return {
      classes: PropTypes.object.isRequired,
      posts: PropTypes.array.isRequired,
    };
  }
  onReportChange(e) {
    const value = e.currentTarget.value;
    this.setState({ report: value });
    if (value.length == 0) {
      this.setState({ reportEmpty: true });
    } else {
      this.setState({ reportEmpty: false });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Page>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <ReportIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Report
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                id="report"
                label="Report"
                name="report"
                autoComplete="Report Text"
                onChange={this.onReportChange}
                autoFocus
                error={this.state.reportEmpty}
                helperText={
                  this.state.reportEmpty ? "Report Cannot be Empty" : ""
                }
              />
              <Button
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={this.submitHandler}
              >
                Submit Report
              </Button>
            </form>
          </div>
        </Container>
      </Page>
    );
  }
}
export default withRouter(withStyles(styles)(Report));
