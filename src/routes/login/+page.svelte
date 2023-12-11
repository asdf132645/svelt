<script lang="ts">
    import {afterNavigate, goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {apple_login, google_login, kakao_login, naver_login} from '@/components/logins';
    import {checkboxes} from '@/utils/consent';
    import Modal from '../join/consent/modal.svelte';
    import {onMount} from "svelte";
    import {env} from '$env/dynamic/public';
    import {setLanding} from "@/components/landing";

    const {PUBLIC_DOMAIN} = env

    let previousPage: string = base;

    onMount(() => {
        setLanding();
        sessionStorage.removeItem('channel');
    });

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    /**
     * popup state../$types
     */
    let showModal = false;
    /** 전문보기 선택*/
    let popupNum: number = 1;
    /** 일반 닫기와, 동의 후 닫기로 분리*/
    const toggle = () => (showModal = !showModal);

    const popupToggle = (num = 0) => {
        popupNum = num;
        showModal = !showModal;
    };

</script>

<body class="bg">

<div class="app-basic">
    <div class="pc-header">
        <div class="gnb">
            <div class="logo" on:click={() => goto('/')}></div>
        </div>
    </div>
    <header class="app-title-login pc mobile">
        <button type="button" class="btn-prev" on:click={() => goto(`/`)}></button>
    </header>
    <div class="app-container-login pad">
        <div class="loginWrap">
            <div class="title">
                <p class="subTxt">예산부터 매출까지</p>
                <p class="mainTxt">
                    개원 예산부터 매출, 관리까지<br />나를 위한 “<strong>닥</strong>터의 <strong>집</strong>사”<br />쉽고 간편하게 로그인하세요~
                </p>
                <div class="img"><img src="{base}/assets/images/app/ico-app-login.png" alt="" style="width:29rem !important"/></div>
            </div>
            <ul class="snsList">
                <li>
                    <button type="button" class="sns-naver" on:click={naver_login}
                    ></button>
                </li>
                <li>
                    <button type="button" class="sns-kakao" on:click={kakao_login}
                    ></button>
                </li>
                <li>
                    <button type="button" class="sns-google" on:click={google_login}
                    ></button
                    >
                </li>
                <li>
                    <button type="button" class="sns-apple" on:click={apple_login}
                    ></button>
                </li>
            </ul>
            <div class="footer mt-28">
                <button type="button" class="btn-style-big-primary w-480" on:click={() => {
                    goto(`${base}/login/email`)
                    sessionStorage.setItem('channel','email');
                }}
                >이메일 로그인
                </button
                >
                <ul class="linkList">
                    {#each checkboxes as {label, required, popup, pageName}}
                        {#if required}
                            <li>
                                <a
                                        on:click={() => popupToggle(popup)}
                                >{label}</a>
                            </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>

</body>

{#if showModal}
    <Modal
            {popupNum}
            {toggle}
            headerName={checkboxes.find(({ popup }) => popup === popupNum)?.label}
    />
{/if}
