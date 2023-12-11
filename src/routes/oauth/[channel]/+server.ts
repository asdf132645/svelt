import type {RequestEvent, RequestHandler} from './$types';
import {env} from '$env/dynamic/private';
import {base} from '$app/paths';
import {VITE_CLIENT_ID, VITE_CLIENT_SECRET} from '$env/static/private';
import cookie from 'cookie'

const { VITE_API_HOST: api_host } = env;

export const GET:RequestHandler = async ({url, params}) => {
    const access_token = url.searchParams.get("access_token")
    const id_token = url.searchParams.get("id_token")
    const code = url.searchParams.get('code');

    const profile = await (async () => {
        const payload = {channel: params.channel, access_token, id_token}
        if (access_token || id_token) {
            return profile_with_access_token(payload)
        } else {
            return profile_with_auth_code({
                channel: params.channel,
                code,
                redirect_uri: `${url.origin}${base}/oauth/${params.channel}`,
                id_token: null
            })
        }
    })()

    if (!profile.ok) {
        const {message, error} = await profile.json()
        throw error(profile.status, message || error)
    }

    const {channel, identity, email, credential, name, phone} = await profile.json();
    const authcode = await exchange_code({channel, identity, credential})

    // 회원가입 이력이 있는 유저의 경우 바로 로그인 시킨다
    if (authcode.ok) {
        const { auth_code } = await authcode.json();
        const token = await create_session(auth_code)
        const {accessToken, refreshToken}: TokenProps = await token.json();

        const data = cookie.serialize('dv.token', JSON.stringify({accessToken, refreshToken}), {
            path: '/',
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })

        return new Response('', {
            status: 301,
            headers: {
                'Location': `${base}/oauth?access_token=${accessToken}&refresh_token=${refreshToken}`,
                'Set-Cookie': data
            }
        })
    } else if(authcode.status == 404) {
        const data = cookie.serialize(
            'dv.principal', JSON.stringify({channel, identity, email, credential, name, phone}),
            { expires: new Date(Date.now() + (10 * 60 * 1000)), httpOnly: true , path: '/'}
        )

        // 회원가입 이력이 없는 유저의 경우 약관동의 페이지로 바로 이동 : 회원가입 절차
        return new Response("", {
            status : 301,
            headers : {
                'Location': `${base}/join/consent`,
                'Set-Cookie': data
            }
        })
    } else {
        const {message, error} = await authcode.json()
        throw error(authcode.status, message || error)
    }
}

export const POST:RequestHandler = async ({url, params, request}: RequestEvent) => {
    const data = await request.formData()
    const {
        code,
        id_token,
        user,
    } = Object.fromEntries(data)

    const { name: full_name } = JSON.parse(user as string || '{}')
    const username = full_name ? `${full_name.lastName}${full_name.firstName}` : undefined

    const profile = await profile_with_auth_code(
        {channel: params.channel, code, id_token, redirect_uri: null}
    )

    if (!profile.ok) {
        const {message, error} = await profile.json()
        throw error(profile.status, message || error)
    }

    const {channel, identity, email, credential, name, phone} = await profile.json()

    const authcode = await exchange_code({channel, identity, credential})
    if(authcode.ok) {
        const { auth_code } = await authcode.json()
        const token = await create_session(auth_code)
        const {accessToken, refreshToken}: TokenProps = await token.json()

        const data = cookie.serialize('dv.token', JSON.stringify({accessToken, refreshToken}), {
            path: '/',
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })

        return new Response('', {
           status: 301,
           headers: {
               'Location': `${base}/oauth?access_token=${accessToken}&refresh_token=${refreshToken}`,
               'Set-Cookie': data
           }
        })

    } else if (authcode.status == 404) {
        const data = cookie.serialize(
            'dv.principal',
            JSON.stringify({channel, identity, email, credential, name: (username || name), phone}),
            { expires: new Date(Date.now() + (10 * 60 * 1000)), httpOnly: true , path: '/'}
        )

        return new Response('', {
            status: 301,
            headers: {
                'Location': `${base}/join/consent`,
                'Set-Cookie': data
            }
        })
    } else {
        const {message, error} = await authcode.json()
        throw error(authcode.status, message || error)
    }
}


const profile_with_auth_code = async ({channel, code, id_token, redirect_uri}: any) => {
    const payload = new URLSearchParams({code, id_token, redirect_uri});
    return fetch(`${api_host}/account/v1/${channel}/exchange`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload
    })
}

const profile_with_access_token = async ({channel, access_token, id_token}: any) => {
    const payload = new URLSearchParams({access_token, id_token});
    return fetch(`${api_host}/account/v1/${channel}/identity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload
    })
}

const exchange_code = async ({channel, identity, credential}) => {
    const payload = new URLSearchParams({channel, identity, credential});
    return await fetch(`${api_host}/account/v1/oauth/auth_code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload
    })
}

const create_session = async (auth_code) => {
    const payload = new URLSearchParams({
        client_id: VITE_CLIENT_ID,
        client_secret: VITE_CLIENT_SECRET,
        code: auth_code,
        grant_type: 'authorization_code'
    });

    const res = await fetch(`${api_host}/account/v1/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload
    });

    if (!res.ok) {
        const {message, error} = await res.json()
        throw error(res.status, message || error)
    }

    return res
}
