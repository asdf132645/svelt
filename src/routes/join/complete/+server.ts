import {env} from '$env/dynamic/private';
import type {RequestHandler} from './$types';
import {VITE_CLIENT_ID, VITE_CLIENT_SECRET} from "$env/static/private";
import {json} from "@sveltejs/kit";

const { VITE_API_HOST } = env;

export const POST: RequestHandler = async({request}) => {
    const data = await request.json()
    const res = await fetch(`${VITE_API_HOST}/account/v1/join/user`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw await res.json();
    }

    const code = await res.json()

    const tokenReq = new URLSearchParams({
        client_id: VITE_CLIENT_ID,
        client_secret: VITE_CLIENT_SECRET,
        code: String(code.auth_code),
        grant_type: 'authorization_code',
    });

    const tokenRes = await fetch(`${VITE_API_HOST}/account/v1/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenReq,
    });

    if (!tokenRes.ok) {
        throw await tokenRes.json();
    }

    const token = await tokenRes.json()

    return json(token);
}