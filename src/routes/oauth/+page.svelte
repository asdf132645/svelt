<script lang="ts">
    import { onMount } from "svelte";
    import {afterNavigate, goto} from '$app/navigation';
    import type {PageData, PageServerData} from './$types';
    import {env} from "$env/dynamic/public";
    import {getLanding, popLanding, setLanding} from "@/components/landing";
    const { PUBLIC_DOMAIN } = env

    export let data: PageServerData;
    const { accessToken } = data;

    onMount(() => {
        setLanding()
    });

    onMount(() => {
        snsOnLogin();
    });
    const snsOnLogin = async () => {
        await fetch(`/api/proxy/account/v1/session`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'access_token':  accessToken
            })
        })
        let landing = popLanding();
        await goto(landing);
    }
</script>