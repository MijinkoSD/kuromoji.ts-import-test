<script setup lang="ts">
import "~/assets/main.scss";
const router = useRouter();

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const nav = [
  { label: "Home", to: "/" },
  { label: "Browser", to: "/clientKuromoji" },
  { label: "Node.js", to: "/serverKuromoji" },
];
</script>

<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <header>
      <div class="menu">
        <NuxtLink v-for="link in nav" :key="link.to" :to="link.to">
          {{ link.label }}
        </NuxtLink>
        <ClientOnly>
          <UButton
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </ClientOnly>
      </div>
    </header>
    <NuxtPage />
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  gap: 1em;
}
</style>
