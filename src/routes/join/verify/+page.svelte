<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	export let data: PageData;

	let channel = data.channel ?? 'email';
	let email: string;
	let identity: string;
	let username: string;
	onMount(() => {
		email = history.state.email
		channel = history.state.channel
		identity = history.state.identity
		username = history.state.name
	});

	const resendEmail = () => {
		fetch(`${base}/join/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, channel, identity, username })
		})
				.then((response) => {
					if (response.ok) {
						// 성공적으로 요청이 완료될 때
						alert('인증이메일을 전송 하였습니다.');
					} else {
						// 요청이 실패하면 오류 처리
						throw new Error('이메일 다시 보내기에 실패했습니다.');
					}
				})
				.catch((error) => {
					// 오류 처리
					console.error('오류:', error);
				});
	};
</script>

<div class="app-basic">
	<div class="pc-header">
		<div class="gnb">
			<div class="logo" on:click={() => goto('/account/login')}></div>
		</div>
	</div>
	<header class="app-title-login pc">
		<button type="button" class="btn-prev" on:click={() => goto(`${base}/login`)} />
		<h1>이메일 인증</h1>
	</header>
	<div class="app-container-login">
		<div class="loginWrap">
			<div class="img"><img src="{base}/assets/images/app/ico-app-certification.png" alt="" /></div>
			<p class="mainTxt email">이메일 주소를 인증해 주세요.</p>
			<p class="subTxt email">이메일 인증을 위한 메일이 발송되었습니다.<br />회원가입 완료를 위한 이메일 인증을 진행해 주세요.</p>
			<p class="emailAddress">{email}</p>
			<div class="footer mt-6 w-330 m-auto">
				<button type="button" class="btn-style-big-primary-none w-330 active" on:click={resendEmail}>이메일 다시 보내기</button><!-- 활성화 클래스 active -->
				<p class="description text-left">이메일을 받지 못하셨나요?<br />메일을 받지 못했다면 스팸함을 확인해 주세요.</p>
			</div>
		</div>
	</div>
</div>
