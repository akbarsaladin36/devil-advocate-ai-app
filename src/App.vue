<template>
  <div class="flex flex-col min-h-screen bg-[#080808]">

    <!-- Navbar -->
    <nav class="sticky top-0 z-50 flex items-center justify-between px-8 md:px-12 py-4
                bg-[rgba(8,8,8,0.92)] backdrop-blur-xl border-b border-[#151515]">
      <router-link to="/" class="flex items-center gap-3 group">
        <span
          class="text-red font-mono text-lg leading-none select-none group-hover:text-red-bright transition-colors duration-200">☠</span>
        <span
          class="font-display text-lg text-[#e8e8e8] font-bold tracking-tight group-hover:text-white transition-colors duration-200">
          Devil's <em class="italic text-red">Advocate</em>
        </span>
      </router-link>
      <div class="flex items-center gap-6">
        <span class="hidden md:block font-mono text-[0.62rem] text-[#333] tracking-[0.12em] uppercase">
          AI-Powered Decision Auditor
        </span>
        <router-link to="/analyze" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-[#1e1e1e]
                 text-[#555] text-xs font-mono tracking-wider hover:border-red-dim hover:text-red
                 transition-all duration-200 uppercase">
          Test a Decision
        </router-link>
      </div>
    </nav>

    <!-- Main -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="border-t border-[#111] py-8 px-8 md:px-12">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-red font-mono text-sm">☠</span>
          <span class="font-display text-sm text-[#333] italic">Devil's Advocate</span>
        </div>
        <p class="font-mono text-[0.62rem] text-[#2a2a2a] tracking-wider">
          Built to challenge your thinking. Not to comfort it.
        </p>
        <div class="font-mono text-[0.6rem] text-[#222] tracking-widest uppercase">
          Powered by me with Openrouter AI
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
export default { name: 'App' }
</script>
