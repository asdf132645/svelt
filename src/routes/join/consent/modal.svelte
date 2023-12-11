<script lang="ts">
	import { SelectBox } from '@/components/selectbox';
	import type { OptionType } from '@/components/types/selectbox';
	import {
		privacyContent,
		privacySelectOption,
		serviceContent,
		serviceSelectOption,
		locationContent,
		locationSelectOption
	} from '@/utils/consent';

	/** 이용약관: 1 / 개인정보처리방침: 2 / 위치기반 서비스 이용약관: 3*/
	export let popupNum: number = 1;
	/** 버튼 클릭시 닫기 | 체크박스 선택하는 함수*/
	export let toggle: (action?: 'close' | 'check') => void;
	/** header name*/
	export let headerName: string = '';

	/** 선택박스 옵션 배열*/
	const optionList: OptionType[][] = [
		[],
		serviceSelectOption,
		privacySelectOption,
		locationSelectOption
	];
	/** 팝업에 표시될 내용 배열*/
	const contentList: string[][] = [[], serviceContent, privacyContent, locationContent];
	let value: string = "1"; // 초기값 설정
</script>

<div class="popup Useragree">
	<div class="app-basic">
		<div class="header">
			<h2>이용약관</h2>
			<button type="button" class="btn-popup-close" on:click={() => toggle('close')}></button>
		</div>
		<div class="app-hdWrap-tab">
			<div class="open-main-mypage pt-2 pb-2">
				<p class="subject-wrap">{headerName}</p>
			</div>
		</div>
		<div class="app-container pt-2">
			<div class="open-main-mypage">
				<pre class="bodyTxt">{@html contentList[popupNum][Number(value) - 1]}</pre>
			</div>
		</div>
	</div>
</div>

<!--<header class="title">-->
<!--	<button type="button" class="btn-prev" on:click={() => toggle('close')} />-->
<!--	<h1>{headerName}</h1>-->
<!--</header>-->
<!--<main class="body mt-3">-->
<!--	<form>-->
<!--		<SelectBox class="app-select box" bind:value options={optionList[popupNum]} />-->
<!--		<p class="txt mt-2 overflow-y">-->
<!--			{contentList[popupNum][Number(value) - 1]}-->
<!--		</p>-->
<!--	</form>-->
<!--</main>-->

<style>

</style>
