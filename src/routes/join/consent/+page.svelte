<script lang="ts">
    import {afterNavigate, goto} from '$app/navigation';
    import {consentCheck} from '@/components/joinStore';
    import {base} from '$app/paths';
    import type {CheckBoxElementType} from '@/components/types/check';
    import {checkboxes} from '@/utils/consent';
    import Modal from './modal.svelte';
    import type {PageData} from './$types';

    let previousPage: string = base;
    export let data: PageData;

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });
    let selected: CheckBoxElementType[] = [];
    const {subscribe, set, update} = consentCheck;

    /** 전체 check박스 체크*/
    $: allChecked = checkboxes.length === selected.length;

    $: selecteds = (
        selected.find(checkbox => checkbox.val === 'event')
    );
    /** 다음 버튼 활성화 여부 */
    $: disabled = !(
        checkboxes.filter(({required}) => required).length ===
        selected.filter(({required}) => required).length
    );
    /** 체크박스 전체 선택*/
    const toggleAll = () => {
        selected = allChecked ? [] : [...checkboxes];
        if (allChecked) {
            for (const idx in checkboxes2) {
                checkboxes2[idx].checked = false;
            }
            isEventCheckbox = false; // 이벤트 체크박스 해제됨
        } else {
            for (const idx in checkboxes2) {
                checkboxes2[idx].checked = true;
            }
            isEventCheckbox = true; // 이벤트 체크박스 선택됨
        }
    };


    /**
     * popup state
     */
    let showModal = false;
    /** 전문보기 선택*/
    let popupNum: number = 1;
    /** 일반 닫기와, 동의 후 닫기로 분리*/
    const toggle = (input?: 'check' | 'close') => {
        input === 'check' && (selected = [...selected, checkboxes[popupNum - 1]]);
        showModal = !showModal;
    };
    /** 보여줄 팝업페이지 선택 후 popup 토글*/
    const popupToggle = (num = 0) => {
        popupNum = num;
        showModal = !showModal;
    };

    /** 약관동의 체크 정보 store에 저장 후 가입하기 페이지로 이동*/
    const onJoin = async () => {
        const [, , {val: val}] = checkboxes;
        const eventConsent = selected.some(({label, val}) => label === val);


        const checkedCount = checkboxes2.filter(checkbox => checkbox.checked).length;
        const consents = checkedCount === 3 ? ['push' , 'email', 'talk'] : checkboxes2.filter(checkbox => checkbox.checked).map(checkbox => checkbox.id);


        // agreement 객체 생성
        const agreement = {
            terms: checkboxes.filter(checkbox => selected.some(selectedCheckbox => selectedCheckbox.val === checkbox.val && checkbox.val !== 'event')).map(checkbox => checkbox.val),
            consents: consents,
        };

        console.log(agreement)

        // agreement 객체를 스벨트 스토어에 저장합니다.
        consentCheck.set({
            eventConsent,
            agreement
        });

        // cookie에서 가입 channel 가져오기
        const {channel, email} = data;
        channel ? goto(`${base}/join/profile`, {state: {channel, email}}) : goto(`${base}/join/email`);
    };


    let checkboxes2 = [
        {id: 'push', label: 'Push', checked: false},
        {id: 'email', label: '이메일', checked: false},
        {id: 'talk', label: '알림톡', checked: false}
    ];

    const toggleCheckbox2 = (index: number, checked) => {
        checkboxes2[index].checked = !checked;
        checkboxes2 = [...checkboxes2];
        console.log(checkboxes2);
        const checkedCount = checkboxes2.filter(checkbox => checkbox.checked).length;
        if (checkedCount === 3) {
            console.log(selected)
            selected = [...selected, checkboxes[checkboxes.length - 1]];
        }
    };


    let eventChecked = false;

    const toggleEventCheckboxGroup = () => {
        eventChecked = !eventChecked;
    };

    let isEventCheckbox = false;

    const popupTestBtn = () => {
        const url = 'http://www.google.co.kr/'
        const windowName = 'popuptest';
        const windowFeatures = 'width=500,height=500';


        const newWindow = window.open(url, windowName, windowFeatures);

        if (newWindow === null || typeof newWindow === 'undefined') {
            alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        } else {
            newWindow.focus(); // 새 창을 포커스합니다.
        }

    }

</script>
<div class="app-basic">
    <div class="pc-header">
        <div class="gnb">
            <div class="logo" on:click={() => goto('/account/login')}></div>
        </div>
    </div>
    <header class="app-title-login pc">
        <button type="button" class="btn-prev" on:click={() => goto(`${base}/login/email`)}/>
        <h1>약관동의</h1>
    </header>
    <div class="app-container-login">
        <div class="loginWrap mt-2">
            <form>
                <div class="agreeWrap">
                    <div class="totalChk">
                        <div class="chk-checkbox-round">
                            <input type="checkbox" checked={allChecked} id="allChk" on:click={toggleAll}/>
                            <label for="allChk"
                            ><span/><strong class="font-15 tc-black">전체동의</strong> (선택 동의항목 포함)</label
                            >
                        </div>
                    </div>
                    <div class="mt-2">
                        {#each checkboxes as checkbox, idx}
                            <div class={`chk-checkbox-round ${idx === 0 ? '' : 'mt-012'}`}
                            >
                                <input
                                        type="checkbox"
                                        id={checkbox.val}
                                        bind:group={selected}
                                        value={checkbox}
                                        on:click={(e) => {
                                            if(e.currentTarget.__value.val=== 'event'){
                                                if(selecteds){
                                                    for (const idx in checkboxes2) {
                                                        checkboxes2[idx].checked = false;
                                                    }
                                                }else{
                                                    for (const idx in checkboxes2) {
                                                            checkboxes2[idx].checked = true;
                                                        }
                                                }
                                            }}
                                        }
                                />
                                <label for={checkbox.val}>
                                    <span></span>
                                    {checkbox.label}
                                </label>
                                {#if checkbox.popup}
                                    <button
                                            type="button"
                                            class="btn-agree-arrow ml-auto"
                                            data-modal={checkbox.popup}
                                            on:click={() => popupToggle(checkbox.popup)}
                                    />
                                {/if}
                            </div>
                        {/each}


                        <!--{ JSON.stringify(isEventCheckbox) }-->
                        {#if !selecteds}
                            <div class="chkWrap">
                                {#each checkboxes2 as checkbox, index (checkbox.id)}
                                    <div
                                            class="chk-checkbox-round"
                                            tabindex="0"
                                            role="checkbox"
                                            aria-checked={checkbox.val}
                                    >
                                        <input type="checkbox" id={checkbox.id} on:change={() => {
                                                toggleCheckbox2(index, checkbox.checked);
                                            }}/>
                                        <label for={checkbox.id}><span></span> {checkbox.label}</label>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>

                    <div class="app-btnWrap fixed mt-8">
                        <button type="button" class="btn-style-big-primary-none w-330 active" {disabled}
                                on:click={onJoin}
                        >다음
                        </button>
                        <!--                            <button type="button" class="btn-style-big-primary-none active"-->
                        <!--                                    on:click={popupTestBtn}-->
                        <!--                            >팝업테스트버튼-->
                        <!--                            </button>-->
                        <!-- 활성화 클래스 active -->
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

{#if showModal}
    <Modal
            {popupNum}
            {toggle}
            headerName={checkboxes.find(({ popup }) => popup === popupNum)?.label}
    />
{/if}

<style>

</style>