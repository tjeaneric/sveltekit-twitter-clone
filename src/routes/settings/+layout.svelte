<script lang="ts">
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<div class="submenu">
	{#each data.sections as section}
		<a href="/settings/{section.slug}" style="padding: 10px;">{section.title}</a>
	{/each}
</div>

<slot />
