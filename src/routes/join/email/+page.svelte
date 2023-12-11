<script lang="ts">
    import {afterNavigate, goto} from '$app/navigation';
    import {base} from '$app/paths';
    import type {CheckEmailTypes} from '@/components/types/email';
    import {onMount} from "svelte";

    const redirectedUrl = `${base}/join/profile`; // 리디렉션된 URL


    let previousPage: string = base;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    let email = '';
    /** 이메일 확인을 했는지 */
    let emailConfirm = false;
    /** 중복 이메일이 없는 경우 true*/
    let confirmState = true;
    /** 중복 이메일의 채널 */
    let channel = '';

    let emailCheck = false;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    /** email 형식이 올바른지 */
    $: correctEmailFormat = emailRegex.test(email);
    /** inputbox 상태*/
    $: correctInput = (!emailConfirm && correctEmailFormat) || (emailConfirm && confirmState);
    /** email 확인 버튼 활성화 */
    $: disableEmailConfirm = !correctEmailFormat || emailConfirm;

    /** */
    const onConfirm = async () => {
        // 중복 이메일 체크 요청
        const checkResponse = await fetch(`${base}/join/email/${email}`, {
            method: 'GET'
        });
        if (!checkResponse.ok) throw new Error(await checkResponse.text());

        // 중복 이메일 조회
        const accounts: CheckEmailTypes = await checkResponse.json();
        const account = accounts[0]
        emailConfirm = true;
        if (account) {
            confirmState = false
            channel = account.channel
        } else {
            confirmState = true
        }
    };

    function mok_popup() {
        // MOBILEOK.process 사용 가능
        const {protocol, host} = document.location;

        window.MOBILEOK.process(`${protocol}//${host}${base}/pass/req?page=01001`, 'WB', 'moResult');

    }

    function moResult(result) {
        console.log(result)
        try {
            result = JSON.parse(result);
            JSON.stringify(result, null, 4);
            console.log(result);
            goto(`${base}/join/profile`, {state: {email, channel: 'email', name: result.name, phone: result.phone}});
        } catch (error) {
            console.log(result)
            result;
        }
    }


    onMount(() => {
        window.moResult = moResult;
    });
    /** 이메일 밸리데이션 관련 상태 변수 */
    let emailErrorMessage = '';

    /** 이메일 입력 필드 포커스 이벤트 처리 */
    const handleEmailFocus = () => {
        emailErrorMessage = '';
    };

    /** 이메일 입력 필드 포커스 아웃 이벤트 처리 */
    const handleEmailBlur = () => {
        // 이메일 밸리데이션 로직을 여기에 추가
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            emailErrorMessage = '이메일을 입력해 주세요.';
        } else if (!emailPattern.test(email)) {
            emailCheck = true;
        }
    };

    /** 이메일 입력 필드 내용 변경 이벤트 처리 */
    const handleEmailInput = () => {
        // 이메일 밸리데이션 로직을 여기에 추가
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            emailErrorMessage = '이메일을 입력해 주세요.';
        } else if (!emailPattern.test(email)) {
            emailCheck = true;
        } else {
            emailErrorMessage = ''; // 유효한 이메일이면 오류 메시지 지우기
            emailCheck = false;
        }
    };

</script>
<div class="app-basic">
    <div class="pc-header">
        <div class="gnb">
            <div class="logo" on:click={() => goto('/account/login')}></div>
        </div>
    </div>
    <header class="app-title-login pc">
        <button type="button" class="btn-prev" on:click={() => goto(`${base}/join/consent`)}/>
        <h1>이메일 확인</h1>
    </header>
    <div class="app-container-login">
        <div class="loginWrap mt-2">
            <form>
                <div class="col">
                    {#if confirmState}
                        <label for="email" class="app-label">이메일</label>
                        <input
                                id="email"
                                type="text"
                                name=""
                                bind:value={email}
                                class={`app-input bg-none ${email ? (correctInput ? 'frm-ok' : 'fail') : ''}`}
                                title="text"
                                placeholder="이메일 주소를 입력해주세요."
                                on:change={() => {
                                    emailConfirm = false;
                                }}
                                on:focus={handleEmailFocus}
                                on:blur={handleEmailBlur}
                                on:input={handleEmailInput}
                                on:keydown={(event) => {
                                    console.log(event.target.value.length)
                                    if(event.target.value.length === 1){
                                        emailCheck = true;
                                    }else{
                                        emailCheck = false
                                    }
                                }}
                        />
                    {/if}
                    {#if emailConfirm}
                        {#if confirmState}
                            <div class="footer mt-4">
<!--                                <button-->
<!--                                        type="button"-->
<!--                                        class="btn-style-big-primary"-->
<!--                                        on:click={() => {mok_popup()}}>본인인증-->
<!--                                </button-->
<!--                                >-->
                                    <button class="btn-style-big-primary" type="button" on:click={()=>{goto(`${base}/join/profile`, { state: { email, channel:'email'} });}}>다음</button>
                            </div>
                        {:else}
                            <div class="col">
                                <p class="infoTxt">동일 이메일로 가입된 계정이 있습니다.<br/>바로 로그인하시겠습니까?</p>
                            </div>
                            <div class="footer mt-4">
                                <a href="/account/login">
                                    <button type="button" class="btn-style-big-primary w-330">로그인</button>
                                </a>
                                <!-- 활성화 클래스 active -->
                                <div class="text-center">
                                    <a href="/account/find/password" class="find-pass">비밀번호 찾기</a>
                                </div>
                            </div>
                        {/if}
                    {:else if correctEmailFormat}
                        <span class="msg-ok">올바른 메일 형식입니다.</span>
                    {:else if email}
                        <span class="msg-fail">올바른 이메일 형식이 아닙니다.</span>
                    {:else if emailCheck}
                        <span class="msg-fail">올바른 이메일 형식이 아닙니다.</span>
                    {/if}
                    {#if emailErrorMessage}
                        <span class="msg-fail">{emailErrorMessage}</span>
                    {/if}
                    {#if confirmState}
                        <button
                                type="button"
                                class={`btn-data-add absolute ${disableEmailConfirm ? 'disabled' : 'active'}`}
                                style="width:8.5rem"
                                disabled={disableEmailConfirm}
                                on:click={onConfirm}>확인
                        </button
                        >
                    {/if}
                </div>
            </form>
        </div>
    </div>
</div>