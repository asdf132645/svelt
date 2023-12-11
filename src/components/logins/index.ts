import { base } from '$app/paths';
import {
	PUBLIC_GOOGLE_CLIENT_ID,
	PUBLIC_KAKAO_CLIENT_ID,
	PUBLIC_NAVER_CLIENT_ID,
	PUBLIC_APPLE_CLIENT_ID
} from '$env/static/public';

const GOOGLE_LOGIN_URL = 'https://accounts.google.com/o/oauth2/auth';
const scopes = [
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

const KAKAO_LOGIN_URL = 'https://kauth.kakao.com/oauth/authorize';
const NAVER_LOGIN_URL = 'https://nid.naver.com/oauth2.0/authorize';
const APPLE_LOGIN_URL = 'https://appleid.apple.com/auth/authorize';

export const google_login = () => {
	const { protocol, host } = document.location;
	const query = [
		`client_id=${PUBLIC_GOOGLE_CLIENT_ID}`,
		`redirect_uri=${protocol}//${host}${base}/oauth/google`,
		`scope=${scopes}`,
		`response_type=code`,
		`access_type=offline`
	].join('&');

	document.location.href = `${GOOGLE_LOGIN_URL}?${query}`;
	return false;
};

export const kakao_login = () => {
	const { protocol, host } = document.location;
	const query = [
		`client_id=${PUBLIC_KAKAO_CLIENT_ID}`,
		`redirect_uri=${protocol}//${host}${base}/oauth/kakao`,
		`response_type=code`,
	].join('&');

	document.location.href = `${KAKAO_LOGIN_URL}?${query}`;
	return false;
}

export const naver_login = () => {
	const { protocol, host } = document.location;
	const query = [
		`client_id=${PUBLIC_NAVER_CLIENT_ID}`,
		`redirect_uri=${protocol}//${host}${base}/oauth/naver`,
		`response_type=code`,
		`state=test-state-checker`
	].join('&');

	document.location.href = `${NAVER_LOGIN_URL}?${query}`;
	return false;
}

export const apple_login = () => {
	const { protocol, host} = document.location;
	const query = [
		`client_id=${PUBLIC_APPLE_CLIENT_ID}`,
		`redirect_uri=${protocol}//${host}${base}/oauth/apple`,
		`response_type=${encodeURIComponent('code id_token')}`,
		`scope=${encodeURIComponent('email name')}`,
		`response_mode=form_post`
	].join('&');

	document.location.href = `${APPLE_LOGIN_URL}?${query}`
	return false;
}
