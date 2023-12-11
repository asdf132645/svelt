/** 쿠키 저장 함수*/
export function setCookie(cookieName: string, value = '', exdays?: number) {
	const exdate = new Date();
	exdate.setDate(exdate.getDate() + (exdays || 0));
	const cookieValue = `${encodeURI(value)}${
		exdays === null ? '' : `; expires=${exdate.toUTCString()}`
	}`;
	document.cookie = `${cookieName}=${cookieValue};path=/`;
}

/**
 * 저장된 ID Cookie 제거 함수
 * @param {string} cookieName
 */
export function deleteCookie(cookieName: string) {
	const expireDate = new Date();
	expireDate.setDate(expireDate.getDate() - 1);
	document.cookie = `${cookieName}= ; expires=${expireDate.toUTCString()}`;
}

/**
 * 저장된 ID Cookie에서 불러오는 함수
 * @param {string} cookieName
 */
export function getCookie(cookieName: string) {
	const cookieNm = `${cookieName}=`;
	const cookieData = document.cookie;
	let start = cookieData.indexOf(cookieNm);
	let cookieValue = '';
	if (start != -1) {
		start += cookieNm.length;
		let end = cookieData.indexOf(';', start);
		if (end == -1) end = cookieData.length;
		cookieValue = cookieData.substring(start, end);
	}
	return decodeURI(cookieValue);
}
