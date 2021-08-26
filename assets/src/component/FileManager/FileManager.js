import React, { Component } from "react";

import Navigator from "./Navigator/Navigator";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import DragLayer from "./DnD/DragLayer";
import Explorer from "./Explorer";
import Modals from "./Modals";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import {
    closeAllModals,
    navigateTo,
    setSelectedTarget,
    toggleSnackbar,
} from "../../actions";
import { changeSubTitle } from "../../redux/viewUpdate/action";
import { withRouter } from "react-router-dom";
import pathHelper from "../../utils/page";
import SideDrawer from "./Sidebar/SideDrawer";
import { ImageLoader } from "@abslant/cd-image-loader";

const styles = () => ({});

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
    return {
        changeSubTitle: (text) => {
            dispatch(changeSubTitle(text));
        },
        setSelectedTarget: (targets) => {
            dispatch(setSelectedTarget(targets));
        },
        toggleSnackbar: (vertical, horizontal, msg, color) => {
            dispatch(toggleSnackbar(vertical, horizontal, msg, color));
        },
        closeAllModals: () => {
            dispatch(closeAllModals());
        },
        navigateTo: (path) => {
            dispatch(navigateTo(path));
        },
    };
};

class FileManager extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.setSelectedTarget([]);
        this.props.closeAllModals();
        this.props.navigateTo("/");
    }

    componentDidMount() {
        if (pathHelper.isHomePage(this.props.location.pathname)) {
            this.props.changeSubTitle(null);
        }
    }

    render() {
        return (
            <div>
                <DndProvider backend={HTML5Backend}>
                    <Modals share={this.props.share} />
                    <Navigator
                        isShare={this.props.isShare}
                        share={this.props.share}
                    />
                    <Explorer share={this.props.share} />
                    <DragLayer />
                    <ImageLoader />
                </DndProvider>
                <SideDrawer />
            </div>
        );
    }
}

FileManager.propTypes = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(withRouter(FileManager)));
