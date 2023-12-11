import {env} from "$env/dynamic/public";
import {base} from "$app/paths";

const { PUBLIC_DOMAIN } = env

export function setLanding() {
    const rtn = new URLSearchParams(location.search).get('return_url');
    const ref = validLanding();
    let landing = rtn || ref || PUBLIC_DOMAIN;

    const storedReturnUrl = sessionStorage.getItem('returnUrl');

    if (storedReturnUrl) {
        landing = `${landing}`;
    }else{
        sessionStorage.setItem('landing', rtn || ref || PUBLIC_DOMAIN);
    }

    sessionStorage.setItem('landing', landing);

    sessionStorage.removeItem('returnUrl');
    // sessionStorage.setItem('landing', rtn || ref || PUBLIC_DOMAIN);


}

function validLanding() {
    const referer = document.referrer
    const login = `${location.origin}${base}`
    return referer.startsWith(PUBLIC_DOMAIN) && !referer.startsWith(login) ? referer : null
}

export function getLanding() {
    return sessionStorage.getItem('landing') || PUBLIC_DOMAIN
}

export function popLanding() {
    const landing = sessionStorage.getItem('landing') || PUBLIC_DOMAIN
    sessionStorage.removeItem('landing')
    return landing
}