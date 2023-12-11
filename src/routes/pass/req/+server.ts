import type {RequestEvent, RequestHandler} from './$types';
import { env as privateApiHost } from '$env/dynamic/private';
import { env as publicDomain } from '$env/dynamic/public';


const {VITE_API_HOST: api_host} = privateApiHost;
const {PUBLIC_DOMAIN} = publicDomain;
export const POST: RequestHandler = async ({url, params, request}: RequestEvent) => {
    console.log(request.body);
    const page = url.searchParams.get("page")
    try {
        let base = process.env.BASE_PATH || '';
        // 실제 데이터를 body에 넣어 요청 보내기
        const requestData = {
            "serviceType": "telcoAuth",
            "usageCode": page,
            "retTransferType": "MOKResult",
            "returnUrl": `${PUBLIC_DOMAIN}${base}/pass/res`
        };

        const tradeTokenGet = await fetch(`${api_host}/account/v1/pass/trade-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        // 응답 데이터 추출 (JSON 형식의 경우)
        const responseData = await tradeTokenGet
        return responseData;
    } catch (error) {
        console.error("오류 발생:", error);
        throw error;
    }
};