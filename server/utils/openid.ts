import { Issuer } from "openid-client";
import 'dotenv/config'

async function setupOpenID() {
    const issuer = await Issuer.discover(
        "https://apis.roblox.com/oauth/.well-known/openid-configuration"
    );

    const port = process.env.ROBLOX_PORT || 3000;
    const clientId = process.env.ROBLOX_CLIENT_ID;
    const clientSecret = process.env.ROBLOX_CLIENT_SECRET;

    const client = new issuer.Client({
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uris: [`http://localhost:${port}/oauth/callback`],
        response_types: ["code"],
        scope: "openid profile",
        id_token_signed_response_alg: "ES256",
    });

    const secureCookieConfig = {
        secure: true,
        httpOnly: true,
        signed: true,
    };

    return { client, secureCookieConfig };
}

export default setupOpenID;
