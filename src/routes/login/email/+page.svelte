<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { deleteCookie, setCookie } from '@/utils/cookie';
	import { goto, afterNavigate } from '$app/navigation';

	import { base } from '$app/paths';
    import {onMount} from "svelte";
    import {env} from "$env/dynamic/public";
    import {setLanding, getLanding, popLanding} from "@/components/landing";
    const { PUBLIC_DOMAIN } = env

    let previousPage: string = base;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    export let data;
    /** email*/
    let {email, target} = data;
    /** password*/
    let password = '';
    /** 아이디 저장*/
    let isSave = !!data.email;
    /** 로그인 버튼 활성화*/
    $: disabled = !email || !password;
    /** id와 비번 불일치할 때*/
    let cannotLogin = false;

    onMount(() => {
        setLanding();
    });
    const cannotPopup = () => (cannotLogin = !cannotLogin);

    const onLogin: SubmitFunction = () => {
        isSave ? setCookie('uemail', email || '', 7) : deleteCookie('uemail');

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					const { data } = result;
					if (data) {
						if (data.status === 500) return;
						const { accessToken, refreshToken } = data;
						const res = await fetch(`/api/proxy/account/v1/session`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								'access_token': accessToken
							})
						})

                        if (res.ok) {
                            const landing = popLanding();
                            await goto(landing);
                        } else {
                            alert("error!!")
                            const msg = await res.json()
                            console.log("error", msg)
                        }
					}
					break;
				case 'error':
					cannotPopup();
					break;
				default:
					break;
			}
		};
	};


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
            emailErrorMessage = '올바른 이메일 형식이 아닙니다.';
        }
    };

    /** 이메일 입력 필드 내용 변경 이벤트 처리 */
    const handleEmailInput = () => {
        // 이메일 밸리데이션 로직을 여기에 추가
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            emailErrorMessage = '이메일을 입력해 주세요.';
        } else if (!emailPattern.test(email)) {
            emailErrorMessage = '올바른 이메일 형식이 아닙니다.';
        } else {
            emailErrorMessage = ''; // 유효한 이메일이면 오류 메시지 지우기
        }
    };


    // 비밀번호

    /** 비밀번호 밸리데이션 관련 상태 변수 */
    let passwordErrorMessage = '';

    /** 비밀번호 입력 필드 포커스 이벤트 처리 */
    const handlePasswordFocus = () => {
        passwordErrorMessage = '';
    };

    /** 비밀번호 입력 필드 포커스 아웃 이벤트 처리 */
    const handlePasswordBlur = () => {
        // 비밀번호 밸리데이션 로직을 여기에 추가
        // 예: 최소 길이는 8자리 이상, 특수문자, 숫자, 대문자, 소문자를 포함해야 함
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password) {
            passwordErrorMessage = '비밀번호를 입력해 주세요.';
        }
    };

    /** 비밀번호 입력 필드 내용 변경 이벤트 처리 */
    const handlePasswordInput = () => {
        // 비밀번호 밸리데이션 로직을 여기에 추가
        // 예: 최소 길이는 8자리 이상, 특수문자, 숫자, 대문자, 소문자를 포함해야 함
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password) {
            passwordErrorMessage = '비밀번호를 입력해 주세요.';
        } else {
            passwordErrorMessage = ''; // 유효한 비밀번호이면 오류 메시지 지우기
        }
    };



    /** 로그인 버튼 활성화 여부 */
    $: disabled = !email || !password || !!emailErrorMessage || !!passwordErrorMessage;


</script>
<div class="app-basic">
    <div class="pc-header">
        <div class="gnb">
            <div class="logo" on:click={() => goto('/account/login')}></div>
            <ul>
<!--                <li><a href="#">개원</a></li>-->
<!--                <li><a href="#">병원</a></li>-->
<!--                <li><a href="#">파트너</a></li>-->
<!--                <li><a href="#">My</a></li>-->
            </ul>
        </div>
    </div>
    <header class="app-title-login pc">
        <button type="button" class="btn-prev" on:click={() => goto(`${base}/login`)}/>
        <h1>로그인</h1>
    </header>
    <div class="app-container-login">
        <div class="loginWrap">
            <h2 class="p-title">이메일 로그인</h2>
            <form use:enhance={onLogin} action="?/login" id="joinfrm" method="POST">
                <input name="channel" type="text" value="email" hidden/>
                <div class="col">
                    <label for="email-text" class="app-label">이메일</label>
                    <input
                            id="email-text"
                            type="text"
                            name="email"
                            bind:value={email}
                            class="app-input bg-none"
                            title="text"
                            placeholder="E-mail"
                            on:focus={handleEmailFocus}
                            on:blur={handleEmailBlur}
                            on:input={handleEmailInput}
                    />
                    {#if emailErrorMessage}
                        <span class="msg-fail">{emailErrorMessage}</span>
                    {/if}
                </div>
                <div class="col ">
                    <label for="password-txt" class="app-label">비밀번호</label>
                    <input
                            id="password-txt"
                            type="password"
                            name="password"
                            bind:value={password}
                            class="app-input bg-none"
                            title="text"
                            placeholder="Password"
                            on:focus={handlePasswordFocus}
                            on:blur={handlePasswordBlur}
                            on:input={handlePasswordInput}
                    />
                    {#if passwordErrorMessage}
                        <span class="msg-fail">{passwordErrorMessage}</span>
                    {/if}
                </div>

                <div class="footer mt-8">
                    <button class="btn-style-big-primary" {disabled}>로그인</button>
                    <ul class="linkList">
                        <li><a href="{`${base}/find/id`}">아이디 찾기</a></li>
                        <li><a href="{`${base}/find/password`}">비밀번호 찾기</a></li>
                        <li><a href="{`${base}/join/consent`}">회원가입</a></li>
                    </ul>
                </div>
            </form>
        </div>
    </div>
</div>
{#if cannotLogin}
    <div id="popup01" class="modal">
        <div class="modal-wrap">
            <div class="modal-container modal-300">
                <button type="button" class="pop-close pop-close-black" on:click={cannotPopup}/>
                <div class="modal-body text-center mt-1">
                    <p>아이디 또는 비밀번호가 일치하지 않습니다</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-solid sy3-4 col-100 pop-close" on:click={cannotPopup}
                    >확인
                    </button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}
