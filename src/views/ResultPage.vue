<template>
  <div class="min-h-screen bg-[#080808]">

    <!-- No result guard -->
    <div v-if="!result" class="flex flex-col items-center justify-center min-h-screen gap-6 text-[#333]">
      <span class="font-display text-6xl text-[#151515]">☠</span>
      <p class="font-mono text-sm tracking-wider">No analysis found.</p>
      <router-link to="/analyze" class="btn-primary">Start an Audit →</router-link>
    </div>

    <template v-else>

      <!-- ─── TOP BAR ─── -->
      <div class="border-b border-[#111] px-8 md:px-12 py-4 flex items-center justify-between gap-4 flex-wrap">
        <router-link to="/analyze"
          class="inline-flex items-center gap-2 font-mono text-[0.62rem] text-[#2a2a2a]
                 tracking-widest uppercase hover:text-[#555] transition-colors no-underline">
          ← New Audit
        </router-link>
        <div class="flex items-center gap-4">
          <span class="font-mono text-[0.62rem] text-[#1e1e1e] tracking-wider">{{ form.category }}</span>
          <span class="text-[#1a1a1a] font-mono">·</span>
          <span class="font-mono text-[0.62rem] text-[#1e1e1e] tracking-wider">{{ currentDate }}</span>
        </div>
        <button @click="shareResult"
          class="inline-flex items-center gap-2 font-mono text-[0.62rem] text-[#2a2a2a]
                 tracking-widest uppercase hover:text-[#555] transition-colors bg-transparent border-0 cursor-pointer">
          {{ copied ? '✓ Copied' : '⬡ Share' }}
        </button>
      </div>

      <div class="max-w-4xl mx-auto px-6 md:px-12 py-12 pb-28">

        <!-- ─── VERDICT HERO ─── -->
        <div class="relative overflow-hidden border mb-16 p-8 md:p-10"
             :class="verdictBorderClass">
          <!-- bg glow -->
          <div class="absolute inset-0 opacity-[0.04]" :class="verdictBgClass"></div>
          <!-- Top left corner decoration -->
          <div class="absolute top-0 left-0 w-32 h-32 opacity-[0.03]"
               style="background:radial-gradient(circle at top left,currentColor,transparent 70%)"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <!-- Icon + verdict text -->
            <div class="flex items-start gap-5 flex-1">
              <span class="font-mono text-5xl leading-none shrink-0 mt-1" :class="verdictColorClass">
                {{ verdictIcon }}
              </span>
              <div>
                <div class="font-mono text-[0.6rem] text-[#2a2a2a] tracking-[0.18em] uppercase mb-2">
                  Audit Verdict
                </div>
                <h1 class="font-display font-black leading-none mb-3"
                    style="font-size:clamp(2rem,4vw,3.2rem);"
                    :class="verdictColorClass">
                  {{ result.verdict }}
                </h1>
                <p class="text-sm text-[#666] leading-relaxed max-w-lg">{{ result.verdictReason }}</p>
              </div>
            </div>

            <!-- Score ring -->
            <div class="flex flex-col items-center gap-3 shrink-0">
              <div class="relative w-28 h-28">
                <svg class="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#111" stroke-width="5"/>
                  <circle cx="50" cy="50" r="40" fill="none"
                          :stroke="ringStrokeColor" stroke-width="5"
                          stroke-linecap="round"
                          :stroke-dasharray="`${2 * Math.PI * 40}`"
                          :stroke-dashoffset="ringOffset"
                          style="transition: stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="font-display font-black text-3xl text-[#e8e8e8] leading-none">{{ result.overallScore }}</span>
                  <span class="font-mono text-[0.58rem] text-[#333] tracking-wider">/100</span>
                </div>
              </div>
              <div class="font-mono text-[0.6rem] tracking-widest uppercase" :class="verdictColorClass">
                Readiness Score
              </div>
            </div>
          </div>
        </div>

        <!-- ─── PLAN SUMMARY ─── -->
        <div class="mb-14">
          <div class="section-eyebrow">// Plan Summary</div>
          <div class="border-l-2 border-[#1e1e1e] pl-6 py-1">
            <p class="text-sm text-[#666] leading-[1.9]">{{ result.summary }}</p>
          </div>
        </div>

        <!-- ─── DIMENSIONS ─── -->
        <div class="mb-14">
          <div class="section-eyebrow">// Five-Dimension Analysis</div>
          <p class="text-[0.78rem] text-[#2a2a2a] mb-6">Click any dimension to read the full critique.</p>

          <div class="space-y-2">
            <div v-for="dim in result.dimensions" :key="dim.id"
                 class="border transition-all duration-200"
                 :class="expandedDim === dim.id
                   ? 'border-[#222] bg-[#0c0c0c]'
                   : 'border-[#151515] bg-[#0a0a0a] hover:border-[#1e1e1e]'">

              <!-- Header row -->
              <div class="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                   @click="toggleDim(dim.id)">
                <span class="text-lg shrink-0 w-7 text-center">{{ dim.icon }}</span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="text-[0.83rem] font-medium text-[#c8c8c8]">{{ dim.label }}</span>
                    <span class="font-mono text-[0.6rem] px-1.5 py-0.5 border"
                          :class="scoreTagClass(dim.score)">{{ scoreLabel(dim.score) }}</span>
                  </div>
                  <p class="text-[0.77rem] text-[#444] leading-snug truncate md:whitespace-normal md:overflow-visible">{{ dim.critique }}</p>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <div class="text-right">
                    <div class="font-mono text-sm font-medium" :class="scoreColorClass(dim.score)">{{ dim.score }}</div>
                    <div class="score-bar-track w-16 mt-1">
                      <div class="score-bar-fill" :style="{ width: dim.score + '%' }" :class="scoreBarClass(dim.score)"></div>
                    </div>
                  </div>
                  <span class="font-mono text-[0.7rem] text-[#2a2a2a] w-4 text-center">
                    {{ expandedDim === dim.id ? '−' : '+' }}
                  </span>
                </div>
              </div>

              <!-- Expanded detail -->
              <div v-if="expandedDim === dim.id"
                   class="px-5 pb-5 border-t border-[#131313] dim-detail-enter"
                   style="padding-left:4rem">
                <p class="text-[0.82rem] text-[#555] leading-[1.85] pt-4">{{ dim.detail }}</p>
              </div>

            </div>
          </div>
        </div>

        <!-- ─── BLIND SPOT ─── -->
        <div class="mb-14">
          <div class="section-eyebrow">// Critical Blind Spot</div>
          <div class="flex gap-5 p-6 border border-[#1a0a0a]"
               style="background:linear-gradient(135deg,rgba(204,41,54,0.05),rgba(8,8,8,0))">
            <div class="shrink-0 w-10 h-10 flex items-center justify-center border border-red-dim text-red font-mono text-sm">
              👁
            </div>
            <div>
              <div class="font-mono text-[0.62rem] text-red-dim tracking-widest uppercase mb-2">
                What you may not have considered
              </div>
              <p class="text-sm text-[#888] leading-[1.85]">{{ result.blindSpot }}</p>
            </div>
          </div>
        </div>

        <!-- ─── HOMEWORK ─── -->
        <div class="mb-14">
          <div class="section-eyebrow">// Your Homework</div>
          <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p class="text-sm text-[#c0c0c0] font-medium">Complete these before you execute your plan.</p>
            <div class="flex items-center gap-2">
              <div class="w-24 score-bar-track">
                <div class="score-bar-fill bg-green transition-all duration-500"
                     :style="{ width: (checkedCount / result.homework.length * 100) + '%' }"></div>
              </div>
              <span class="font-mono text-[0.62rem] text-[#333]">{{ checkedCount }}/{{ result.homework.length }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <div v-for="(task, i) in result.homework" :key="i"
                 class="flex items-start gap-4 px-5 py-4 border cursor-pointer
                        transition-all duration-200 group"
                 :class="checklist[i]
                   ? 'border-[#163d2a] bg-[#0a0f0c] opacity-50'
                   : 'border-[#151515] bg-[#0a0a0a] hover:border-[#1e1e1e]'"
                 @click="toggleCheck(i)">
              <div class="w-4 h-4 border shrink-0 flex items-center justify-center mt-0.5
                          transition-all duration-200 font-mono text-[0.55rem]"
                   :class="checklist[i]
                     ? 'border-green bg-green-dim text-green'
                     : 'border-[#2a2a2a] text-transparent group-hover:border-[#3a3a3a]'">
                {{ checklist[i] ? '✓' : '' }}
              </div>
              <span class="text-[0.83rem] leading-relaxed"
                    :class="checklist[i] ? 'line-through text-[#2a2a2a]' : 'text-[#888]'">
                {{ task }}
              </span>
            </div>
          </div>

          <!-- All done -->
          <transition name="step">
            <div v-if="checkedCount === result.homework.length"
                 class="mt-4 flex items-center gap-4 px-5 py-4 border border-[#163d2a] flex-wrap"
                 style="background:rgba(74,173,121,0.05)">
              <span class="text-xl">🎉</span>
              <div class="flex-1">
                <p class="text-sm font-medium text-green mb-0.5">All homework complete.</p>
                <p class="text-[0.75rem] text-[#2a2a2a]">
                  You're more prepared than most. Consider re-running the audit to see if your score improved.
                </p>
              </div>
              <router-link to="/analyze"
                class="font-mono text-[0.68rem] text-green tracking-wider uppercase border border-green-dim
                       px-4 py-2 hover:bg-green-dim transition-colors duration-200 no-underline">
                Re-Audit →
              </router-link>
            </div>
          </transition>
        </div>

        <!-- ─── DIMENSION SCORES TABLE ─── -->
        <div class="mb-14 card p-6">
          <div class="section-eyebrow">// Score Breakdown</div>
          <div class="space-y-3">
            <div v-for="dim in result.dimensions" :key="dim.id + '_table'"
                 class="flex items-center gap-4">
              <span class="text-sm shrink-0 w-5 text-center">{{ dim.icon }}</span>
              <span class="text-[0.78rem] text-[#444] w-40 shrink-0">{{ dim.label }}</span>
              <div class="flex-1 score-bar-track">
                <div class="score-bar-fill h-px" :style="{ width: dim.score + '%' }" :class="scoreBarClass(dim.score)"></div>
              </div>
              <span class="font-mono text-[0.72rem] w-8 text-right shrink-0" :class="scoreColorClass(dim.score)">{{ dim.score }}</span>
            </div>
            <div class="pt-3 border-t border-[#111] flex items-center gap-4">
              <span class="text-sm shrink-0 w-5 text-center">◉</span>
              <span class="text-[0.78rem] text-[#888] w-40 shrink-0 font-medium">Overall Score</span>
              <div class="flex-1 score-bar-track">
                <div class="score-bar-fill" :style="{ width: result.overallScore + '%' }"
                     :class="scoreBarClass(result.overallScore)"></div>
              </div>
              <span class="font-mono text-[0.78rem] w-8 text-right shrink-0 font-medium"
                    :class="verdictColorClass">{{ result.overallScore }}</span>
            </div>
          </div>
        </div>

        <!-- ─── ACTIONS ─── -->
        <div class="flex flex-wrap gap-3 pt-8 border-t border-[#111]">
          <router-link to="/analyze" class="btn-primary group">
            <span>Audit Another Decision</span>
            <span class="font-mono group-hover:translate-x-1 transition-transform duration-200">→</span>
          </router-link>
          <router-link to="/" class="btn-outline">← Back to Home</router-link>
          <button @click="shareResult" class="btn-outline">
            {{ copied ? '✓ Copied to clipboard' : '⬡ Share results' }}
          </button>
        </div>

      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ResultPage',
  data() {
    return {
      result:      null,
      form:        {},
      expandedDim: null,
      checklist:   [],
      copied:      false,
    }
  },
  computed: {
    verdictBorderClass() {
      return { 'NOT READY': 'border-red-dim', 'NEEDS WORK': 'border-amber-dim',
               'ALMOST THERE': 'border-ice-dim', 'READY': 'border-green-dim' }[this.result?.verdict] || 'border-[#1e1e1e]'
    },
    verdictBgClass() {
      return { 'NOT READY': 'bg-red', 'NEEDS WORK': 'bg-amber',
               'ALMOST THERE': 'bg-ice', 'READY': 'bg-green' }[this.result?.verdict] || 'bg-[#333]'
    },
    verdictColorClass() {
      return { 'NOT READY': 'text-red', 'NEEDS WORK': 'text-amber',
               'ALMOST THERE': 'text-ice', 'READY': 'text-green' }[this.result?.verdict] || 'text-amber'
    },
    verdictIcon() {
      return { 'NOT READY': '☠', 'NEEDS WORK': '⚠', 'ALMOST THERE': '◎', 'READY': '✓' }[this.result?.verdict] || '⚠'
    },
    ringStrokeColor() {
      return { 'NOT READY': '#cc2936', 'NEEDS WORK': '#e8934a',
               'ALMOST THERE': '#8ecae6', 'READY': '#4aad79' }[this.result?.verdict] || '#e8934a'
    },
    ringOffset() {
      const c = 2 * Math.PI * 40
      return c - ((this.result?.overallScore || 0) / 100) * c
    },
    checkedCount() { return this.checklist.filter(Boolean).length },
    currentDate() {
      return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
  },
  created() {
    try {
      const raw     = sessionStorage.getItem('analysisResult')
      const formRaw = sessionStorage.getItem('analysisForm')
      if (raw) {
        this.result   = JSON.parse(raw)
        this.checklist = Array(this.result.homework?.length || 0).fill(false)
        if (this.result.dimensions?.length) this.expandedDim = this.result.dimensions[0].id
      }
      if (formRaw) this.form = JSON.parse(formRaw)
    } catch { this.result = null }
  },
  methods: {
    toggleDim(id) { this.expandedDim = this.expandedDim === id ? null : id },
    toggleCheck(i) { this.checklist = this.checklist.map((v, idx) => idx === i ? !v : v) },

    scoreColorClass(s) {
      if (s < 35) return 'text-red'
      if (s < 56) return 'text-amber'
      if (s < 75) return 'text-ice'
      return 'text-green'
    },
    scoreBarClass(s) {
      if (s < 35) return 'bg-red'
      if (s < 56) return 'bg-amber'
      if (s < 75) return 'bg-ice'
      return 'bg-green'
    },
    scoreTagClass(s) {
      if (s < 35) return 'border-red-dim text-red bg-[rgba(204,41,54,0.08)]'
      if (s < 56) return 'border-amber-dim text-amber bg-[rgba(232,147,74,0.08)]'
      if (s < 75) return 'border-ice-dim text-ice bg-[rgba(142,202,230,0.08)]'
      return 'border-green-dim text-green bg-[rgba(74,173,121,0.08)]'
    },
    scoreLabel(s) {
      if (s < 35) return 'HIGH RISK'
      if (s < 56) return 'CONCERNING'
      if (s < 75) return 'MODERATE'
      return 'STRONG'
    },

    async shareResult() {
      const plan = this.form.plan?.substring(0, 80) || ''
      const text = [
        `Devil's Advocate — Decision Audit`,
        ``,
        `Plan: ${plan}${plan.length === 80 ? '...' : ''}`,
        ``,
        `Verdict: ${this.result.verdict} (${this.result.overallScore}/100)`,
        this.result.verdictReason,
        ``,
        `Audited at: ${window.location.origin}`,
      ].join('\n')
      try {
        await navigator.clipboard.writeText(text)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2500)
      } catch { /**/ }
    }
  }
}
</script>

<style scoped>
.text-red   { color: #cc2936; }
.text-amber { color: #e8934a; }
.text-ice   { color: #8ecae6; }
.text-green { color: #4aad79; }

.bg-red   { background-color: #cc2936; }
.bg-amber { background-color: #e8934a; }
.bg-ice   { background-color: #8ecae6; }
.bg-green { background-color: #4aad79; }

.border-red-dim   { border-color: #7a1a21; }
.border-amber-dim { border-color: #6b3a18; }
.border-ice-dim   { border-color: #1a3a4a; }
.border-green-dim { border-color: #163d2a; }

.bg-green-dim { background-color: #163d2a; }
</style>
