import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './views/HomePage.vue'
import AnalyzePage from './views/AnalyzePage.vue'
import ResultPage from './views/ResultPage.vue'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/analyze', component: AnalyzePage },
    { path: '/result', component: ResultPage },
  ]
})

createApp(App).use(router).mount('#app')
