<template>
  <div class="compressor">
    <div class="form-group row">
      <div class="col-2">
        <label for="thresholdControl">Threshold:</label>
      </div>
      <div class="col">
        <input
          type="range"
          class="custom-range"
          id="thresholdControl"
          min="-100"
          max="0"
          step="1"
          v-model.number="compressor.threshold"
        />
      </div>
      <div class="col-1">
        <span>{{ compressor.threshold }}</span>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-2">
        <label for="kneeControl">Knee:</label>
      </div>
      <div class="col">
        <input
          type="range"
          class="custom-range"
          id="kneeControl"
          min="0"
          max="40"
          step="1"
          v-model.number="compressor.knee"
        />
      </div>
      <div class="col-1">
        <span>{{ compressor.knee }}</span>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-2">
        <label for="ratioControl">Ratio:</label>
      </div>
      <div class="col">
        <input
          type="range"
          class="custom-range"
          id="ratioControl"
          min="1"
          max="20"
          step="0.1"
          v-model.number="compressor.ratio"
        />
      </div>
      <div class="col-1">
        <span>{{ compressor.ratio }}</span>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-2">
        <label for="attackControl">Attack Time:</label>
      </div>
      <div class="col">
        <input
          type="range"
          class="custom-range"
          id="attackControl"
          min="0"
          max="1"
          step="0.01"
          v-model.number="compressor.attack"
        />
      </div>
      <div class="col-1">
        <span>{{ compressor.attack }}</span>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-2">
        <label for="releaseControl">Release Time:</label>
      </div>
      <div class="col">
        <input
          type="range"
          class="custom-range"
          id="releaseControl"
          min="0"
          max="1"
          step="0.01"
          v-model.number="compressor.release"
        />
      </div>
      <div class="col-1">
        <span>{{ compressor.release }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EqualizerControls",
  props: ["initControls"],
  data() {
    return {
      compressor: {},
    };
  },
  mounted() {
    this.compressor = this.initControls;
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>>
