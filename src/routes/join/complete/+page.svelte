<script lang="ts">
    import {afterNavigate, goto} from '$app/navigation';
    import {base} from '$app/paths';
	import {onMount} from "svelte";
	import {accessToken} from "@/store/WritableStore";
	import {env} from "$env/dynamic/public";
	import {getLanding, popLanding} from "@/components/landing";
	const { PUBLIC_DOMAIN: host_domain, } = env;

	// export let data;
	let previousPage: string = base;
	let accessTokenTest = '';

	accessToken.subscribe((data) => {
		accessTokenTest = data;
	})

	onMount(async ()  =>  {
		const token = await fetch(`${base}/join/complete`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				'identity': history.state.identity,
				'channel': history.state.channel,
			})
		})

		if (!token.ok) {
			const msg = await token.json()
			throw error(token.status, msg.message)
		}

		const {accessToken} = await token.json()

		const res = await fetch(`/api/proxy/account/v1/session`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				'access_token': accessToken
			})
		})

		if (!res.ok) {
			const msg = await res.json()
			throw error(token.status, msg.message)
		}

		const landing = popLanding()
		if (landing != host_domain && landing.includes('?t=')) {
			await goto(landing)
		}
	});

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });


</script>
<div class="app-basic">
	<div class="pc-header">
		<div class="gnb">
			<div class="logo" on:click={() => goto('/account/login')}></div>
		</div>
	</div>
    <header class="app-title-login pc">
        <button type="button" class="btn-prev" on:click={() => goto(previousPage)}/>
        <h1>회원가입 완료</h1>
    </header>
	<div class="app-container-login pc-complete">
		<div class="loginWrap-complete">
			<div class="img"><img src="{base}/assets/images/app/img-join-complete.svg" alt="" /></div>
			<div class="shadowBox">
				<p class="subTxt">현재 회원님은 <span>일반회원</span>입니다</p>
			</div>
			<p class="basicTxt">
				일반회원은 서비스 이용이 일부 제한되며, 의사와 병원장으로 역할을 신청할 수 있습니다.<span class="device-pc"></span>또는 직원, 실무자로 초대 후 이용할 수 있습니다.
			</p>
			<p class="s-tit">어느 사용자 역할을 신청하시겠습니까?</p>
			<ul class="jobs">
				<li class="btn-sel-doctor" on:click={() => goto(`${host_domain}/myPage/doctorDetail`)}><span></span>의사</li>
				<li class="btn-sel-owner" on:click={() => goto(`${host_domain}/myPage/directorDetail`)}><span></span>병원장</li>
			</ul>
			<p class="s-txt">
				*사용자 역할은 나중에 마이페이지에서 언제든지 신청할 수 있습니다.
			</p>
			<div class="app-btnWrap loginWrap-btnWrap fixed mt-8">
				<button type="button" on:click={() => goto(`${host_domain}`)} class="btn-style-big-primary w-330">일반회원으로 이용할래요</button>
			</div>
        </div>
    </div>
</div>
