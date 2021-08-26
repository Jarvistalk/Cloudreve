import React, { useCallback, useState } from "react";
import { FormControl, makeStyles, TextField } from "@material-ui/core";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { toggleSnackbar } from "../../actions/index";
import { useDispatch } from "react-redux";
import API from "../../middleware/Api";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import { reportReasons } from "../../config";

const useStyles = makeStyles((theme) => ({
    widthAnimation: {},
    shareUrl: {
        minWidth: "400px",
    },
    wrapper: {
        margin: theme.spacing(1),
        position: "relative",
    },
    buttonProgress: {
        color: theme.palette.secondary.light,
        position: "absolute",
        top: "50%",
        left: "50%",
    },
    flexCenter: {
        alignItems: "center",
    },
    noFlex: {
        display: "block",
    },
    scoreCalc: {
        marginTop: 10,
    },
}));

export default function Report(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [reason, setReason] = useState("0");
    const [des, setDes] = useState("");
    const [loading, setLoading] = useState(false);

    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch]
    );

    const onClose = () => {
        props.onClose();
        setTimeout(() => {
            setDes("");
            setReason("0");
        }, 500);
    };

    const submitReport = () => {
        setLoading(true);
        API.post("/share/report/" + props.share.key, {
            des: des,
            reason: parseInt(reason),
        })
            .then(() => {
                ToggleSnackbar("top", "right", "举报成功", "success");
                setLoading(false);
                onClose();
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
                setLoading(false);
            });
    };

    return (
        <Dialog
            open={props.open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
            className={classes.widthAnimation}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle id="form-dialog-title">举报</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        {reportReasons.map((v, k) => (
                            <FormControlLabel
                                key={k}
                                value={k.toString()}
                                control={<Radio />}
                                label={v}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                <TextField
                    fullWidth
                    id="standard-multiline-static"
                    label="补充描述"
                    multiline
                    value={des}
                    onChange={(e) => setDes(e.target.value)}
                    variant="filled"
                    rows={4}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
                <Button
                    onClick={submitReport}
                    color="secondary"
                    disabled={loading}
                >
                    提交
                </Button>
            </DialogActions>
        </Dialog>
    );
}
