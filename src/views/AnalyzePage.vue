<template>
  <div class="max-w-2xl mx-auto px-6 md:px-8 py-14 pb-24">

    <!-- Header -->
    <router-link to="/" class="inline-flex items-center gap-2 font-mono text-[0.68rem] text-[#333]
                                tracking-wider uppercase mb-10 hover:text-[#666] transition-colors no-underline">
      ← Back to Home
    </router-link>

    <div class="mb-10">
      <div class="tag-red mb-4">Decision Audit</div>
      <h1 class="font-display font-black text-[#ececec] leading-[1.1] mb-4"
          style="font-size:clamp(2rem,4vw,3rem);">
        Tell us your plan.<br/>
        <em class="text-red italic">We'll find the cracks.</em>
      </h1>
      <p class="text-sm text-[#444] leading-relaxed">
        Answer honestly — the more detail you provide, the sharper the analysis.
        Vague inputs produce vague critiques.
      </p>
    </div>

    <!-- Progress bar -->
    <div class="mb-2 flex justify-between items-center">
      <span class="font-mono text-[0.62rem] text-[#2a2a2a] tracking-widest uppercase">
        Step {{ currentStep + 1 }} of {{ formSteps.length }}
      </span>
      <span class="font-mono text-[0.62rem] text-[#333] tracking-widest">
        {{ formSteps[currentStep].label }}
      </span>
    </div>
    <div class="w-full h-px bg-[#151515] mb-1 overflow-hidden">
      <div class="h-full bg-red transition-all duration-500 ease-out"
           :style="{ width: ((currentStep + 1) / formSteps.length * 100) + '%' }"></div>
    </div>
    <!-- Step dots -->
    <div class="flex gap-1.5 mb-10">
      <div v-for="(s, i) in formSteps" :key="i"
           class="flex-1 h-px transition-all duration-300"
           :class="i <= currentStep ? 'bg-red-dim' : 'bg-[#111]'"></div>
    </div>

    <!-- ─── Form Card ─── -->
    <div class="card p-8 md:p-10">
      <transition name="step" mode="out-in">

        <!-- Step 0: Category -->
        <div v-if="currentStep === 0" key="s0">
          <div class="section-eyebrow">01 — Category</div>
          <h2 class="font-display text-2xl font-bold text-[#e0e0e0] mb-1.5">What kind of decision is this?</h2>
          <p class="text-sm text-[#444] mb-8">The category helps the AI frame its questions correctly.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            <button v-for="cat in categories" :key="cat.id"
                    class="flex items-start gap-3.5 p-4 border text-left cursor-pointer
                           transition-all duration-200 group"
                    :class="form.category === cat.name
                      ? 'border-red-dim bg-[rgba(204,41,54,0.07)] text-[#e0e0e0]'
                      : 'border-[#171717] bg-[#0a0a0a] text-[#555] hover:border-[#222] hover:text-[#888]'"
                    @click="form.category = cat.name">
              <span class="text-lg mt-0.5 shrink-0"
                    :class="form.category === cat.name ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'">{{ cat.icon }}</span>
              <div>
                <div class="text-[0.83rem] font-medium mb-0.5">{{ cat.name }}</div>
                <div class="text-[0.7rem] text-[#333]">{{ cat.hint }}</div>
              </div>
              <span v-if="form.category === cat.name" class="ml-auto font-mono text-[0.65rem] text-red mt-1">✓</span>
            </button>
          </div>
          <div class="divider mb-7"></div>
          <div class="flex justify-end">
            <button class="btn-primary" :disabled="!form.category" @click="nextStep">
              Continue <span class="font-mono">→</span>
            </button>
          </div>
        </div>

        <!-- Step 1: The Plan -->
        <div v-else-if="currentStep === 1" key="s1">
          <div class="section-eyebrow">02 — Your Plan</div>
          <h2 class="font-display text-2xl font-bold text-[#e0e0e0] mb-1.5">Describe your decision</h2>
          <p class="text-sm text-[#444] mb-8">Be specific. Include numbers, timelines, and concrete details where possible.</p>

          <div class="mb-6">
            <label class="block font-mono text-[0.62rem] text-[#333] tracking-widest uppercase mb-2.5">
              What is your plan? *
            </label>
            <textarea v-model="form.plan" class="field-textarea" rows="4"
              placeholder="e.g. I plan to resign from my software engineering job in March and open a specialty coffee shop in downtown Portland with $80k in savings..."></textarea>
            <div class="flex justify-between mt-1.5">
              <span class="font-mono text-[0.6rem] text-[#222]">Be as specific as possible</span>
              <span class="font-mono text-[0.6rem]" :class="form.plan.length > 400 ? 'text-red' : 'text-[#222]'">{{ form.plan.length }}/600</span>
            </div>
          </div>

          <div class="mb-6">
            <label class="block font-mono text-[0.62rem] text-[#333] tracking-widest uppercase mb-2.5">
              Why do you believe this is the right decision?
            </label>
            <textarea v-model="form.confidence" class="field-textarea" rows="3"
              placeholder="e.g. I've always been passionate about coffee, friends tell me my brews are exceptional, and the area has no specialty shops..."></textarea>
          </div>

          <div class="divider mb-7"></div>
          <div class="flex justify-between">
            <button class="btn-outline" @click="prevStep">← Back</button>
            <button class="btn-primary" :disabled="!form.plan.trim()" @click="nextStep">
              Continue <span class="font-mono">→</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Motivation & Preparation -->
        <div v-else-if="currentStep === 2" key="s2">
          <div class="section-eyebrow">03 — Motivation & Readiness</div>
          <h2 class="font-display text-2xl font-bold text-[#e0e0e0] mb-1.5">What's driving this?</h2>
          <p class="text-sm text-[#444] mb-8">This is the section most people rush through. Don't. Honest answers here produce the most valuable insights.</p>

          <div class="mb-6">
            <label class="block font-mono text-[0.62rem] text-[#333] tracking-widest uppercase mb-2.5">
              What is your real motivation? *
            </label>
            <textarea v-model="form.motivation" class="field-textarea" rows="4"
              placeholder="e.g. I've felt stuck in corporate for 5 years and want autonomy. Coffee is my genuine passion since college. I also want to build something of my own before 35..."></textarea>
            <p class="font-mono text-[0.6rem] text-[#222] mt-1.5">Are you running toward something — or away from something?</p>
          </div>

          <div class="mb-6">
            <label class="block font-mono text-[0.62rem] text-[#333] tracking-widest uppercase mb-2.5">
              How prepared are you right now?
            </label>
            <textarea v-model="form.preparation" class="field-textarea" rows="3"
              placeholder="e.g. I have $80k saved, have scouted 3 locations, completed a barista course, and know a coffee bean supplier. I haven't yet filed for an LLC..."></textarea>
          </div>

          <div class="divider mb-7"></div>
          <div class="flex justify-between">
            <button class="btn-outline" @click="prevStep">← Back</button>
            <button class="btn-primary" :disabled="!form.motivation.trim()" @click="nextStep">
              Continue <span class="font-mono">→</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Review & Submit -->
        <div v-else-if="currentStep === 3" key="s3">
          <div class="section-eyebrow">04 — Review & Submit</div>
          <h2 class="font-display text-2xl font-bold text-[#e0e0e0] mb-1.5">Ready to be audited?</h2>
          <p class="text-sm text-[#444] mb-7">Here's what the AI will analyze. Edit any section if needed.</p>

          <!-- Summary grid -->
          <div class="border border-[#161616] overflow-hidden mb-6">
            <div v-for="(row, i) in summaryRows" :key="i"
                 class="flex border-b border-[#111] last:border-b-0 hover:bg-[#0c0c0c] transition-colors duration-150 cursor-pointer group"
                 @click="currentStep = i">
              <div class="w-28 shrink-0 px-4 py-3.5 bg-[#0a0a0a] border-r border-[#111]">
                <span class="font-mono text-[0.6rem] text-[#2a2a2a] tracking-widest uppercase block">{{ row.label }}</span>
              </div>
              <div class="flex-1 px-4 py-3.5 flex items-start justify-between gap-3">
                <span class="text-[0.82rem] text-[#666] leading-relaxed" :class="row.value ? '' : 'italic text-[#2a2a2a]'">
                  {{ row.value ? (row.value.length > 120 ? row.value.substring(0,120) + '...' : row.value) : 'Not provided' }}
                </span>
                <span class="font-mono text-[0.6rem] text-[#222] group-hover:text-[#444] shrink-0 mt-0.5 transition-colors">edit</span>
              </div>
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="flex items-start gap-3 px-4 py-4 mb-4 border border-[#1e1408]"
               style="background:rgba(232,147,74,0.05)">
            <span class="text-amber shrink-0 text-sm mt-0.5">⚠</span>
            <p class="text-[0.78rem] text-[#555] leading-relaxed">
              The AI will actively argue against your plan. This is intentional. It may surface
              uncomfortable truths — that's the entire point.
            </p>
          </div>

          <!-- Error -->
          <div v-if="error"
               class="flex items-start gap-3 px-4 py-4 mb-4 border border-red-dim"
               style="background:rgba(204,41,54,0.07)">
            <span class="text-red shrink-0 text-sm mt-0.5">✕</span>
            <div>
              <p class="text-[0.8rem] text-[#ccc] font-medium mb-0.5">Analysis failed</p>
              <p class="text-[0.75rem] text-[#666]">{{ error }}</p>
            </div>
          </div>

          <div class="divider mb-7"></div>
          <div class="flex justify-between items-center">
            <button class="btn-outline" @click="prevStep">← Edit</button>
            <button class="btn-primary" :disabled="isLoading" @click="submitAnalysis">
              <span v-if="isLoading"
                    class="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin-btn shrink-0"></span>
              <span>{{ isLoading ? 'Analyzing your plan...' : '☠ Run Audit' }}</span>
            </button>
          </div>
        </div>

      </transition>
    </div>

    <!-- Bottom note -->
    <p class="font-mono text-[0.6rem] text-[#1e1e1e] tracking-wider text-center mt-8">
      Your responses are not stored. Analysis runs in real-time via OpenRouter.
    </p>

  </div>
</template>

<script>
import { analyzeDecision } from '../services/openrouter.js'

export default {
  name: 'AnalyzePage',
  data() {
    return {
      currentStep: 0,
      isLoading: false,
      error: null,
      form: { category: '', plan: '', motivation: '', preparation: '', confidence: '' },
      formSteps: [
        { label: 'Category' },
        { label: 'Your Plan' },
        { label: 'Motivation' },
        { label: 'Review' },
      ],
      categories: [
        { id: 'career',       icon: '💼', name: 'Career & Resignation',   hint: 'Quitting, pivoting, going freelance' },
        { id: 'business',     icon: '🚀', name: 'Business & Startups',    hint: 'New ventures, products, side hustles' },
        { id: 'finance',      icon: '💰', name: 'Investments & Finance',  hint: 'Stocks, crypto, real estate, loans' },
        { id: 'relationship', icon: '❤️', name: 'Relationships',          hint: 'Marriage, breakups, major commitments' },
        { id: 'education',    icon: '🎓', name: 'Education & Courses',    hint: 'Degrees, bootcamps, major switches' },
        { id: 'other',        icon: '🎯', name: 'Other Life Decisions',   hint: 'Relocating, major purchases, lifestyle' },
      ],
    }
  },
  computed: {
    summaryRows() {
      return [
        { label: 'Category',    value: this.form.category },
        { label: 'Plan',        value: this.form.plan },
        { label: 'Motivation',  value: this.form.motivation },
        { label: 'Preparation', value: this.form.preparation },
        { label: 'Confidence',  value: this.form.confidence },
      ]
    }
  },
  methods: {
    nextStep() { if (this.currentStep < 3) this.currentStep++ },
    prevStep()  { if (this.currentStep > 0) this.currentStep-- },
    async submitAnalysis() {
      this.isLoading = true
      this.error = null
      try {
        const result = await analyzeDecision(this.form, null)
        sessionStorage.setItem('analysisResult', JSON.stringify(result))
        sessionStorage.setItem('analysisForm',   JSON.stringify(this.form))
        this.$router.push('/result')
      } catch (err) {
        this.error = err.message || 'Something went wrong. Check your API key and try again.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
