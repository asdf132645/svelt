import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async ({cookies}) => {
    const data = cookies.get('dv.token')
    console.log(data)
    const {accessToken, refreshToken} = JSON.parse(data)

    cookies.delete('dv.token')

    return {accessToken: accessToken, refreshToken: refreshToken}
}