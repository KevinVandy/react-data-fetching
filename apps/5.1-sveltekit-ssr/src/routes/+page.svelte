<script lang="ts">
  import { Alert, Card } from 'flowbite-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const { posts, error } = data;
</script>

<div class="p-8">
  <h2 class="text-2xl font-bold mb-4">Your Home Feed</h2>
  <div class="flex flex-wrap gap-4">
    {#if error}
      <Alert color="red">
        <span class="font-medium">Bummer!</span>
        There was an error fetching posts
      </Alert>
    {:else}
      {#each posts as post (post.id)}
        <a href="/posts/{post.id}" class="no-underline">
          <Card class="w-72 h-80 cursor-pointer">
            <h3 class="text-xl font-bold mb-2">{post.title}</h3>
            <p class="mb-4">{post.body}</p>
            <p class="text-blue-600 mt-auto">Go to post</p>
          </Card>
        </a>
      {/each}
    {/if}
  </div>
</div>