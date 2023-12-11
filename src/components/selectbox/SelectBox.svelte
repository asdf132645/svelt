<script lang="ts">
	import type { OptionType } from '../types/selectbox';

	const defaultOption: OptionType[] = [
		{ value: '선택 1', name: '선택 1' },
		{ value: '선택 2', name: '선택 2' },
		{ value: '선택 3', name: '선택 3' }
	];

	export let options: OptionType[] = defaultOption;
	export let value: string = options[0].value;
	export let name: string = '';
	let open = false;
</script>

<div class="select-c border-radius col-auto">
	<button
		class="select-styled"
		on:click={() => {
			open = !open;
		}}
	>
		{options.find((option) => option.value === value)?.name}
	</button>
	<select {value} {name} style="display: none;">
		{#each options as option}
			<option value={option.value}>
				{option.name}
			</option>
		{/each}
	</select>
	<ul class="select-options" style={`display: ${open ? 'block' : 'none'} `}>
		{#each options as option}
			<li
				class={option.value === value ? 'active' : ''}
				on:click={() => {
					value = option.value;
					open = !open;
				}}
				on:keydown
			>
				{option.name}
			</li>
		{/each}
	</ul>
</div>

<style>
	/* 단일선택 셀렉트박스 디자인 */
	.select-c::-ms-expand {
		display: none;
	}
	.select-c {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		cursor: pointer;
		text-align: left;
		position: relative;
		border: 1px solid #dee2e5;
		border-radius: 0.3rem;
		width: 100%;
		display: flex;
		align-items: center;
		height: 3.2rem;
		font-size: 1.2rem;
		color: #858e96;
		padding: 0 1.5rem;
		letter-spacing: -0.5px;
		background: #fff;
	}
	.select-styled:after {
		content: '';
		width: 100%;
		height: 100%;
		background-image: url('/assets/images/ico-select-arrow.png');
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1rem;
		position: absolute;
		top: 0;
		right: 0.5rem;
	}
	button.select-styled {
		margin: 0;
		padding: 0;
		font-family: 'Noto Sans KR', dotum, sans-serif;
		font-size: 1.5rem;
		color: inherit;
		font-weight: inherit;
		letter-spacing: inherit;
		cursor: pointer;
		outline: 0;
		border: 0;
		background-color: transparent;
	}
	.select-styled:active:after,
	.select-styled.active:after {
		background-image: url('/assets/images/ico-select-arrow.png');
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1rem;
	}
	.select-options {
		display: none;
		position: absolute;
		top: 2.8rem;
		left: -1px;
		right: 0;
		z-index: 10;
		margin: 0;
		padding: 0;
		width: calc(100% + 2px);
		list-style: none;
		background: #fff;
		border-radius: 0;
		overflow-y: hidden;
		border: 1px solid #dee2e5;
	}
	.select-options {
		-webkit-text-size-adjust: none;
		-moz-text-size-adjust: none;
		-ms-text-size-adjust: none;
		scrollbar-color: #d9d9d9;
		scrollbar-width: thin;
	}
	.select-options::-webkit-scrollbar {
		width: 0.8rem;
		border-radius: 0.8rem;
	}
	.select-options::-webkit-scrollbar-track {
		background: #fff;
	}
	.select-options::-webkit-scrollbar-thumb {
		background: #d9d9d9;
		border-radius: 100px;
	}
	.select-options::-webkit-scrollbar-thumb:hover {
		background: #ccc;
		-webkit-text-size-adjust: none;
	}

	.select-options li {
		margin: 0 !important;
		padding: 0 1.5rem;
		line-height: 3rem !important;
		-moz-transition: all 0.1s ease-in;
		-o-transition: all 0.1s ease-in;
		-webkit-transition: all 0.1s ease-in;
		transition: all 0.1s ease-in;
		font-size: 1.2rem;
		border-top: 0;
		color: #495057;
		border-bottom: 1px solid #dee2e5;
	}
	.select-options li:last-child {
		border-bottom: 0;
	}
	.select-options li:hover {
		background: #ebf3ff;
	}
</style>
