import React from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MainClientContext } from "../components/App";
import Copyright from "../components/Copyright";
import { useAppDispatch } from "../hooks/useGlobalState";
import { setUser } from "../state/user/slice";
import { ApiRoutes, Pages } from "../types/enums";
import { IUser } from "../types/models.types";
import { REQUIRED_FIELD } from "../utils/constants";

const THEME = createTheme();

const initialValues = {
    values: {
        login: "",
        password: "",
        rememberMe: false
    },
    errors: {
        login: "",
        password: "",
        rememberMe: ""
    }
};

export default function SignIn() {
    const [saveDisabled, setSaveDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [errorFromServer, setErrorFromServer] = React.useState(false);
    const [formValues, setFormValues] = React.useState(initialValues);

    const mainClient = React.useContext(MainClientContext);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        setSaveDisabled(loading || !formValues.values.login || !formValues.values.password || Object.values(formValues.errors).some(Boolean));
    }, [loading, formValues]);

    // Изменение поля
    const onChange = (field: string, value: string | boolean) => {
        setFormValues({
            values: { ...formValues.values, [field]: value },
            errors: errorFromServer ? { ...initialValues.errors } : { ...formValues.errors, [field]: value ? "" : REQUIRED_FIELD }
        });
        setErrorFromServer(false);
    };

    // Отправка формы
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!saveDisabled) {
            mainClient.postRequest(
                ApiRoutes.signIn, 
                formValues.values, 
                setLoading, 
                (data: { success: boolean, user: IUser }) => {
                    dispatch(setUser(data.user));
                    navigate(Pages.profile);
                },
                undefined,
                undefined,
                undefined,
                (error) => {
                    if (error && typeof error === "object" && error.message) {
                        setErrorFromServer(true);
                        setFormValues({
                            ...formValues,
                            errors: { ...formValues.errors, login: error.message, password: error.message }
                        });
                    }
                }
            );
        }
    };

    return (
        <ThemeProvider theme={THEME}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} sx={{
                    backgroundImage: "url(https://source.unsplash.com/random)",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: t => t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }} />

                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            Вход
                        </Typography>

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                id="login"
                                name="login"
                                margin="normal"
                                variant="outlined"
                                label="Почта или телефон"
                                autoComplete="Почта или телефон"
                                required
                                fullWidth
                                autoFocus

                                error={Boolean(formValues.errors.login)}
                                helperText={formValues.errors.login ? formValues.errors.login : null}

                                onChange={e => onChange("login", e.target.value)}
                            />

                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                margin="normal"
                                variant="outlined"
                                label="Пароль"
                                autoComplete="Пароль"
                                required
                                fullWidth

                                error={Boolean(formValues.errors.password)}
                                helperText={formValues.errors.password ? formValues.errors.password : null}

                                onChange={e => onChange("password", e.target.value)}
                            />

                            <FormControlLabel 
                                label="Запомнить меня" 
                                control={
                                    <Checkbox 
                                        value={false} 
                                        color="primary"

                                        onChange={e => onChange("rememberMe", e.target.checked)}
                                    />
                                } 
                            />

                            <LoadingButton
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                loading={loading}
                                disabled={saveDisabled}
                            >
                                Войти
                            </LoadingButton>

                            <Grid container>
                                <Grid item xs>
                                    <Link href={Pages.resetPassword} variant="body2" onClick={() => navigate(Pages.resetPassword)}>
                                        Забыли пароль?
                                    </Link>
                                </Grid>

                                <Grid item>
                                    <Link href={Pages.signUp} variant="body2" onClick={() => navigate(Pages.signUp)}>
                                        Нет аккаунта? Зарегистрируйтесь!
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>

                        <Copyright />
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};