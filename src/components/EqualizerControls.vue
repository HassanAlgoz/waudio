<template>
  <!-- Source: https://codepen.io/gregh/pen/jyXMYY -->
  <div class="equalizer">
    <div class="section">
      <div class="title">HF</div>
      <div class="sliders">
        <div class="range-slider">
          <span class="scope">22</span>
          <input
            type="range"
            class="vertical"
            min="4700"
            max="22000"
            step="100"
            value="4700"
            v-model.number="filters.HF.freq"
          />
          <span class="scope scope-min">4.7</span>
          <span class="param">kHz</span>
        </div>
        <div class="range-slider">
          <span class="scope">40</span>
          <input
            type="range"
            class="vertical"
            min="-40"
            max="40"
            value="0"
            v-model.number="filters.HF.gain"
          />
          <span class="scope scope-min">-40</span>
          <span class="param">dB</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">LF</div>
      <div class="sliders">
        <div class="range-slider">
          <span class="scope">220</span>
          <input
            type="range"
            class="vertical"
            min="35"
            max="220"
            step="1"
            value="35"
            v-model.number="filters.LF.freq"
          />
          <span class="scope scope-min">35</span>
          <span class="param">Hz</span>
        </div>
        <div class="range-slider">
          <span class="scope">40</span>
          <input
            type="range"
            class="vertical"
            min="-40"
            max="40"
            value="40"
            v-model.number="filters.LF.gain"
          />
          <span class="scope scope-min">-40</span>
          <span class="param">dB</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">HMF</div>
      <div class="sliders">
        <div class="range-slider">
          <span class="scope">5.9</span>
          <input
            type="range"
            class="vertical"
            min="800"
            max="5900"
            step="100"
            value="800"
            v-model.number="filters.HMF.freq"
          />
          <span class="scope scope-min">0.8</span>
          <span class="param">kHz</span>
        </div>
        <div class="range-slider">
          <span class="scope">1000</span>
          <input
            type="range"
            class="vertical"
            min="0.0001"
            max="1000"
            step="0.1"
            value="1"
            v-model.number="filters.HMF.Q"
          />
          <span class="scope scope-min">.0001</span>
          <span class="param">Q</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">LMF</div>
      <div class="sliders">
        <div class="range-slider">
          <span class="scope">1600</span>
          <input
            type="range"
            class="vertical"
            min="80"
            max="1600"
            step="10"
            value="880"
            v-model.number="filters.LMF.freq"
          />
          <span class="scope scope-min">80</span>
          <span class="param">Hz</span>
        </div>
        <div class="range-slider">
          <span class="scope">1000</span>
          <input
            type="range"
            class="vertical"
            min="0.0001"
            max="1000"
            step="0.1"
            value="1"
            v-model.number="filters.LMF.Q"
          />
          <span class="scope scope-min">.0001</span>
          <span class="param">Q</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Source: https://codepen.io/gregh/pen/jyXMYY
  name: "EqualizerControls",
  props: ["initControls"],
  data() {
    return {
      filters: {
        HF: {
          freq: 0,
          gain: 0,
        },
        LF: {
          freq: 0,
          gain: 0,
        },
        HMF: {
          freq: 0,
          Q: 0,
        },
        LMF: {
          freq: 0,
          Q: 0,
        },
      },
    };
  },
  mounted() {
    this.filters = this.initControls;
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.equalizer {
  display: flex;
}

.section {
  display: flex;
  text-align: center;
  flex-direction: column;
  margin: 0 8px;
}

.title {
  line-height: 40px;
  font-size: 14px;
  /* color: #fff; */
  font-weight: 700;
}
.sliders {
  display: flex;
}

.range-slider {
  width: 32px;
  height: 164px;
  background-color: rgba(0, 0, 0, 0.62);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  padding-bottom: 8px;
  margin-left: 4px;
  margin-right: 4px;
  border-radius: 4px;
}

.param {
  color: #f7f7f7;
  font-size: 14px;
  line-height: 14px;
}
.scope {
  color: #f7f7f7;
  font-size: 12px;
  line-height: 12px;
}
.scope.scope-min {
  margin-top: 35px;
}
input[type="range"].vertical {
  transform: rotateZ(-90deg);
  width: 104px;
  margin-top: 44px;
}
</style>>
