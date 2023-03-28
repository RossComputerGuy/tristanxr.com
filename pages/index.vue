<template>
  <div>
    <section
      class="flex flex-col items-center justify-center h-screen -my-20 md:-mt-48 px-8"
    >
      <div
        class="flex flex-col items-center justify-center text-center h-screen-half"
      >
        <img
          class="md:hidden object-cover w-15 h-40 rounded-full mb-5 ring-2 ring-gray-500/50 ring-offset-[10px]"
          src="~/assets/img/tristan-ross.jpg"
          :alt="i18n.t('name')"
        />
        <h1 class="text-5xl sm:text-6xl lg:text-9xl" v-text="i18n.t('name')" />
        <h2
          class="font-light text-4xl sm:text-5xl lg:text-8xl"
          v-text="i18n.t('position')"
        />
      </div>
    </section>
    <section
      class="flex items-center justify-between px-8 mb-20 tracking-wider"
    >
      <div
        class="flex flex-col w-full md:w-1/3 space-y-12 text-center md:text-left"
      >
        <div class="flex flex-col px-10 md:px-20">
          <h3 class="text-xl font-bold">Skills</h3>
          <br />
          <span
            v-for="(skill, i) in skills"
            :key="i"
            class="text-lg"
            v-text="skill"
          />
        </div>
        <div class="px-10 md:px-20">
          <h3 class="text-xl font-bold">{{ i18n.t('summary.name') }}</h3>
          <br />
          <p class="w-full md:w-2/3">
            {{ i18n.t('summary.message') }}
          </p>
        </div>
        <div class="px-10 md:px-20" id="contact">
          <br />
          <h3 class="text-xl font-bold">{{ i18n.t('contact') }}</h3>
          <a
            class="text-xl hover:text-blue-600"
            href="mailto:rosscomputerguy@protonmail.com"
            >rosscomputerguy@protonmail.com</a
          >
        </div>
      </div>
      <img
        class="hidden md:block object-cover w-1/4 h-screen rounded-full ring-2 ring-gray-500/50 ring-offset-[30px]"
        src="~/assets/img/tristan-ross.jpg"
        :alt="i18n.t('name')"
      />
      <div class="hidden md:flex flex-col w-1/3 space-y-12 text-right">
        <div class="px-20">
          <h4 class="text-xl font-bold">{{ i18n.t('stats.experience') }}</h4>
          <br />
          <p class="text-6xl">2</p>
        </div>
        <div class="px-20">
          <h4 class="text-xl font-bold">{{ i18n.t('stats.projects') }}</h4>
          <br />
          <p class="text-6xl">3</p>
        </div>
      </div>
    </section>
    <hr class="border-gray-400 mx-44" />
    <section class="px-20 mt-10" id="experience">
      <h4 class="mb-8 text-3xl font-bold text-center md:text-left">
        Experience
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-6 my-10">
        <div class="flex flex-col col-span-2 mb-4 md:mb-0">
          <h5 class="text-xl md:text-2xl font-bold">Jr DevOps Engineer</h5>
          <h6 class="text-lg font-bold">Ezoic, Inc</h6>
          <p>August 2022 - January 2023</p>
        </div>
        <div class="flex flex-col col-span-4">
          <p>
            I had the opportunity to work at Ezoic for about 6 months as a DevOps Engineer.
            It was a great opportunity despite it being short lived. I made great friends and
            connections along the way.
          </p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-6 my-10">
        <div class="flex flex-col col-span-2 mb-4 md:mb-0">
          <h5 class="text-xl md:text-2xl font-bold">Stocker</h5>
          <h6 class="text-lg font-bold">88 Ranch Marketplace</h6>
          <p>March 2022 - August 2022</p>
        </div>
        <div class="flex flex-col col-span-4">
          <p>
            After moving to California, I switched to an Asian market called 88
            Ranch. It has allowed me to learn about how stores put out products.
            Another ability I have learned is front facing, a technique used to
            ensure more product is sold and a method of organization.
          </p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-6 my-10">
        <div class="flex flex-col col-span-2 mb-4 md:mb-0">
          <h5 class="text-xl md:text-2xl font-bold">Cashier</h5>
          <h6 class="text-lg font-bold">Chipotle</h6>
          <p>Nov 2019 - March 2022</p>
        </div>
        <div class="flex flex-col col-span-4">
          <p>
            Not my first choice for a place to work at but it was a good
            experience. I got to meet many new people and some who have become
            my friends. I learned certain necessary aspects of work such as time
            management and customer service.
          </p>
        </div>
      </div>
    </section>
    <hr class="border-gray-400 mx-44" />
    <section class="px-20 mt-10" id="education">
      <h4 class="mb-8 text-3xl font-bold text-center md:text-left">
        Education
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-6 my-10">
        <div class="flex flex-col col-span-2 mb-4 md:mb-0">
          <h5 class="text-xl md:text-2xl font-bold">
            Associates of Applied Science
          </h5>
          <h6 class="text-lg font-bold">Portland Community College</h6>
          <p>Sep 2020 - <i>now</i></p>
        </div>
        <div class="flex flex-col col-span-4">
          <p>
            This degree focuses on many elementary topics for Linux, web
            development, and data communications.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const skills = computed(() =>
  ['cs', 'kube', 'linux', 'ts', 'vue'].map((v) => i18n.t('skills.' + v))
)
</script>
<i18n>
{
  "en": {
    "name": "Tristan Ross",
    "position": "Software Developer",
    "stats": {
      "experience": "Experience",
      "projects": "Projects"
    },
    "skills": {
      "cs": "Customer Service",
      "kube": "Kubernetes",
      "linux": "Linux",
      "ts": "TypeScript",
      "vue": "Nuxt.js/Vue"
    },
    "summary": {
      "name": "Summary",
      "message": "I am aiming to become a software engineer at a respectable technology company. Ever since I was a child, I’ve had a fascination for technology and computers. It wouldn’t be until I was about 12 years old when I began programming. Since then I have learned many things from web development to low level programming."
    },
    "contact": "Contact"
  }
}
</i18n>
