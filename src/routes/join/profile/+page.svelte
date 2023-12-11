<script lang="ts">
    import {enhance, type SubmitFunction} from '$app/forms';
    import {afterNavigate, goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {onDestroy, onMount} from 'svelte';
    import type {PageData} from './$types';
    import {consentCheck, type ConSentList, responseStore} from '@/components/joinStore';
    import {passwordRegEx, phoneRegEx} from '@/utils/regex';

    let previousPage: string = base;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    export let data: PageData;
    const { subscribe, set, update } = consentCheck;

    let checkBefore: ConSentList;
    let agreementObj = {};
    const unsubscribe = consentCheck.subscribe((item) => {
        console.log(item)
        agreementObj = item.agreement;
        checkBefore = item;
    });



    const {protocol, host} = document.location;
    // 스토어를 구독하여 데이터 가져오기
    $: responseData = $responseStore;
    let {email, channel, name, phone, identity, credential} = data;
    let emailAvailable = false;
    let userName = name ?? '';
    let userNameAva = false;
    let phoneNumber = phone ?? '';
    let phoneNumberAva = false;
    let password = '';
    let passwordConfirm = '';

    let userEmail = email ?? '';
    let phoneNumCheck =  !!(phoneNumber !== '' && phoneNumber);
    let emaileChecked = false;

    /** 숫자만 입력해 주세요*/
    $: isPhoneNumber = phoneRegEx.test(phoneNumber);

    /** 비밀번호를 8자 이상 영문, 숫자, 특수기호를 혼합하여 입력해 주세요.*/
    $: isPwCorrectForm = passwordRegEx.test(password);
    /** 동일한 비밀번호를 입력해 주세요.*/
    $: isPwSame = passwordConfirm && password === passwordConfirm;
    /** 가입하기 버튼 활성화여부 */
    // $: disableJoin = sessionStorage.getItem('channel')
    //     ? !userEmail || !userName || !phoneNumber || !isPwCorrectForm || !isPwSame || !phoneNumCheck || !emaileChecked
    //     : !userEmail ||
    //     !userName ||
    //     !phoneNumber ||
    //     !phoneNumCheck ||
    //     !emaileChecked
    // ;

    $: disableJoin = sessionStorage.getItem('channel')
        ? !userEmail || !userName || !phoneNumber || !isPwCorrectForm || !isPwSame || !phoneNumCheck || !emaileChecked
        : !userEmail || !userName || !phoneNumber || !phoneNumCheck || !emaileChecked


    $: email_verified = !!email && channel != 'email'
    $: host_address = `${protocol}//${host}${base}/join/integration`

    const onJoin: SubmitFunction = ({cancel}) => {
        if (disableJoin) return cancel();
        return async ({result}) => {
            console.log(result)
            switch (result.type) {
                case 'success':
                    if (email_verified === true) {
                        await goto(`${base}/join/integration`, {state: result.data});
                    } else {
                        await goto(`${base}/join/verify`, {state: result.data});
                    }
                    break;
                default:
                    break;
            }
        };
    };

    onMount(() => {
        console.log(agreementObj)
        userName = history.state.name !== '' && history.state.name ? history.state.name : userName;
        phoneNumber = history.state.phone !== '' && history.state.phone ? history.state.phone : phoneNumber;
        email = history.state.email;
        emailAvailable = !!history.state.email;
        userNameAva = !!history.state.name;
        phoneNumberAva = !!history.state.phone;
        channel = history.state.channel ?? '';
        userEmail = history.state.email;
        emaileChecked = !!history.state.email;
        // if (channel !== 'email') {
        //     alert('접근할 수 없습니다.');
        //     goto(`${base}/join/email`);
        // }
    });

    // onDestroy(unsubscribe);

    let isUserNameValid = true; // Initialize to true initially

    function validateUserName() {
        // Implement your validation logic here
        if (userName === '') {
            isUserNameValid = false;
        } else {
            isUserNameValid = true;
        }
    }

    function mok_popup() {
        // MOBILEOK.process 사용 가능
        const { protocol, host } = document.location;

        window.MOBILEOK.process(`${protocol}//${host}${base}/pass/req?page=01005`, 'WB', 'moResult');

        // const result = {
        //     phone: '0102701',
        //     name: '강강'
        // }
        // moResult(JSON.stringify(result))
    }

    let cert = '';

    function moResult(result) {
        console.log(result)
        try {
            result = JSON.parse(result);
            JSON.stringify(result, null, 4);
            console.log(result);
            phoneNumCheck = true;
            phoneNumber = result.phone;
            userName = result.name;
            cert = '인증 되었습니다.';
            isUserNameValid = true; // 이름 밸리데이션 이상하게 들어가는 부분
            // goto(`${base}/join/profile`, { state: { email, channel:'email', name: result.name, phone: result.phone } });
        } catch (error) {
            phoneNumCheck = false;
            cert = '인증이 실패 되었습니다. 재인증 해주세요.';
            result;
        }
    }

    onMount(() => {
        window.moResult = moResult;
    });

    /** 이메일 밸리데이션 관련 상태 변수 */
    let emailErrorMessage = '';

    const handleEmailFocus = () => {
        emailErrorMessage = '';
    };

    /** 이메일 입력 필드 포커스 아웃 이벤트 처리 */
    const handleEmailBlur = () => {
        // 이메일 밸리데이션 로직을 여기에 추가
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!userEmail) {
            emailErrorMessage = '이메일을 입력해 주세요.';
            emaileChecked = false;
        } else if (!emailPattern.test(userEmail)) {
            emailErrorMessage = '올바른 이메일 형식이 아닙니다.';
            emaileChecked = false;
        }
    };

    /** 이메일 입력 필드 내용 변경 이벤트 처리 */
    const handleEmailInput = () => {
        // 이메일 밸리데이션 로직을 여기에 추가
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!userEmail) {
            emailErrorMessage = '이메일을 입력해 주세요.';
            emaileChecked = false;
        } else if (!emailPattern.test(userEmail)) {
            emailErrorMessage = '올바른 이메일 형식이 아닙니다.';
            emaileChecked = false;
        } else {
            emailErrorMessage = ''; // 유효한 이메일이면 오류 메시지 지우기
            emaileChecked = true;
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
        <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
        <h1>회원정보 입력</h1>
    </header>
    <div class="app-container-login">
        <div class="loginWrap mt-2">
            <form name="" id="join-form" action="?/createAccount" method="POST" use:enhance={onJoin}>
                <div class="col">
                    <input name="channel" value={channel} hidden/>
                    <input name="email_verified" value={email_verified} hidden/>
                    <input name="host_address" value={host_address} hidden/>
                    <input name="identity" value={identity} hidden/>
                    <input name="credential" value={credential} hidden/>
                    <input name="agreementObj" value={JSON.stringify(agreementObj)} hidden/>
                    <label for="" class="app-label">이메일</label>
                    <input
                            type="text"
                            name="email"
                            bind:value={userEmail}
                            required
                            class={`app-input bg-none ${email && emailAvailable ? 'readonly' : ''}`}
                            title="text"
                            placeholder="이메일 주소를 입력해 주세요."
                            readonly={email && emailAvailable}
                            on:focus={handleEmailFocus}
                            on:blur={handleEmailBlur}
                            on:input={handleEmailInput}
                    />
                    {#if emailErrorMessage}
                        <span class="msg-fail">{emailErrorMessage}</span>
                    {/if}
                </div>
                <div class="col">
                    <label for="" class="app-label">이름 <span class="required">*</span></label>
                    <input
                            type="text"
                            name="username"
                            bind:value={userName}
                            required
                            class={`app-input bg-none ${userName && userNameAva ? 'readonly' : ''}`}

                            on:blur={validateUserName}
                            title="text"
                            placeholder="이름을 입력해 주세요."
                            readonly={phoneNumCheck || (userName && userNameAva)}
                    />
                    {#if !isUserNameValid}
                        <span class="msg-fail">이름을 입력하세요.</span>
                    {/if}
                </div>
                <div class="col">
                    <label for="" class="app-label">휴대전화번호 <span class="required">*</span></label>
                    <div class="d-flex align-items-center">
                        <!--readonly={phoneNumber && phoneNumberAva}-->
                        <input
                                type="text"
                                name="phone"
                                bind:value={phoneNumber}
                                class={`app-input bg-none ${phoneNumber && phoneNumberAva ? 'readonly' : ''}`}
                                title="text"
                                placeholder="인증 해주세요."
                                on:click={() => {mok_popup()}}
                                readonly={true}
                        />

                        <!--{#if phoneNumber && sessionStorage.getItem('channel')}-->
                        <!--    <span class="certification-msg">인증완료</span>-->
                        <!--{/if}-->
                        {#if !phoneNumCheck}
                            <button
                                    type="button"
                                    class={`btn btn-solid sy4-4 ml-1`}
                                    on:click={() => {mok_popup()}}
                            >인증하기
                            </button
                            >
                        {/if}
                        {#if phoneNumCheck}
                            <span class="certification-msg">인증완료</span>
                        {/if}

                    </div>
                    {#if cert !== ''}
                        <span class="msg-ok">{ cert }</span>
                    {/if}
                </div>
                {#if channel === 'email'}
                    <div class="col">
                        <label for="" class="app-label">비밀번호 <span class="required">*</span></label>
                        <input
                                type="password"
                                name="password"
                                bind:value={password}
                                class={`app-input bg-none ${passwordRegEx.test(password) ? 'frm-ok' : ''}`}
                                title="text"
                                placeholder="비밀번호를 8자 이상 영문, 숫자, 특수기호를 혼합하여 입력해 주세요."
                        />
                        {#if password && !isPwCorrectForm}
					<span class="msg-normal"
                    >비밀번호를 8자 이상 영문, 숫자, 특수기호를 혼합하여 입력해 주세요.</span
                    >
                        {/if}
                    </div>
                    <div class="col">
                        <label for="" class="app-label">비밀번호 확인 <span class="required">*</span></label>
                        <input
                                type="password"
                                name=""
                                bind:value={passwordConfirm}
                                id=""
                                required
                                class={`app-input bg-none ${isPwSame ? 'frm-ok' : ''}`}
                                title="text"
                                placeholder="비밀번호를 한번 더 입력해 주세요."
                        />
                        {#if passwordConfirm && !isPwSame}
                            <span class="msg-normal">동일한 비밀번호를 입력해 주세요.</span>
                        {/if}
                    </div>
                {/if}
                <div class="app-btnWrap mt-8">
                    <!--{ JSON.stringify( !emaileChecked) }-->
                    <button
                            class={`btn-style-big-primary-none w-330 ${disableJoin ? 'disabled' : 'active'}`}
                            disabled={disableJoin}>가입하기
                    </button
                    >

                </div>
            </form>
        </div>
    </div>
</div>