import type {RequestEvent, RequestHandler} from './$types';
import {responseStore } from '@/components/joinStore';
import {env as privateApiHost} from "$env/dynamic/private";
import {env as publicDomain} from "$env/dynamic/public";
const {VITE_API_HOST: api_host} = privateApiHost;
const {PUBLIC_DOMAIN} = publicDomain;
import {base} from '$app/paths';
import {json} from "@sveltejs/kit";




async function readStream(stream: any) {
    if (!stream) {
        return null; // 본문이 없는 경우 null 또는 다른 값을 반환할 수 있음
    }

    const reader = stream.getReader();
    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    return chunks.join('');
}

export const POST = async ({ request }: RequestEvent) => {

    try {
        // 요청 페이로드를 읽어옴
        const requestBody: any = await readStream(request.body);

        // 페이로드를 콘솔로그로 출력
        console.log('Request Payload:', requestBody);

        const jsonResponse = {
            message: 'Request received successfully',
            payload: requestBody,
        };


        const data = requestBody.replace("data=", "");
        // 백엔드에다가 다시 검증 요청
        const mokResult = await fetch(`${api_host}/account/v1/pass/mok-result?token=${data}`, {
            method: 'POST',
        });

        const reconfirmMok = await mokResult.json();

        if(reconfirmMok?.resultCode === '2000'){
            console.log('20000!!!!!!!!!!!!!!!!')
            responseStore.set(JSON.stringify(reconfirmMok));
            console.log('20000!!!!!!!!!!!!!!!!')
            // let base = process.env.BASE_PATH || '';
            // 이동을 위해서 추가
            return json(reconfirmMok)
        }
    } catch (error) {
        console.error('Error:', error);

        // 에러가 발생한 경우
        return new Response('Internal Server Error', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
            },
        });
    }
};
