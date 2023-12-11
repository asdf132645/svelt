<script lang="ts">
	import { onMount } from 'svelte';
	export let countDown = 180;
	export let interval = 1000;

	const getSecond = () => {
		const remainSecond = countDown % 60;
		return remainSecond > 9 ? remainSecond : `0${remainSecond}`;
	};

	$: remainCount = `${~~(countDown / 60)}:${getSecond()}`;

	onMount(() => {
		const timer = setInterval(() => {
			countDown > 0 ? (countDown -= 1) : clearInterval(timer);
		}, interval);
		return () => clearInterval(timer);
	});
</script>

{remainCount}
