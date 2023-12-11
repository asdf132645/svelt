<script lang="ts">
    import {enhance} from '$app/forms';
    import {afterNavigate, goto} from '$app/navigation';
    import {onMount} from 'svelte';
    import {base} from '$app/paths';
    import {maskingEmail} from '@/utils/masking';
    import type {PageData} from './$types';

    let previousPage: string = base;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });
    export let data: PageData;

    let identity: string = ""
    let email: string = ""
    let name: string = ""
    let channel: string = ""
    let candidates: any[] = []
    let err: string = '';
    let showInvalidTokenText = data.err === 'ok';

    onMount(async () => {
        const params = new URLSearchParams()
        params.append('identity', data.identity || history.state.identity)

        const res = await fetch(`${base}/join/integration?${params}`, {
            method: 'GET'
        })
        const body = await res.json()

        identity = body.identity
        email = body.email
        name = body.username
        channel = body.channel
        candidates = body.candidates

        if (candidates.length == 0) {
            await goto(`${base}/join/complete`, {state: {identity, channel}})
        }
    })

</script>

<div class="app-basic">
    {#if !showInvalidTokenText}
        <div class="pc-header">
            <div class="gnb">
                <div class="logo" on:click={() => goto('/account/login')}></div>
            </div>
        </div>
        <header class="app-title-login pc">
            <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
            <h1>계정통합</h1>
        </header>
        <div class="app-container-login">
            <div class="loginWrap mt-2">
                <form use:enhance method="post">
                    <div class="col">
                        <strong>{name}<span>님</span></strong>
                        이미 회원가입한 계정이 있습니다.<br />현재 가입한 계정을 기존계정과 통합하여<br />회원가입 진행 하시겠습니까?
                    </div>

                    <div class="r-box">
<!--                        <div class="email">({maskingEmail(email)} {channel})계정</div>-->
<!--                        <div class="col">-->
<!--                            {#each candidates as account, idx}-->
<!--                                <div class={`chk-radio ${idx ? 'mt-015' : ''}`}>-->
<!--                                    <input type="radio" name="sns" id={`sns-${idx}`}/>-->
<!--                                    <label for={`sns-${idx}`}>-->
<!--                                        <span class="mr-1"></span>{maskingEmail(account.email)}-->
<!--                                        ({account.providers.map(x => x.channel)})-->
<!--                                    </label>-->
<!--                                </div>-->
<!--                            {/each}-->
<!--                        </div>-->

                        <ul>
                            <li>
                                <p class="subject">신규</p>
                                <p>{maskingEmail(email)} <span>({channel})</span></p>
                            </li>
                            {#each candidates as account, idx}
                            <li>
                                <p class="subject">기존</p>
                                <p>{maskingEmail(account.email)}<span>({account.providers.map(x => x.channel)})</span></p>
                            </li>
                            {/each}
                        </ul>
                    </div>
                    <div class="app-btnWrap relative mt-6">
                        <button
                                type="button"
                                class="btn-style-big-outline"
                                on:click={() => goto(`${base}/login`)}>취소
                        </button
                        >
                        <button type="button"
                                class="btn-style-big-primary"
                                on:click={() => goto(`${base}/join/complete`, {state: { identity, channel }})}
                        >확인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
    {#if showInvalidTokenText}
<!--        <div class="invalid-token-text">-->
<!--            유효한 토큰이 아닙니다.-->
<!--        </div>-->
        <div class="popup">
            <div class="app-basic">
                <div class="header">
                    <h2>인증 만료</h2>
<!--                    <button type="button" class="btn-popup-close"></button>-->
                </div>
                <div class="app-container pad">
                    <div class="img"><img src="{base}/assets/images/app/img-ready.png" alt="" /></div>
                    <p class="msgTxt">
                        인증이 만료 되었습니다. 이메일을 다시 보내주세요.
                    </p>
                </div>
            </div>
        </div>

    {/if}
</div>
