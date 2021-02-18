<template>
  <main class="home">
    <article class="container">
      <div class="row">
        <div class="col">
          <h1>Boombox</h1>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <canvas ref="waveformCanvas" width="800px" height="300px"></canvas>
          <canvas ref="frequencyCanvas" width="800px" height="100px"></canvas>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <audio
            :src="selectedAudioFile.path"
            ref="elAudio"
            controls
            @ended="isPlaying = false"
            @play="isPlaying = true"
            @playing="isPlaying = true"
            @pause="isPlaying = false"
          ></audio>
          <button @click="togglePlay">
            {{ isPlaying ? "Pause" : "Play" }}
          </button>
        </div>
        <div class="col" v-if="nodes.compressor">
          <h3>Compressor</h3>
          <div class="form-group form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="isCompressorConnectedControl"
              v-model="isCompressorConnected"
            />
            <label class="form-check-label" for="isCompressorConnectedControl">Connect</label>
          </div>
          <div class="form-group">
            <label for="thresholdControl">Threshold:</label>
            <input
              type="range"
              id="thresholdControl"
              min="-100"
              max="0"
              step="1"
              v-model="nodes.compressor.threshold.value"
            />
          </div>
          <div class="form-group">
            <label for="kneeControl">Knee:</label>
            <input
              type="range"
              id="kneeControl"
              min="0"
              max="40"
              step="1"
              v-model="nodes.compressor.knee.value"
            />
          </div>
          <div class="form-group">
            <label for="ratioControl">Ratio:</label>
            <input
              type="range"
              id="ratioControl"
              min="1"
              max="20"
              step="0.1"
              v-model="nodes.compressor.ratio.value"
            />
          </div>
          <div class="form-group">
            <label for="attackControl">Attack Time:</label>
            <input
              type="range"
              id="attackControl"
              min="0"
              max="1"
              step="0.01"
              v-model="nodes.compressor.attack.value"
            />
          </div>
          <div class="form-group">
            <label for="releaseControl">Release Time:</label>
            <input
              type="range"
              id="releaseControl"
              min="0"
              max="1"
              step="0.01"
              v-model="nodes.compressor.release.value"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-1">
          <div class="form-group">
            <div class="vertical-slider-wrapper">
              <label for="gainControl">Gain: {{ gain }}</label>
              <input
                type="range"
                v-model="gain"
                min="0"
                max="2"
                step="0.01"
                class="custom-range"
                id="gainControl"
              />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="panControl">Pan: {{ pan }}</label>

            <input
              type="range"
              v-model="pan"
              min="-1"
              max="1"
              step="0.01"
              class="custom-range"
              id="panControl"
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      <div class="row">
        <div class="col">
          <select v-model="selectedAudioFile">
            <option v-for="file in audioFiles" :value="file" :key="file.title">
              {{ file.title }}
            </option>
          </select>
        </div>
      </div>
    </article>
  </main>
</template>

<script>
const AudioContext = window.AudioContext || window.webkitAudioContext;
export default {
  name: "Home",
  data() {
    return {
      audioFiles: [
        {
          title: "(5m clip) Meeting - 2 Mics spread at the center",
          path: "/samples/ee.columbia.edu/pzm12.wav",
          desc:
            "contains the first two of the PZM microphones that were spaced along the center of the table. These two were among all the participants and have the strongest signal. They were about 3 foot apart.",
        },
        {
          title: "(1m clip) Meeting - 1 Mic in center",
          path: "/samples/ee.columbia.edu/shatr78m3.wav",
          desc:
            "contains the first two of the PZM microphones that were spaced along the center of the table. These two were among all the participants and have the strongest signal. They were about 3 foot apart.",
        },
        {
          title: "test test",
          path: "/samples/test.wav",
        },
      ],
      selectedAudioFile: {},
      context: null,
      nodes: {
        source: null,
        gain: null,
        stereoPanner: null,
        analyserTimeDomainData: null,
        analyserFrequencyData: null,
        compressor: null,
      },
      gain: 1,
      pan: 0,
      isPlaying: false,
      isCompressorConnected: true,
    };
  },
  created() {
    this.selectedAudioFile = this.audioFiles[0];
  },
  mounted() {
    // 1. Create Audio Graph
    this.context = new AudioContext();
    // 1.1 Create Nodes
    this.nodes.source = this.context.createMediaElementSource(
      this.$refs.elAudio
    );
    this.nodes.gain = this.context.createGain();
    // Stereo Panner
    this.nodes.stereoPanner = this.context.createStereoPanner({ pan: 0 });
    // Analyzer
    this.nodes.analyserTimeDomainData = this.context.createAnalyser();
    this.nodes.analyserFrequencyData = this.context.createAnalyser();
    // Compressor
    this.nodes.compressor = this.context.createDynamicsCompressor();
    this.nodes.compressor.threshold.value = -20;
    this.nodes.compressor.knee.value = 40;
    this.nodes.compressor.ratio.value = 3;
    this.nodes.compressor.attack.value = 0.02;
    this.nodes.compressor.release.value = 0.125;
    // 1.2 Connect Nodes
    this.nodes.source
      .connect(this.nodes.compressor)
      .connect(this.nodes.gain)
      .connect(this.nodes.stereoPanner)
      .connect(this.nodes.analyserTimeDomainData)
      .connect(this.nodes.analyserFrequencyData)
      .connect(this.context.destination)
    // Draw
    this.visualizeWaveform();
    this.visualizeFrequencyBarGraph();
  },
  methods: {
    togglePlay() {
      // check if context is in suspended state (autoplay policy)
      if (this.isPlaying === false) {
        this.$refs.elAudio.play();
      } else {
        this.$refs.elAudio.pause();
      }
    },
    visualizeWaveform() {
      const canvasCtx = this.$refs.waveformCanvas.getContext("2d");
      const WIDTH = canvasCtx.canvas.width;
      const HEIGHT = canvasCtx.canvas.height;

      this.nodes.analyserTimeDomainData.fftSize = 2048; // ( 2^11 );
      let bufferLength = this.nodes.analyserTimeDomainData.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);

      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      const drawWaveform = () => {
        requestAnimationFrame(drawWaveform);
        if (!this.isPlaying) return;
        this.nodes.analyserTimeDomainData.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        canvasCtx.beginPath();

        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = (v * HEIGHT) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
      };
      drawWaveform();
    },
    visualizeFrequencyBarGraph() {
      const canvasCtx = this.$refs.frequencyCanvas.getContext("2d");
      const WIDTH = canvasCtx.canvas.width;
      const HEIGHT = canvasCtx.canvas.height;

      this.nodes.analyserFrequencyData.fftSize = 256; // (2 ^ 8);
      let bufferLength = this.nodes.analyserFrequencyData.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);

      const barWidth = 2.5 * (WIDTH / bufferLength);
      const drawFrequencyBarGraph = () => {
        requestAnimationFrame(drawFrequencyBarGraph);
        if (!this.isPlaying) return;
        this.nodes.analyserFrequencyData.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = "rgb(0, 0, 0)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        canvasCtx.beginPath();

        let x = 0;
        let barHeight = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;

          canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
          canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

          x += barWidth + 1;
        }

        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
      };
      drawFrequencyBarGraph();
    },
  },
  watch: {
    isPlaying: function (val) {
      if (val && this.context.state === "suspended") {
        this.context.resume();
      }
    },
    gain: function (val) {
      this.nodes.gain.gain.value = val;
    },
    pan: function (val) {
      this.nodes.stereoPanner.pan.value = val;
    },
    isCompressorConnected: function (yes) {
      if (yes) {
        this.nodes.source.disconnect(this.nodes.gain)
        this.nodes.source.connect(this.nodes.compressor);
      } else {
        this.nodes.source.disconnect(this.nodes.compressor);
        this.nodes.source.connect(this.nodes.gain)
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vertical-slider-wrapper {
  display: inline-block;
  width: 20px;
  height: 150px;
  padding: 0;
}
.vertical-slider-wrapper input {
  width: 150px;
  height: 20px;
  margin: 0;
  transform-origin: 75px 75px;
  transform: rotate(-90deg);
}
canvas {
  border: 4px solid black;
}
</style>
