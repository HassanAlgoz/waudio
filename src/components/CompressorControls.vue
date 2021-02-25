<template>
  <div class="compressor">
    <table class="table table-sm">
      <thead></thead>
      <tbody>
        <tr>
          <th>Threshold</th>
          <td>{{ compressor.threshold }}</td>
          <td>
            <input
              type="range"
              id="thresholdControl"
              min="-100"
              max="0"
              step="1"
              v-model.number="compressor.threshold"
            />
          </td>
        </tr>
        <tr>
          <th>Knee</th>
          <td>{{ compressor.knee }}</td>
          <td>
            <input
              type="range"
              id="kneeControl"
              min="0"
              max="40"
              step="1"
              v-model.number="compressor.knee"
            />
          </td>
        </tr>
        <tr>
          <th>Ratio</th>
          <td>1:{{ compressor.ratio }}</td>
          <td>
            <input
              type="range"
              id="ratioControl"
              min="1"
              max="20"
              step="1"
              v-model.number="compressor.ratio"
            />
          </td>
        </tr>
        <tr>
          <th>Attack</th>
          <td>{{ compressor.attack }}</td>
          <td>
            <input
              type="range"
              id="attackControl"
              min="0"
              max="1"
              step="0.01"
              v-model.number="compressor.attack"
            />
          </td>
        </tr>
        <tr>
          <th>Release</th>
          <td>{{ compressor.release }}</td>
          <td>
            <input
              type="range"
              id="releaseControl"
              min="0"
              max="1"
              step="0.01"
              v-model.number="compressor.release"
            />
          </td>
        </tr>
        <tr>
          <th>Gain</th>
          <td>{{ compressor.gain }}</td>
          <td>
            <input
              type="range"
              v-model="compressor.gain"
              min="0"
              max="2"
              step="0.1"
            />
          </td>
        </tr>
      </tbody>
    </table>
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
th,
td {
  border: none;
}
table tr th {
  width: 4em;
}
table tr td:nth-child(2) {
  width: 2em;
}
</style>>
