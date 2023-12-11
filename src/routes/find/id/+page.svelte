<script lang="ts">
    import {afterNavigate, goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {Timer} from '@/components/timer';
    import {onMount} from "svelte";
    let previousPage: string = base;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    /** 서버에 인증 번호를 요청했는지 여부*/
    let isRequest = false;
    /** 서버에서 받은 인증 번호를 입력한 상태*/
    let isSend = false;
    /** 인증번호 입력후 아이디를 찾지 못할 때*/
    let notFound = false;
    let emails: any[];
    /** 인증번호 */
    let certNumber = '';
    /** 입력한 인증번호가 잘못된 인증번호인 경우 true */
    let wrongCert = false;

    /** 사용자 휴대전화번호 */
    let phoneNumber: number;
    /** 인증번호 요청 가능여부: 사용자이름 입력 및 휴대전화번호 10자리 이상*/
    $: canSend = String(phoneNumber).length > 9;

    const find_account = async () => {
        const phone = `${String(phoneNumber)}`;
        /** 인증 번호 요청함*/
        const res = await fetch(`${base}/find/id/${phone}`, {
            method: 'POST',
            body: JSON.stringify({phone})
        });
        emails = await res.json();
        isSend = true
        if (emails.length == 0) {
            notFound = true
        }
    };

    function mok_popup() {
        // MOBILEOK.process 사용 가능
        const { protocol, host } = document.location;

        window.MOBILEOK.process(`${protocol}//${host}${base}/pass/req?page=01003`, 'WB', 'moResult');

    }

    function moResult(result) {
        console.log(result)
        try {
            result = JSON.parse(result);
            JSON.stringify(result, null, 4);
            console.log(result);
            phoneNumber = result.phone;
            find_account();
        } catch (error) {
            console.log(result)
            result;
        }
    }


    onMount(() => {
        window.moResult = moResult;
    });
</script>
<!--{ JSON.stringify(sessionStorage.getItem('type')) }-->
{#if isSend === true}
    {#if notFound}
        <div class="app-basic">
            <div class="pc-header">
                <div class="gnb">
                    <div class="logo" on:click={() => goto('/account/login')}></div>
                </div>
            </div>
            <header class="app-title-login pc">
                <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
                <h1>아이디 찾기 결과</h1>
            </header>
            <div class="app-container-login">
                <div class="loginWrap mt-2">
                    <p class="mainTxt email">아이디 찾기 결과</p>
                    <p class="subTxt email">일치하는 정보를 찾을 수 없습니다.<br />확인 후 다시 진행하시기 바랍니다.</p>
                </div>
            </div>
            <div class="app-btnWrap loginWrap-btnWrap fixed">
                <button type="button" on:click={() => goto(`${base}/join/consent`)} class="btn-style-big-primary w-330"><u>회원가입</u></button>
            </div>
        </div>
    {:else}
        <div class="app-basic">
            <div class="pc-header">
                <div class="gnb">
                    <div class="logo" on:click={() => goto('/account/login')}></div>
                </div>
            </div>
            <header class="app-title-login pc">
                <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
                <h1>아이디 찾기</h1>
            </header>
            <div class="app-container-login">
                <div class="loginWrap mt-2">
                    <p class="mainTxt email">아이디 찾기 결과</p>
                    <p class="subTxt email">등록된 휴대전화 정보와 일치하는 아이디를 찾았습니다.</p>
                    {#each emails as account}
                        <p class="emailAddress">{account.email} <span>({account.channel})</span></p>
                    {/each}
                </div>
            </div>
            <div class="app-btnWrap loginWrap-btnWrap fixed">
                <button type="button" class="btn-style-big-primary w-330" on:click={() => goto(`${base}/login`)}>로그인</button>
            </div>
        </div>
    {/if}
{:else}
    <div class="app-basic">
        <div class="pc-header">
            <div class="gnb">
                <div class="logo" on:click={() => goto('/account/login')}></div>
            </div>
        </div>
        <header class="app-title-login pc">
            <button type="button" class="btn-prev" on:click={() => goto(`${base}/login/email`)}/>
            <h1>아이디 찾기</h1>
        </header>
        <div class="app-container-login">
            <div class="loginWrap">
                <div class="img"><img src="{base}/assets/images/app/ico-app-find.png" alt=""/></div>
                <p class="mainTxt email">휴대폰 인증</p>
                <p class="subTxt email">본인인증을 통해 아이디 찾기 진행해 주세요.</p>
            </div>
        </div>
        <div class="app-btnWrap loginWrap-btnWrap fixed">
            <button type="button" class="btn-style-big-primary w-330" on:click={() => {mok_popup()}}>휴대폰 인증</button>
        </div>
    </div>
{/if}
