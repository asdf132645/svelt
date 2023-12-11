<script lang="ts">
    import {enhance, type SubmitFunction} from '$app/forms';
    import {afterNavigate, goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {emailRegEx} from '@/utils/regex';

    let previousPage: string = base;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    let isSend = false;
    let emailNotExistsAlert = '';
    let email = '';
    $: isEmailCorrectForm = emailRegEx.test(email);
    $: emailStyle = email ? (isEmailCorrectForm ? 'frm-ok' : 'frm-fail') : '';

    const toggle = () => (isSend = !isSend);
    const sendEmail: SubmitFunction = () => {
        return async ({result}) => {
            switch (result.type) {
                case 'success':
                    if(result.data.retry === 'true'){
                        alert('이메일을 전송 하였습니다.')
                    } else{
                        toggle();
                    }
                    break;
                case 'failure':
                    emailNotExistsAlert = result.data?.message ?? '';
                default:
                    break;
            }
        };
    };


    let emailErrorMessage = ''; // 이메일 유효성 검사 오류 메시지를 저장할 변수

    /** 이메일 입력 필드 포커스 이벤트 처리 */
    const handleEmailFocus = () => {
        emailErrorMessage = ''; // 포커스가 들어갈 때 오류 메시지를 초기화합니다.
    };

    /** 이메일 입력 필드 포커스 아웃 이벤트 처리 */
    const handleEmailBlur = () => {
        // 이메일 밸리데이션 로직을 여기에 추가합니다.
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            emailErrorMessage = '이메일을 입력해 주세요.'; // 이메일이 비어 있을 때 오류 메시지 설정
        } else if (!emailPattern.test(email)) {
            emailErrorMessage = '올바른 이메일 형식이 아닙니다.'; // 이메일 형식이 잘못된 경우 오류 메시지 설정
        }
    };

    /** 이메일 입력 필드 내용 변경 이벤트 처리 */
    const handleEmailInput = () => {
        // 이메일 밸리데이션 로직을 여기에 추가합니다.
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            emailErrorMessage = '이메일을 입력해 주세요.'; // 이메일이 비어 있을 때 오류 메시지 설정
        } else if (!emailPattern.test(email)) {
            emailErrorMessage = '올바른 이메일 형식이 아닙니다.'; // 이메일 형식이 잘못된 경우 오류 메시지 설정
        } else {
            emailErrorMessage = ''; // 유효한 이메일이면 오류 메시지를 지웁니다.
        }
    };

    $: disabled = !email || !!emailErrorMessage;

    const {protocol, host} = document.location;
    $: host_address = `${protocol}//${host}${base}`
</script>

{#if isSend}
    <div class="app-basic">
        <div class="pc-header">
            <div class="gnb">
                <div class="logo" on:click={() => goto('/account/login')}></div>
            </div>
        </div>
        <header class="app-title-login pc">
            <button type="button" class="btn-prev" on:click={() => goto(`${base}/login/email`)}/>
            <h1>비밀번호 재설정</h1>
        </header>
        <div class="app-container-login">
            <div class="loginWrap">
                <form id="joinfrm2" method="POST" use:enhance={sendEmail}>
                    <input
                            hidden
                            name="retry"
                            value="true"
                    />
                    <input hidden
                           type="hidden"
                           name="host_address"
                           bind:value={host_address}
                    />
                    <input
                            hidden
                            id="email2"
                            type="text"
                            name="email"
                            bind:value={email}
                            class={`app-input bg-none ${emailStyle}`}
                            title="text"
                            placeholder="E-mail"
                            on:focus={handleEmailFocus}
                            on:blur={handleEmailBlur}
                            on:input={handleEmailInput}
                    />

                    <div class="img"><img src="{base}/assets/images/app/ico-app-certification.png" alt=""/></div>
                    <p class="mainTxt email">비밀번호 재설정 메일 발송 완료</p>
                    <p class="subTxt email"><strong>24시간 이내</strong>에 비밀번호를 재설정하시기 바랍니다.</p>
                    <div class="footer mt-4">
                        <button type="submit" class="btn-style-big-primary-none active">메일 다시 보내기</button>
                        <!-- 활성화 클래스 active -->
                        <p class="description">이메일을 받지 못하셨나요?<br/>메일을 받지 못했다면 스팸함을 확인해 주세요.</p>
                    </div>
                </form>
            </div>
        </div>
    </div>
{:else}
    <div class="app-basic">
        <div class="pc-header">
            <div class="gnb">
                <div class="logo" on:click={() => goto('/')}></div>
            </div>
        </div>
        <header class="app-title-login pc">
            <button type="button" class="btn-prev" on:click={() => goto(`${base}/login/email`)}/>
            <h1>비밀번호 재설정</h1>
        </header>
        <div class="app-container-login">
            <div class="loginWrap mt-2">
                <p class="subTxt email">가입한 이메일을  입력하시면<br /> 비밀번호 재설정 링크를 발송해드립니다.</p>
                <form id="joinfrm" method="POST" use:enhance={sendEmail}>
                    <div class="col">
                        <label for="email" class="app-label">아이디(이메일) <span class="required">*</span></label>
                        <input hidden
                               type="hidden"
                               name="host_address"
                               bind:value={host_address}
                        />
                        <input
                                id="email"
                                type="text"
                                name="email"
                                bind:value={email}
                                class={`app-input bg-none ${emailStyle}`}
                                title="text"
                                placeholder="E-mail"
                                on:focus={handleEmailFocus}
                                on:blur={handleEmailBlur}
                                on:input={handleEmailInput}
                        />
                        {#if emailErrorMessage}
                            <span span class="msg-fail">{emailErrorMessage}</span>
                        {/if}
                    </div>
                    <div class="app-btnWrap loginWrap-btnWrap fixed">
                        <button
                                class={`btn-style-big-primary-none w-330 active ${isEmailCorrectForm ? '' : 'disabled'}`}
                                disabled={!isEmailCorrectForm}
                        >
                            메일 발송
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

{#if emailNotExistsAlert}
    <div id="popup01" class="modal">
        <div class="modal-wrap">
            <div class="modal-container modal-300">
                <button type="button" class="pop-close pop-close-black"/>
                <div class="modal-body text-center mt-1">
                    <p>비밀번호를 재설정할 수 있는 계정이 존재하지 않습니다.</p>
                </div>
                <div class="modal-footer">
                    <button
                            type="button"
                            class="btn btn-solid sy3-4 col-100 pop-close"
                            on:click={() => (emailNotExistsAlert = '')}>확인
                    </button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}
