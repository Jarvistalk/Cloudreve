import React, { useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    CircularProgress,
} from "@material-ui/core";
import { toggleSnackbar, setModalsLoading } from "../../actions/index";
import PathSelector from "../FileManager/PathSelector";
import { useDispatch } from "react-redux";
import API from "../../middleware/Api";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: "relative",
    },
    buttonProgress: {
        color: theme.palette.secondary.light,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    },
    input: {
        width: 250,
    },
}));

export default function RelocateDialog(props) {
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [policies, setPolicies] = useState([]);
    const dispatch = useDispatch();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch]
    );

    const SetModalsLoading = useCallback(
        (status) => {
            dispatch(setModalsLoading(status));
        },
        [dispatch]
    );

    const submitRelocate = (e) => {
        if (e != null) {
            e.preventDefault();
        }
        SetModalsLoading(true);

        const dirs = [],
            items = [];
        // eslint-disable-next-line
        props.selected.map((value) => {
            if (value.type === "dir") {
                dirs.push(value.id);
            } else {
                items.push(value.id);
            }
        });

        API.post("/file/relocate", {
            src: {
                dirs: dirs,
                items: items,
            },
            dst_policy_id: selectedPolicy,
        })
            .then(() => {
                props.onClose();
                ToggleSnackbar("top", "right", "转移任务已创建", "success");
                SetModalsLoading(false);
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
                SetModalsLoading(false);
            });
    };

    useEffect(() => {
        if (props.open) {
            API.get("/user/setting/policies")
                .then((response) => {
                    setPolicies(response.data.options);
                    setSelectedPolicy(response.data.current.id);
                })
                .catch((error) => {
                    ToggleSnackbar("top", "right", error.message, "error");
                });
        }

        // eslint-disable-next-line
    }, [props.open]);

    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">转移到存储策略</DialogTitle>

            <DialogContent className={classes.contentFix}>
                <Select
                    className={classes.input}
                    labelId="demo-simple-select-label"
                    value={selectedPolicy}
                    onChange={(e) => setSelectedPolicy(e.target.value)}
                >
                    {policies.map((v, k) => (
                        <MenuItem key={k} value={v.id}>
                            {v.name}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onClose}>取消</Button>
                <div className={classes.wrapper}>
                    <Button
                        onClick={submitRelocate}
                        color="primary"
                        disabled={selectedPolicy === "" || props.modalsLoading}
                    >
                        确定
                        {props.modalsLoading && (
                            <CircularProgress
                                size={24}
                                className={classes.buttonProgress}
                            />
                        )}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
