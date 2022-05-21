<template>
  <div class="relative text-gray-800 bg-gray-50">
    <header>
      <nav class="w-full">
        <div class="flex justify-between w-full px-16 py-8">
          <div>
            <ul
              class="flex flex-col text-left md:flex-row space-y-5 md:space-y-0 md:space-x-6 text-xl md:text-2xl"
            >
              <li class="text-left">
                <a href="/#experience">{{ i18n.t('page.experience') }}</a>
              </li>
              <li class="text-left">
                <a href="/#contact">{{ i18n.t('page.contact') }}</a>
              </li>
            </ul>
          </div>
          <div>
            <ul
              class="flex flex-col md:flex-row items-end md:items-center md:space-x-4 space-y-4 md:space-y-0"
            >
              <li>
                <a
                  href="https://www.github.com/RossComputerGuy"
                  target="_blank"
                  :aria-label="i18n.t('link.github')"
                  class="hover:text-blue-600"
                >
                  <Github />
                </a>
              </li>
              <li>
                <a
                  href="https://www.twitter.com/RossComputerGuy"
                  target="_blank"
                  :aria-label="i18n.t('link.twitter')"
                  class="hover:text-blue-600"
                >
                  <Twitter />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/tristan-ross-5408141aa/"
                  target="_blank"
                  :aria-label="i18n.t('link.linkedin')"
                  class="hover:text-blue-600"
                >
                  <Linkedin />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <NuxtPage />

    <footer
      class="absolute w-full h-36 bottom-0 p-8 px-16 bg-gray-800 text-gray-50"
    >
      <p class="text-2xl">{{ i18n.t('footer-message') }}</p>
      <a class="text-lg" href="mailto:rosscomputerguy@protonmail.com"
        >rosscomputerguy@protonmail.com</a
      >
    </footer>
    <div class="h-80" />
  </div>
</template>
<script lang="ts" setup>
import Github from 'vue-material-design-icons/Github.vue'
import Linkedin from 'vue-material-design-icons/Linkedin.vue'
import Twitter from 'vue-material-design-icons/Twitter.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
</script>
<i18n>
{
  "en": {
    "footer-message": "Thank you for checking out my portfolio",
    "link": {
      "github": "GitHub",
      "linkedin": "LinkedIn"
    },
    "page": {
      "contact": "Contact",
      "experience": "Experience"
    }
  }
}
</i18n>
