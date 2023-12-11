<script lang="ts">
    import {enhance, type SubmitFunction} from '$app/forms';
    import {afterNavigate, goto} from '$app/navigation';
    import {passwordRegEx} from '@/utils/regex';
    import {base} from '$app/paths';

    export let data: PageData;

    let {identity, csrf, err} = data;

    let previousPage: string = base;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    let isChanged = false;
    let password = '';
    let passwordConfirm = '';

    let errorMessage = '';
    let errorMessageConfirm = '';

    /** 비밀번호를 8자 이상 영문, 숫자, 특수기호를 혼합하여 입력해 주세요.*/
    $: isPwCorrectForm = passwordRegEx.test(password);
    $: pwCorrectStyle = password ? (isPwCorrectForm ? 'frm-ok' : 'frm-fail') : '';

    /** 동일한 비밀번호를 입력해 주세요.*/
    $: isPwSame = password === passwordConfirm;
    $: pwConfirmStyle = passwordConfirm ? (isPwSame ? 'frm-ok' : 'frm-fail') : '';

    const onSubmitNewPW: SubmitFunction = () => {
        return async ({result}) => {
            switch (result.type) {
                case 'success':
                    isChanged = true;
                    break;
                default:
                    break;
            }
        };
    };
</script>

{#if isChanged && !err}
    <div class="app-basic">
        <div class="pc-header">
            <div class="gnb">
                <div class="logo" on:click={() => goto('/')}></div>
            </div>
        </div>
        <header class="app-title-login pc">
            <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
            <h1>비밀번호 재설정</h1>
        </header>
        <div class="app-container-login">
            <div class="loginWrap">
                <div class="img"><img src="{base}/assets/images/app/ico-app-pass.png" alt="" /></div>
                <form>
                    <p class="subTxt email">비밀번호가 안전하게 변경되었습니다.<br />지금 로그인하셔서 서비스를 이용해 보세요.</p>
                    <div class="app-btnWrap loginWrap-btnWrap fixed">
                        <button type="button" class="btn-style-big-primary w-330" on:click={() => goto(`${base}/login`)}>로그인</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}
{#if !isChanged && !err}
    <div class="app-basic">
        <div class="pc-header">
            <div class="gnb">
                <div class="logo" on:click={() => goto('/')}></div>
            </div>
        </div>
        <header class="app-title-login pc">
            <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
            <h1>비밀번호 재설정</h1>
        </header>
        <div class="app-container-login">
            <div class="loginWrap mt-2">
                <p class="subTxt email">회원님의 비밀번호를 다시 설정해 주세요.</p>
                <form class="mt-4" name="" id="joinfrm" method="POST" use:enhance={onSubmitNewPW}>
                    <input hidden
                           type="hidden"
                           name="identity"
                           bind:value={identity}
                    />
                    <input hidden
                           type="hidden"
                           name="csrf"
                           bind:value={csrf}

                    />
                    <div class="col">
                        <label class="app-label">새 비밀번호 <span class="required">*</span></label>
                        <input
                                type="password"
                                name="passwordNew"
                                bind:value={password}
                                class={`app-input bg-none ${pwCorrectStyle}`}
                                title="text"
                                placeholder="비밀번호를 입력해 주세요."

                                on:keydown={()=>{
                                    if(password && !isPwCorrectForm){
                                        errorMessage = "8자 이상 영문, 숫자, 특수기호를 혼합하여 입력해 주세요.";
                                    }else if(password === ''){
                                        errorMessage = "비밀번호를 입력해주세요.";
                                    }else{
                                        errorMessage = "";
                                    }
                                }}
                                on:focus={() => {
                                    if(password && !isPwCorrectForm){
                                        errorMessage = "8자 이상 영문, 숫자, 특수기호를 혼합하여 입력해 주세요.";
                                    }else if(password === ''){
                                        errorMessage = "비밀번호를 입력해주세요.";
                                    }else{
                                        errorMessage = "";
                                    }
                                }}
                                on:blur={() => {
                                    if (password && !isPwCorrectForm) {
                                        errorMessage = "8자 이상 영문, 숫자, 특수기호를 혼합하여 입력해 주세요.";
                                    } else if(password === ''){
                                        errorMessage = "비밀번호를 입력해주세요.";
                                    }
                                    else {
                                        // 밸리데이션 통과 시 에러 메시지 제거
                                        errorMessage = "";
                                    }
                                }}
                        />

                        {#if errorMessage}
                            <span class="msg-normal">{errorMessage}</span>
<!--                            <button type="button" class="btn-important"></button>-->
                        {/if}

                    </div>
                    <div class="col">
                        <label for="" class="app-label">비밀번호 확인 <span class="required">*</span></label>
                        <input
                                type="password"
                                name=""
                                bind:value={passwordConfirm}
                                class={`app-input bg-none ${pwConfirmStyle}`}
                                title="text"
                                placeholder="비밀번호를 한번 더 입력해 주세요."
                                on:keydown={()=>{
                                    if(passwordConfirm && !isPwSame){
                                        errorMessageConfirm = "동일한 비밀번호를 입력해 주세요.";
                                    }else if(passwordConfirm === ''){
                                        errorMessageConfirm = "비밀번호를 입력해주세요.";
                                    }else{
                                        errorMessageConfirm = "";
                                    }
                                }}
                                on:focus={() => {
                                    if(passwordConfirm && !isPwSame){
                                        errorMessageConfirm = "동일한 비밀번호를 입력해 주세요.";
                                    }else if(passwordConfirm === ''){
                                        errorMessageConfirm = "비밀번호를 입력해주세요.";
                                    }else{
                                        errorMessageConfirm = "";
                                    }
                                }}
                                on:blur={() => {
                                    if(passwordConfirm && !isPwSame){
                                        errorMessageConfirm = "동일한 비밀번호를 입력해 주세요.";
                                    }else if(passwordConfirm === ''){
                                        errorMessageConfirm = "비밀번호를 입력해주세요.";
                                    }else{
                                        errorMessageConfirm = "";
                                    }
                                }}
                        />

                        {#if errorMessageConfirm}
                            <span class="msg-normal">{errorMessageConfirm}</span>
<!--                            <button type="button" class="btn-important"></button>-->
                        {/if}
                    </div>
                    <div class="app-btnWrap loginWrap-btnWrap fixed">
                        <button class="btn-style-big-primary-none w-330 active" disabled={!isPwCorrectForm || !isPwSame}>변경하기
                        </button><!-- 활성화 클래스 active -->
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

{#if err}
    <div class="app-basic">
        <div class="pc-header">
            <div class="gnb">
                <div class="logo" on:click={() => goto('/account/login')}></div>
            </div>
        </div>
        <header class="app-title-login pc">
            <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
            <h1>비밀번호 재설정</h1>
        </header>
        <div class="app-container-login">
            <div class="loginWrap mt-2">
                <div class="img"><img src="{base}/assets/images/app/ico-app-pass.png" alt="" /></div>
                <form>
                    <p class="subTxt email">이미 사용한 인증 토큰입니다.<br />비밀번호 변경신청을 다시 해주세요.</p>
                    <div class="app-btnWrap loginWrap-btnWrap fixed">
                        <button type="button" class="btn-style-big-primary" on:click={() => goto(`${base}/find/password`)}>비밀번호 찾기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}