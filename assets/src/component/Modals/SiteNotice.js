import React, { useCallback, useEffect, useState } from "react";
import { FormControl, makeStyles, TextField } from "@material-ui/core";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { toggleSnackbar } from "../../actions/index";
import { useDispatch, useSelector } from "react-redux";
import API from "../../middleware/Api";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import { reportReasons } from "../../config";
import Auth from "../../middleware/Auth";

const useStyles = makeStyles((theme) => ({
    widthAnimation: {},
    content: {
        overflowWrap: "break-word",
    },
}));

export default function SiteNotice() {
    const content = useSelector((state) => state.siteConfig.site_notice);
    const classes = useStyles();
    const [show, setShow] = useState(false);
    const setRead = () => {
        setShow(false);
        Auth.SetPreference("notice_read", content);
    };
    useEffect(() => {
        const newNotice = Auth.GetPreference("notice_read");
        if (content !== "" && newNotice !== content) {
            setShow(true);
        }
    }, [content]);
    return (
        <Dialog
            open={show}
            onClose={() => setShow(false)}
            aria-labelledby="form-dialog-title"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="form-dialog-title">公告</DialogTitle>
            <DialogContent
                className={classes.content}
                dangerouslySetInnerHTML={{ __html: content }}
            />

            <DialogActions>
                <Button onClick={() => setRead()} color="primary">
                    不再显示
                </Button>
                <Button onClick={() => setShow(false)}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}
