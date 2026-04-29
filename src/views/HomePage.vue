<template>
  <div class="text-[#c8c8c8]">

    <!-- ═══ HERO ═══ -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden">

      <!-- Background layers -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Grid -->
        <div class="absolute inset-0 opacity-[0.035]"
             style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:80px 80px;"></div>
        <!-- Red atmospheric glow -->
        <div class="absolute top-0 left-0 w-[50vw] h-[70vh] opacity-[0.06]"
             style="background:radial-gradient(ellipse at top left,#cc2936,transparent 65%);"></div>
        <!-- Bottom fade -->
        <div class="absolute bottom-0 left-0 right-0 h-40"
             style="background:linear-gradient(to top,#080808,transparent);"></div>
      </div>

      <div class="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-28 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

        <!-- Left: Copy -->
        <div class="animate-fade-up">
          <!-- Eyebrow -->
          <div class="flex items-center gap-3 mb-8">
            <span class="tag-red">AI Devil's Advocate</span>
            <span class="w-8 h-px bg-[#222]"></span>
            <span class="font-mono text-[0.6rem] text-[#333] tracking-widest uppercase">Decision Stress-Tester</span>
          </div>

          <!-- Headline -->
          <h1 class="font-display font-black leading-[1.1] text-[#f0f0f0] mb-8"
              style="font-size:clamp(2.8rem,5.5vw,5rem);">
            Everyone has a friend<br/>
            who says
            <span class="italic text-red"> "great idea!"</span>
          </h1>

          <!-- Subhead -->
          <p class="text-[#666] leading-[1.85] mb-4 max-w-[480px]" style="font-size:clamp(0.9rem,1.2vw,1rem);">
            We're the other kind. An AI built to relentlessly probe the weaknesses in your plans
            — not to discourage you, but to make sure your decisions are truly bulletproof
            before you pull the trigger.
          </p>
          <p class="font-mono text-[0.72rem] text-[#333] mb-10 tracking-wide">
            Stress-test your career moves, business ideas, investments, and life decisions.
          </p>

          <!-- CTA -->
          <div class="flex items-center gap-5 flex-wrap">
            <router-link to="/analyze" class="btn-primary group">
              <span>Audit My Decision</span>
              <span class="transition-transform duration-200 group-hover:translate-x-1 font-mono">→</span>
            </router-link>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-1.5">
                <div v-for="i in 4" :key="i" class="w-6 h-6 rounded-full border border-[#111] bg-[#1a1a1a] flex items-center justify-center text-[0.5rem]">
                  {{ ['😰','🤔','😬','😅'][i-1] }}
                </div>
              </div>
              <span class="font-mono text-[0.65rem] text-[#333]">Free. No sign-up.</span>
            </div>
          </div>

          <!-- Stats row -->
          <div class="flex items-center gap-8 mt-12 pt-8 border-t border-[#131313] flex-wrap">
            <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-0.5">
              <span class="font-display font-bold text-2xl text-[#e0e0e0]">{{ stat.value }}</span>
              <span class="font-mono text-[0.62rem] text-[#333] tracking-wider uppercase">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Terminal preview -->
        <div class="hidden lg:block animate-fade-in" style="animation-delay:0.4s">
          <div class="relative">
            <!-- Glow behind card -->
            <div class="absolute -inset-4 opacity-20 blur-2xl rounded-lg"
                 style="background:radial-gradient(ellipse,#cc2936,transparent 70%);"></div>
            <!-- Card -->
            <div class="relative bg-[#0c0c0c] border border-[#1e1e1e] rounded-sm overflow-hidden">
              <!-- Title bar -->
              <div class="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-[#1a1a1a]">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#cc2936] opacity-90"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-[#e8934a] opacity-70"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-[#4aad79] opacity-70"></span>
                </div>
                <span class="font-mono text-[0.62rem] text-[#2a2a2a] tracking-widest ml-auto">devil_advocate_v2.exe</span>
              </div>
              <!-- Chat body -->
              <div class="p-5 flex flex-col gap-4">
                <!-- User message -->
                <div class="flex gap-3">
                  <span class="font-mono text-[0.6rem] text-[#2a2a2a] mt-1 shrink-0">YOU</span>
                  <p class="text-[0.82rem] text-[#666] italic leading-relaxed border-l border-[#1e1e1e] pl-3">
                    "I'm quitting my job next month to open a coffee shop."
                  </p>
                </div>
                <!-- AI responses -->
                <div v-for="(msg, i) in previewMessages" :key="i"
                     class="flex gap-3 p-3 border-l-2 border-red-dim rounded-sm"
                     style="background:rgba(204,41,54,0.05)">
                  <span class="font-mono text-[0.6rem] text-red-dim mt-0.5 shrink-0">DEVIL</span>
                  <p class="text-[0.8rem] text-[#888] leading-relaxed">{{ msg }}</p>
                </div>
                <!-- Score -->
                <div class="pt-3 border-t border-[#151515]">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-mono text-[0.62rem] text-[#2a2a2a] tracking-wider">READINESS SCORE</span>
                    <span class="font-mono text-[0.75rem] text-red font-medium">32 / 100</span>
                  </div>
                  <div class="score-bar-track">
                    <div class="score-bar-fill bg-red" style="width:32%"></div>
                  </div>
                  <div class="mt-2 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></span>
                    <span class="font-mono text-[0.6rem] text-red tracking-widest uppercase">NOT READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══ MARQUEE ═══ -->
    <div class="border-y border-[#111] py-3 overflow-hidden bg-[#0a0a0a]">
      <div class="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        <span v-for="(item, i) in marqueeItems.concat(marqueeItems)" :key="i"
              class="font-mono text-[0.6rem] text-[#282828] tracking-[0.15em] uppercase shrink-0">
          {{ item }}
        </span>
      </div>
    </div>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="max-w-6xl mx-auto px-8 md:px-12 py-28">
      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
        <div class="lg:sticky top-28">
          <div class="section-eyebrow">// How it works</div>
          <h2 class="font-display font-bold text-[#e8e8e8] leading-[1.15] mb-5"
              style="font-size:clamp(1.8rem,3vw,2.6rem);">
            Not a chatbot.<br/>
            An <em class="italic text-red">interrogator</em>.
          </h2>
          <p class="text-sm text-[#444] leading-relaxed">
            Most AI tools validate your thinking. This one attacks it — systematically, relentlessly,
            from every angle that matters.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(step, i) in steps" :key="i"
               class="card p-7 group hover:border-[#cc2936]/30 transition-colors duration-300">
            <div class="flex items-start justify-between mb-5">
              <span class="font-mono text-[2.2rem] text-[#1a1a1a] font-medium leading-none">0{{ i+1 }}</span>
              <span class="text-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300">{{ step.icon }}</span>
            </div>
            <h3 class="text-[0.92rem] font-medium text-[#d0d0d0] mb-2">{{ step.title }}</h3>
            <p class="text-[0.8rem] text-[#444] leading-[1.75]">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ DIMENSIONS ═══ -->
    <section class="border-y border-[#111] bg-[#0a0a0a] py-28">
      <div class="max-w-6xl mx-auto px-8 md:px-12">
        <div class="section-eyebrow text-center">// Five Attack Vectors</div>
        <h2 class="font-display font-bold text-center text-[#e8e8e8] mb-16"
            style="font-size:clamp(1.8rem,3vw,2.6rem);">
          Your plan, dissected from every angle
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div v-for="dim in dimensions" :key="dim.id"
               class="card p-6 flex flex-col gap-3 hover:border-[#2a2a2a] transition-colors duration-200">
            <span class="text-2xl">{{ dim.icon }}</span>
            <div class="font-mono text-[0.62rem] tracking-wider text-[#333] uppercase">{{ dim.id }}</div>
            <h3 class="text-sm font-medium text-[#c0c0c0]">{{ dim.label }}</h3>
            <p class="text-[0.75rem] text-[#3a3a3a] leading-relaxed">{{ dim.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CATEGORIES ═══ -->
    <section class="max-w-6xl mx-auto px-8 md:px-12 py-28">
      <div class="section-eyebrow">// Decision Categories</div>
      <h2 class="font-display font-bold text-[#e8e8e8] mb-12"
          style="font-size:clamp(1.8rem,3vw,2.6rem);">
        What decision are you<br/>putting to the test?
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <router-link v-for="cat in categories" :key="cat.id" to="/analyze"
          class="flex items-center gap-4 px-6 py-5 card text-[#666] no-underline
                 group hover:border-[#cc2936]/40 transition-all duration-200">
          <span class="text-xl opacity-60 group-hover:opacity-100 transition-opacity duration-200">{{ cat.icon }}</span>
          <div class="flex-1">
            <div class="text-sm text-[#bbb] group-hover:text-white transition-colors duration-200 mb-0.5">{{ cat.name }}</div>
            <div class="text-[0.72rem] text-[#333]">{{ cat.hint }}</div>
          </div>
          <span class="font-mono text-xs text-[#2a2a2a] group-hover:text-red group-hover:translate-x-1
                       transition-all duration-200">→</span>
        </router-link>
      </div>
    </section>

    <!-- ═══ TESTIMONIAL / WARNING ═══ -->
    <section class="border-t border-[#111] py-20 px-8 md:px-12"
             style="background:linear-gradient(to bottom,#0c0804,#080808)">
      <div class="max-w-3xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 mb-8">
          <span class="w-12 h-px bg-[#1e1e1e]"></span>
          <span class="font-mono text-[0.6rem] text-[#333] tracking-widest">FAIR WARNING</span>
          <span class="w-12 h-px bg-[#1e1e1e]"></span>
        </div>
        <blockquote class="font-display italic text-[#555] mb-8 leading-relaxed"
                    style="font-size:clamp(1.1rem,2vw,1.4rem)">
          "This AI is designed to disagree with you. If you're looking for validation,
          <span class="text-red not-italic">this is not the tool</span>.
          If you're looking for the truth — let's begin."
        </blockquote>
        <router-link to="/analyze" class="btn-primary inline-flex group">
          <span>I'm Ready to Be Challenged</span>
          <span class="font-mono group-hover:translate-x-1 transition-transform duration-200">→</span>
        </router-link>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      previewMessages: [
        '80k in capital burns through in 3–4 months before you hit break-even. Have you modeled month-by-month cash flow including rent, equipment, staff, and your own living costs?',
        '"My friends love my coffee" is not market validation. Friends don\'t say no. Have you sold to 50 complete strangers who owe you nothing?',
      ],
      stats: [
        { value: '5',    label: 'Critique Dimensions' },
        { value: '100',  label: 'Point Readiness Score' },
        { value: '∞',    label: 'Honest Questions' },
        { value: '0',    label: 'Empty Praise' },
      ],
      marqueeItems: [
        '☠ Financial Risk', '// Market Validation', '☠ Skill Gaps',
        '// Timing & Opportunity Cost', '☠ Motivation Clarity', '// Blind Spots',
        '☠ Career Pivots', '// Business Plans', '☠ Investment Decisions',
        '// Relationship Choices', '☠ Education Paths',
      ],
      steps: [
        { icon: '🎯', title: 'Choose your decision category', desc: 'Select from career pivots, business ideas, investments, relationships, education, or any major life decision.' },
        { icon: '📝', title: 'Describe your plan honestly', desc: 'Tell us your plan, your motivation, how prepared you are, and why you believe in it. Detail matters.' },
        { icon: '⚔️', title: 'AI attacks from five angles', desc: 'Financial risk, market reality, skill gaps, timing, and motivational blind spots — all scrutinized without mercy.' },
        { icon: '📊', title: 'Receive your readiness score', desc: 'An honest, weighted score per dimension plus a verdict: Not Ready, Needs Work, Almost There, or Ready.' },
        { icon: '✅', title: 'Get your homework checklist', desc: 'Not a rejection — a concrete list of what you must resolve before you\'re truly ready to execute.' },
        { icon: '🔁', title: 'Retest after you improve', desc: 'Do the work, come back, and watch your score climb. The AI acknowledges your progress.' },
      ],
      dimensions: [
        { id: 'FINANCIAL',   icon: '💸', label: 'Financial Risk',         desc: 'Capital requirements, burn rate, break-even timeline, and survival runway.' },
        { id: 'MARKET',      icon: '📊', label: 'Market Validation',      desc: 'Real demand vs. assumed demand. Who has actually paid for this?' },
        { id: 'SKILL',       icon: '🧠', label: 'Skill & Experience',     desc: 'The gap between what you know and what this actually requires.' },
        { id: 'TIMING',      icon: '⏰', label: 'Timing & Opportunity',   desc: 'Is now the right moment? What are you sacrificing by doing this now?' },
        { id: 'MOTIVATION',  icon: '🎯', label: 'Motivation Clarity',     desc: 'Are you running toward something, or away from something else?' },
      ],
      categories: [
        { id: 'career',       icon: '💼', name: 'Career & Resignation',    hint: 'Quitting, pivoting, going freelance' },
        { id: 'business',     icon: '🚀', name: 'Business & Startups',     hint: 'New ventures, products, side hustles' },
        { id: 'finance',      icon: '💰', name: 'Investments & Finance',   hint: 'Stocks, crypto, real estate, loans' },
        { id: 'relationship', icon: '❤️', name: 'Relationships',           hint: 'Marriage, breakups, major commitments' },
        { id: 'education',    icon: '🎓', name: 'Education & Courses',     hint: 'Degrees, bootcamps, major switches' },
        { id: 'other',        icon: '🎯', name: 'Other Life Decisions',    hint: 'Relocating, major purchases, lifestyle' },
      ],
    }
  }
}
</script>

<style scoped>
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
