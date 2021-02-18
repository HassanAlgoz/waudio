<template>
  <main class="notfound404">
    <nav class="container">
      <h1>Page Not Found - 404</h1>
    </nav>
    <article class="container">
      <p>
        No page at: <code>{{ $route.fullPath }}</code>
      </p>
      <p>
        Go to <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
      </p>
    </article>
  </main>
</template>

<script>
export default {
  name: "NotFound404",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
