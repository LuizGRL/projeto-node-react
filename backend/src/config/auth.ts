export default {
    secret_token: (process.env.JWT_SECRET as string) || "default_secret",
    expires_in_token: "1d", 
};