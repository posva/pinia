<template>
  <div class="banner" v-if="isVisible">
    <a target="_blank" :href="target">

      <svg class="logo" viewBox="0 0 2688 734" version="1.1"
        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g>
          <g>
            <g>
              <path
                d="M537.782,722.201l-115.56,-0l0,-367.774l-100,367.774l-115.56,-0l-91.102,-375.543l-0,375.543l-115.56,-0l-0,-721.094l123.329,-0l147.786,512.218l139.996,-512.218l126.671,-0l0,721.094Z"
                style="fill:#f97844;fill-rule:nonzero;"></path>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <path
                d="M985.548,722.201l-111.111,-0l-0,-37.783c-1.498,32.596 -33.334,48.894 -95.552,48.894c-42.968,-0 -82.226,-14.085 -117.773,-42.231c-37.782,-30.361 -56.684,-66.276 -56.684,-107.769c-0,-26.671 7.422,-53.516 22.222,-80.556c14.822,-27.04 32.965,-48.698 54.449,-64.996c25.933,-19.249 60.373,-28.884 103.342,-28.884c37.022,-0 67.035,5.186 89.996,15.56l-0,-30.013c-0,-62.218 -24.089,-93.316 -72.223,-93.316c-20.746,-0 -36.306,5.555 -46.679,16.666c-7.401,8.138 -14.801,23.698 -22.223,46.658l-109.982,0c-0,-45.92 16.298,-85.178 48.871,-117.773c32.596,-32.596 71.854,-48.893 117.795,-48.893l28.885,-0c45.92,-0 85.178,16.297 117.773,48.893c32.596,32.595 48.894,71.853 48.894,117.773l-0,357.77Zm-111.111,-154.449c-0,-19.987 -7.965,-37.023 -23.894,-51.107c-15.928,-14.063 -33.897,-21.115 -53.884,-21.115c-20.009,-0 -39.453,7.964 -58.334,23.893c-18.901,15.929 -28.342,33.528 -28.342,52.778c0,19.27 10.005,35.177 30.013,47.786c17.774,11.849 36.654,17.773 56.663,17.773c19.987,0 37.956,-6.857 53.884,-20.551c15.929,-13.715 23.894,-30.186 23.894,-49.457Z"
                style="fill:#f97844;fill-rule:nonzero;"></path>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <path
                d="M1417.74,-0l-1.107,722.201l-106.662,-0l-0,-32.227c-14.822,28.885 -45.183,43.338 -91.103,43.338c-45.92,-0 -85.178,-16.298 -117.773,-48.894c-32.596,-32.595 -48.893,-71.853 -48.893,-117.773l-0,-202.214c-0,-45.92 16.297,-85.178 48.893,-117.773c32.595,-32.596 71.853,-48.893 117.773,-48.893l28.885,-0c20.746,-0 39.258,10.373 55.555,31.12l-1.106,-227.778l115.538,-1.107Zm-115.538,359.983c-0,-42.21 -22.223,-63.325 -66.667,-63.325c-48.156,-0 -72.222,31.098 -72.222,93.338l-0,146.658c-0,62.218 22.591,93.337 67.773,93.337c18.511,0 34.809,-6.315 48.893,-18.902c14.063,-12.586 21.094,-28.146 21.094,-46.658l1.129,-204.448Z"
                style="fill:#f97844;fill-rule:nonzero;"></path>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <path
                d="M1845.57,1.107l-127.778,722.2l-118.88,-1.106l-123.329,-721.094l115.538,-0l67.795,488.867l71.094,-488.867l115.56,-0Z"
                style="fill:#c4d141;fill-rule:nonzero;"></path>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <path
                d="M2262.22,723.307l-115.56,-1.106l1.129,-27.778c-17.036,20.746 -48.893,31.12 -95.551,31.12c-45.942,-0 -83.334,-16.125 -112.218,-48.351c-28.906,-32.205 -43.338,-71.658 -43.338,-118.316l1.107,-368.88l108.876,-0l1.128,343.316c0,62.218 24.067,93.337 72.222,93.337c43.685,0 65.539,-21.115 65.539,-63.324l-1.107,-373.329l116.667,-0l1.106,533.311Z"
                style="fill:#c4d141;fill-rule:nonzero;"></path>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <path
                d="M2687.76,566.645c-0,45.92 -16.298,85.178 -48.872,117.773c-32.595,32.596 -71.853,48.894 -117.773,48.894l-28.906,-0c-45.921,-0 -85.178,-16.298 -117.774,-48.894c-32.595,-32.595 -48.871,-71.853 -48.871,-117.773l-0,-202.214c-0,-45.92 16.276,-85.178 48.871,-117.773c32.596,-32.596 71.853,-48.893 117.774,-48.893l28.906,-0c45.92,-0 85.178,16.297 117.773,48.893c32.574,32.595 48.872,71.853 48.872,117.773l-0,153.321l-251.107,-0l0,18.902c0,34.809 7.791,59.244 23.351,73.329c15.538,14.062 41.102,21.115 76.649,21.115c20.009,0 33.702,-21.484 41.124,-64.453l109.983,-0Zm-111.111,-141.102l-0,-35.547c-0,-62.24 -24.067,-93.338 -72.201,-93.338c-45.204,-0 -67.795,31.098 -67.795,93.338l0,34.44l139.996,1.107Z"
                style="fill:#c4d141;fill-rule:nonzero;"></path>
            </g>
          </g>
        </g>
      </svg>
    </a>

    <div>
      <div class="headline">
        <a target="_blank" :href="target" class="vt-tagline">The
          Vue.js Event in Madrid</a>
        <span class="place"> · Spain</span>
        <span class="vt-date"> · 29 May 2025</span>
      </div>

      <div class="claim">
        <span class="mv-text-primary">Early bird</span> tickets available
        <span class="mv-text-primary">Get 30% off</span>
      </div>

    </div>
    <a target="_blank" class="action" :href="target">
      More Info
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" style="margin-left: 10px;" viewBox="0 0 15 15">
        <path fill="currentColor"
          d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414" />
      </svg>
    </a>
    <div class="close-btn" @click.stop.prevent="closeBanner">
      <span class="close">&times;</span>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const nameStorage = 'MADVUE-BANNER-FEB-2025'

const target = 'https://madvue.es/?utm_source=pinia&utm_content=top_banner'

const resetLayoutTopHeight = () => {
  document.documentElement.classList.add('banner-dismissed')
}

const closeBanner = () => {
  // Hide the banner
  isVisible.value = false
  // Save action in the local storage
  localStorage.setItem(nameStorage, String(true))
  resetLayoutTopHeight()
}

onMounted(() => {
  isVisible.value = !localStorage.getItem(nameStorage)

  if (!isVisible.value) {
    resetLayoutTopHeight()
  }
})
</script>
<style>
html:not(.banner-dismissed) {
  --vp-layout-top-height: 72px;
}
</style>
<style scoped>
.banner {
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  height: var(--vp-layout-top-height);
  font-weight: 600;
  color: #fff;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.banner .logo {
  height: 16px;
}

.banner .headline {
  font-size: 14px;
}

.banner .claim {
  display: none;
}

.banner-dismissed .banner {
  display: none;
}

.mv-text-primary {
  color: #c4d141;
}

.banner .action {
  display: none;
  background: #f97844;
  color: #fff;
  padding: 3px 8px;
  font-size: 13px;
  align-items: center;
  border-radius: 8px;
  text-decoration: none;
}

.banner .action svg {
  display: none;
}

.action:hover {
  text-decoration: none;
  background: #c4d141;
}

.close {
  font-size: 24px;
  line-height: 24px;
  height: 24px;
}

.banner .close-btn {
  top: 50%;
  transform: translateY(-50%);
  height: 24px;
  left: 16px;
  z-index: 99;
  position: absolute;
  cursor: pointer;
}

.banner .place {
  display: none;
}

@media (min-width: 768px) {
  .banner {
    gap: 20px;
    text-align: center;
    flex-direction: row;
  }

  .banner .place {
    display: inline;
  }

  .banner .action {
    display: flex;
  }

  .banner .action svg {
    display: block;
  }

  .banner .logo {
    height: 20px;
  }

  .banner .headline {
    font-size: 15px;
  }

  .banner .claim {
    font-size: 13px;
    display: block;
  }

  .banner .action {
    padding: 0 10px;
    height: 32px;
    font-size: 13px;
  }
}

@media (min-width: 960px) {
  .banner {
    gap: 40px;
  }

  .banner .logo {
    height: 32px;
  }

  .banner .headline {
    font-size: 20px;
  }

  .banner .claim {
    font-size: 18px;
    margin-top: 4px;
  }

  .banner .action {
    padding: 0 14px;
    height: 40px;
    font-size: 16px;
  }
}
</style>