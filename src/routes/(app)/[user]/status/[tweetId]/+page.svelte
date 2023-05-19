<script lang="ts">
	import Tweet from '$root/components/tweet.svelte'
	import type { TweetType } from '$root/types'
	import type { PageData } from './$types'

	export let data: PageData

	export let tweet: TweetType = data.userTweet

	const name = tweet.name
	const content = tweet.content.slice(0, 60)
</script>

<svelte:head>
	<title>{name} on Twittr: "{content}..."</title>
</svelte:head>

<Tweet {tweet} />
