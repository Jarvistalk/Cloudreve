import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import API from "../../../middleware/Api";
import { useDispatch } from "react-redux";
import { toggleSnackbar } from "../../../actions";
import SizeInput from "../Common/SizeInput";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up("md")]: {
            marginLeft: 100,
        },
        marginBottom: 40,
    },
    form: {
        maxWidth: 400,
        marginTop: 20,
        marginBottom: 20,
    },
    formContainer: {
        [theme.breakpoints.up("md")]: {
            padding: "0px 24px 0 24px",
        },
    },
}));

export default function UploadDownload() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({
        max_worker_num: "1",
        max_parallel_transfer: "1",
        temp_path: "",
        maxEditSize: "0",
        onedrive_chunk_retries: "0",
        archive_timeout: "0",
        download_timeout: "0",
        preview_timeout: "0",
        doc_preview_timeout: "0",
        upload_credential_timeout: "0",
        upload_session_timeout: "0",
        slave_api_timeout: "0",
        onedrive_monitor_timeout: "0",
        share_download_session_timeout: "0",
        onedrive_callback_check: "0",
        reset_after_upload_failed: "0",
        onedrive_source_timeout: "0",
    });

    const handleCheckChange = (name) => (event) => {
        const value = event.target.checked ? "1" : "0";
        setOptions({
            ...options,
            [name]: value,
        });
    };

    const handleChange = (name) => (event) => {
        setOptions({
            ...options,
            [name]: event.target.value,
        });
    };

    const dispatch = useDispatch();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch]
    );

    useEffect(() => {
        API.post("/admin/setting", {
            keys: Object.keys(options),
        })
            .then((response) => {
                setOptions(response.data);
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
            });
        // eslint-disable-next-line
    }, []);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        const option = [];
        Object.keys(options).forEach((k) => {
            option.push({
                key: k,
                value: options[k],
            });
        });
        API.patch("/admin/setting", {
            options: option,
        })
            .then(() => {
                ToggleSnackbar("top", "right", "???????????????", "success");
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
            })
            .then(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <form onSubmit={submit}>
                <div className={classes.root}>
                    <Typography variant="h6" gutterBottom>
                        ???????????????
                    </Typography>
                    <div className={classes.formContainer}>
                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    Worker ??????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.max_worker_num}
                                    onChange={handleChange("max_worker_num")}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    ??????????????????????????????????????????????????????????????????
                                    Cloudreve ??????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ??????????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.max_parallel_transfer}
                                    onChange={handleChange(
                                        "max_parallel_transfer"
                                    )}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    ?????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="component-helper">
                                    ????????????
                                </InputLabel>
                                <Input
                                    value={options.temp_path}
                                    onChange={handleChange("temp_path")}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    ??????????????????????????????????????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <SizeInput
                                    value={options.maxEditSize}
                                    onChange={handleChange("maxEditSize")}
                                    required
                                    min={0}
                                    max={2147483647}
                                    label={"??????????????????????????????"}
                                />
                                <FormHelperText id="component-helper-text">
                                    ???????????????????????????????????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    OneDrive ??????????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 0,
                                        step: 1,
                                    }}
                                    value={options.onedrive_chunk_retries}
                                    onChange={handleChange(
                                        "onedrive_chunk_retries"
                                    )}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    OneDrive
                                    ?????????????????????????????????????????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={
                                                options.reset_after_upload_failed ===
                                                "1"
                                            }
                                            onChange={handleCheckChange(
                                                "reset_after_upload_failed"
                                            )}
                                        />
                                    }
                                    label="???????????????????????????????????????"
                                />
                                <FormHelperText id="component-helper-text">
                                    ???????????????????????????????????????????????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div className={classes.root}>
                    <Typography variant="h6" gutterBottom>
                        ????????? (???)
                    </Typography>

                    <div className={classes.formContainer}>
                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.archive_timeout}
                                    onChange={handleChange("archive_timeout")}
                                    required
                                />
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.download_timeout}
                                    onChange={handleChange("download_timeout")}
                                    required
                                />
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.preview_timeout}
                                    onChange={handleChange("preview_timeout")}
                                    required
                                />
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    Office ??????????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.doc_preview_timeout}
                                    onChange={handleChange(
                                        "doc_preview_timeout"
                                    )}
                                    required
                                />
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.upload_credential_timeout}
                                    onChange={handleChange(
                                        "upload_credential_timeout"
                                    )}
                                    required
                                />
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.upload_session_timeout}
                                    onChange={handleChange(
                                        "upload_session_timeout"
                                    )}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    ?????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ??????API??????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.slave_api_timeout}
                                    onChange={handleChange("slave_api_timeout")}
                                    required
                                />
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    ??????????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={
                                        options.share_download_session_timeout
                                    }
                                    onChange={handleChange(
                                        "share_download_session_timeout"
                                    )}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    ????????????????????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    OneDrive ???????????????????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.onedrive_monitor_timeout}
                                    onChange={handleChange(
                                        "onedrive_monitor_timeout"
                                    )}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    ???????????????????????????Cloudreve ?????? OneDrive
                                    ???????????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    OneDrive ????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                    value={options.onedrive_callback_check}
                                    onChange={handleChange(
                                        "onedrive_callback_check"
                                    )}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    OneDrive
                                    ?????????????????????????????????????????????????????????????????????????????????????????????
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div className={classes.form}>
                            <FormControl>
                                <InputLabel htmlFor="component-helper">
                                    OneDrive ??????????????????
                                </InputLabel>
                                <Input
                                    type={"number"}
                                    inputProps={{
                                        min: 1,
                                        max: 3659,
                                        step: 1,
                                    }}
                                    value={options.onedrive_source_timeout}
                                    onChange={handleChange(
                                        "onedrive_source_timeout"
                                    )}
                                    required
                                />
                                <FormHelperText id="component-helper-text">
                                    OneDrive ?????????????????? URL
                                    ????????????????????????????????????????????????API????????????
                                </FormHelperText>
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div className={classes.root}>
                    <Button
                        disabled={loading}
                        type={"submit"}
                        variant={"contained"}
                        color={"primary"}
                    >
                        ??????
                    </Button>
                </div>
            </form>
        </div>
    );
}
