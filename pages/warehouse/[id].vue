<script lang="ts" setup>

useHead({
      title: `Склад | Соучастники`,
      meta: [{
        name: 'description',
        content: 'My Description'       
      }],
      link: [
          { 
              rel: 'stylesheet', 
              href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
              integrity: "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
              crossorigin: "anonymous",
              type: "text/css"
          }
      ],
      script: [
          {
              src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
              integrity: "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
              crossorigin: "anonymous",
          }
      ]
  })

// const route = useRoute()
</script>

<template>
  <h1>Складсклй item #{{ $route.params.id  }}</h1>
</template>