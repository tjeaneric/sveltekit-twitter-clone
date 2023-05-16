<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div>
	{#each data.sections as section}
		<a href="/profile/{section.slug}" style="padding: 10px;">{section.title}</a>
	{/each}
</div>
