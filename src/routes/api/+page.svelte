<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'

	export let data: PageData
</script>

<h1>{data.item.toUpperCase()}</h1>

<form action="?/changeItem" method="post" use:enhance>
	<input type="text" name="item" />
	<button type="submit" class="btn">Submit</button>
</form>
