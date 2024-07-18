import { AuthErrorCodes } from "firebase/auth";

export const getErrorMsg = err => {
    switch (err?.code) {
        case AuthErrorCodes.EMAIL_EXISTS:
            return "Email is already in use."
        case AuthErrorCodes.INVALID_EMAIL:
            return "Invalid email address. Try again with a valid email."
        case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
            return "Wrong email or password. Try again."
        case AuthErrorCodes.INVALID_PASSWORD:
            return "Wrong password. Try again."
        case AuthErrorCodes.POPUP_CLOSED_BY_USER:
            return "Sign in cancelled."
        case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
            return "Too many attempts. Try again later."
        case AuthErrorCodes.USER_DELETED:
            return "No registered user with that email. Sign up below."
        case AuthErrorCodes.WEAK_PASSWORD:
            return "Password should be at least 6 characters long."
        default:
            return `Error: ${err.message}`;
    }
};