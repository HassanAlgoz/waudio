<template>
  <main id="Player">
    <article class="container-fluid">
      <div class="row">
        <div class="col">
          <h1>Online Player</h1>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <select v-model="selectedAudioFile">
            <option v-for="file in audioFiles" :value="file" :key="file.title">
              {{ file.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <div
            class="canvas-container mx-auto"
            style="height: 196px"
            @click="seekThere"
            id="fullWaveformCanvas"
          >
            <!-- Full Audio Waveform Canvas -->
            <canvas ref="canvasL1" width="1024px" height="196"></canvas>
            <canvas ref="canvasL2" width="1024px" height="196"></canvas>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-center">
            <div
              id="frequencyCanvas"
              class="canvas-container"
              style="height: 128px"
            >
              <canvas ref="frequencyCanvas" width="768px" height="128"></canvas>
            </div>
            <div
              id="waveformCanvas"
              class="canvas-container"
              style="height: 128px"
            >
              <canvas ref="waveformCanvas" width="256px" height="128"></canvas>
            </div>
          </div>
        </div>
      </div>
    </article>
    <div class="container">
      <div class="row">
        <div class="col text-center">
          <audio :src="selectedAudioFile.path" ref="elAudio"></audio>
          <!-- @ended="isPlaying = false"
            @play="isPlaying = true"
            @playing="isPlaying = true"
            @pause="isPlaying = false" -->
          <button
            class="btn btn-primary mt-2"
            @click="
              () => {
                if (!isPlaying) {
                  play();
                } else {
                  pause();
                }
              }
            "
          >
            {{ isPlaying ? "Pause" : "Play" }}
          </button>
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="enableEffects"
              id="enableEffectsControl"
            />
            <label class="form-check-label" for="enableEffectsControl">
              Enable Effects
            </label>
          </div>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-6">
          <div>
            <h3>Compressor</h3>
            <CompressorControls :initControls="compressor" />
          </div>
        </div>
        <div class="col-6">
          <h3>Equalizer</h3>
          <EqualizerControls :initControls="filters" />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="form-group row">
            <div class="col-2">
              <label for="gainControl">Gain: {{ gain }}</label>
            </div>
            <div class="col">
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
      </div>
    </div>
  </main>
</template>

<script>
import { getMousePosition } from "../utils";
import EqualizerControls from "./EqualizerControls";
import CompressorControls from "./CompressorControls";
const AudioContext = window.AudioContext || window.webkitAudioContext;
export default {
  name: "Player",
  components: {
    EqualizerControls,
    CompressorControls,
  },
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
      audioBuffer: null,
      enableEffects: true,
      nodes: {},
      filters: {
        HF: {
          freq: 4700,
          gain: 50,
        },
        LF: {
          freq: 35,
          gain: 50,
        },
        HMF: {
          freq: 800,
          Q: 0.7,
        },
        LMF: {
          freq: 880,
          Q: 0.7,
        },
      },
      compressor: {
        threshold: -20,
        knee: 40,
        ratio: 3,
        attack: 0.02,
        release: 0.125,
      },
      gain: 1,
      isPlaying: false,
    };
  },
  created() {
    this.selectedAudioFile = this.audioFiles[0];
  },
  destroyed() {
    this.context.close();
  },
  async mounted() {
    this.context = new AudioContext();
    // Create Audio Graph Nodes
    this.nodes.source = this.context.createMediaElementSource(
      this.$refs.elAudio
    );
    this.nodes.effectsGate = this.context.createGain();
    this.nodes.compressor = this.context.createDynamicsCompressor();
    this.nodes.highShelf = this.context.createBiquadFilter();
    this.nodes.lowShelf = this.context.createBiquadFilter();
    this.nodes.highPass = this.context.createBiquadFilter();
    this.nodes.lowPass = this.context.createBiquadFilter();
    this.nodes.gain = this.context.createGain();
    this.nodes.outGate = this.context.createGain();
    this.nodes.analyserFrequencyData = this.context.createAnalyser();
    this.nodes.analyserTimeDomainData = this.context.createAnalyser();

    // Connect Graph Nodes
    this.nodes.source.connect(this.nodes.effectsGate);
    this.nodes.effectsGate.connect(this.nodes.compressor);
    this.nodes.compressor.connect(this.nodes.highShelf);
    this.nodes.highShelf.connect(this.nodes.lowShelf);
    this.nodes.lowShelf.connect(this.nodes.highPass);
    this.nodes.highPass.connect(this.nodes.lowPass);
    this.nodes.lowPass.connect(this.nodes.gain);
    this.nodes.gain.connect(this.nodes.outGate);
    this.nodes.outGate.connect(this.context.destination);
    this.nodes.outGate.connect(this.nodes.analyserTimeDomainData);
    this.nodes.outGate.connect(this.nodes.analyserFrequencyData);

    // Initialize Filters' Parameters
    this.nodes.highShelf.type = "highshelf";
    this.nodes.highShelf.frequency.value = 4700;
    this.nodes.highShelf.gain.value = 50;

    this.nodes.lowShelf.type = "lowshelf";
    this.nodes.lowShelf.frequency.value = 35;
    this.nodes.lowShelf.gain.value = 50;

    this.nodes.highPass.type = "highpass";
    this.nodes.highPass.frequency.value = 800;
    this.nodes.highPass.Q.value = 0.7;

    this.nodes.lowPass.type = "lowpass";
    this.nodes.lowPass.frequency.value = 880;
    this.nodes.lowPass.Q.value = 0.7;

    // Draw
    this.visualize();
  },
  methods: {
    seekThere(evt) {
      let { x } = getMousePosition(evt);
      this.mouseX = x;
      let w = this.$refs.canvasL1.width;
      let d = this.audioBuffer.duration;
      this.$refs.elAudio.currentTime = Math.floor((x / w) * d);
    },
    visualize() {
      const freqCanvasContext = this.$refs.frequencyCanvas.getContext("2d");
      const waveformCanvasContext = this.$refs.waveformCanvas.getContext("2d");

      // TimeDomain Data (Waveform)
      this.nodes.analyserTimeDomainData.fftSize = 2 ** 11;
      this.nodes.analyserTimeDomainData.smoothingTimeConstant = 0.8;
      let timeDomainDataArray = new Uint8Array(
        this.nodes.analyserTimeDomainData.frequencyBinCount
      );

      // Frequency Data (Frequency Bars)
      this.nodes.analyserFrequencyData.fftSize = 2 ** 8;
      this.nodes.analyserFrequencyData.smoothingTimeConstant = 0.8;
      let frequencyDataArray = new Uint8Array(
        this.nodes.analyserFrequencyData.frequencyBinCount
      );

      // Seek Line
      const ctxL2 = this.$refs.canvasL2.getContext("2d");
      const w = this.$refs.canvasL2.width;
      const h = this.$refs.canvasL2.height;
      const draw = () => {
        requestAnimationFrame(draw);
        if (this.audioBuffer && this.$refs.elAudio) {
          ctxL2.fillStyle = "rgb(200, 0, 0)";
          let x =
            (this.$refs.elAudio.currentTime / this.audioBuffer.duration) * w;
          ctxL2.clearRect(0, 0, w, h);
          ctxL2.fillRect(x, 0, 1, h);
        }
        // ---
        if (!this.isPlaying) return;

        this.nodes.analyserFrequencyData.getByteFrequencyData(
          frequencyDataArray
        );
        drawFrequencyBars(frequencyDataArray);

        this.nodes.analyserTimeDomainData.getByteTimeDomainData(
          timeDomainDataArray
        );
        drawWaveform(timeDomainDataArray);
      };
      draw();

      const drawWaveform = (dataArray) => {
        const WIDTH = waveformCanvasContext.canvas.width;
        const HEIGHT = waveformCanvasContext.canvas.height;
        waveformCanvasContext.clearRect(0, 0, WIDTH, HEIGHT);

        const sliceWidth = (WIDTH * 1.0) / dataArray.length;
        waveformCanvasContext.lineWidth = 2;
        waveformCanvasContext.strokeStyle = "rgb(0, 0, 0)";
        waveformCanvasContext.beginPath();
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          let v = dataArray[i] / 128;
          let y = (v * HEIGHT) / 2;

          if (i === 0) {
            waveformCanvasContext.moveTo(x, y);
          } else {
            waveformCanvasContext.lineTo(x, y);
          }

          x += sliceWidth;
        }
        waveformCanvasContext.lineTo(WIDTH, HEIGHT / 2);
        waveformCanvasContext.stroke();
      };

      const drawFrequencyBars = (dataArray) => {
        const WIDTH = freqCanvasContext.canvas.width;
        const HEIGHT = freqCanvasContext.canvas.height;
        freqCanvasContext.clearRect(0, 0, WIDTH, HEIGHT);
        const barWidth = 2.5 * (WIDTH / dataArray.length);
        freqCanvasContext.lineWidth = 2;
        freqCanvasContext.strokeStyle = "rgb(0, 0, 0)";
        freqCanvasContext.beginPath();
        let x = 0;
        let barHeight = 0;
        for (let i = 0; i < dataArray.length; i++) {
          barHeight = dataArray[i];

          freqCanvasContext.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
          freqCanvasContext.fillRect(
            x,
            HEIGHT - barHeight / 2,
            barWidth,
            barHeight
          );

          x += barWidth + 1;
        }
        freqCanvasContext.stroke();
      };
    },
    drawFullWaveform() {
      const canvasCtx = this.$refs.canvasL1.getContext("2d");
      const WIDTH = canvasCtx.canvas.width;
      const HEIGHT = canvasCtx.canvas.height;

      // clear canvas
      canvasCtx.fillStyle = "rgb(255, 255, 255)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      function getBins(audioBuffer) {
        const data = audioBuffer;
        const binCount = 2048;
        const blockSize = Math.floor(data.length / binCount);
        const bins = [];
        for (let i = 0; i < binCount; i++) {
          const avg =
            data
              .slice(i * blockSize, (i + 1) * blockSize)
              .reduce((a, b) => a + Math.abs(b), 0) / blockSize;
          bins.push(avg);
        }
        return bins;
      }
      const bins = getBins(this.audioBuffer.getChannelData(0));

      canvasCtx.fillStyle = "rgb(0, 196, 0)";

      let min = 1.0;
      let max = -1.0;
      for (let bin of bins) {
        if (bin < min) {
          min = bin;
        }
        if (bin > max) {
          max = bin;
        }
      }
      const absMax = Math.max(min, max);
      const binWidth = WIDTH / bins.length;
      const y = HEIGHT / 2;
      for (let i = 0; i < bins.length; i++) {
        const binHeight = ((bins[i] / absMax) * HEIGHT) / 2;
        const x = i * binWidth;
        canvasCtx.fillRect(x, y, binWidth, -binHeight);
        canvasCtx.fillRect(x, y, binWidth, binHeight);
      }
    },
    play() {
      // check if context is in suspended state (autoplay policy)
      if (this.context.state === "suspended") {
        this.context.resume();
      }
      this.$refs.elAudio.play();
      this.isPlaying = true;
    },
    pause() {
      this.$refs.elAudio.pause();
      this.isPlaying = false;
    },
  },
  watch: {
    selectedAudioFile: {
      handler: async function (val) {
        if (this.isPlaying) {
          this.pause();
        }
        const response = await fetch(val.path);
        const audioData = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(audioData);
        this.audioBuffer = audioBuffer;
        this.drawFullWaveform();
      },
    },
    enableEffects: {
      handler: function (yes) {
        if (yes) {
          this.nodes.source.disconnect();
          this.nodes.source.connect(this.nodes.effectsGate);
          this.nodes.gain.connect(this.nodes.outGate);
        } else {
          this.nodes.source.disconnect();
          this.nodes.gain.disconnect();
          this.nodes.source.connect(this.nodes.outGate);
        }
      },
    },
    gain: function (val) {
      this.nodes.gain.gain.value = val;
    },
    "filters.HF.freq": function (val) {
      this.nodes.highShelf.frequency.value = val;
    },
    "filters.HF.gain": function (val) {
      this.nodes.highShelf.gain.value = val;
    },
    "filters.LF.freq": function (val) {
      this.nodes.lowShelf.frequency.value = val;
    },
    "filters.LF.gain": function (val) {
      this.nodes.lowShelf.gain.value = val;
    },
    "filters.HMF.freq": function (val) {
      this.nodes.highPass.frequency.value = val;
    },
    "filters.HMF.Q": function (val) {
      this.nodes.highPass.Q.value = val;
    },
    "filters.LMF.freq": function (val) {
      this.nodes.lowPass.frequency.value = val;
    },
    "filters.LMF.Q": function (val) {
      this.nodes.lowPass.Q.value = val;
    },
    "compressor.threshold": function (val) {
      this.nodes.compressor.threshold.value = val;
    },
    "compressor.knee": function (val) {
      this.nodes.compressor.knee.value = val;
    },
    "compressor.ratio": function (val) {
      this.nodes.compressor.ratio.value = val;
    },
    "compressor.attack": function (val) {
      this.nodes.compressor.attack.value = val;
    },
    "compressor.release": function (val) {
      this.nodes.compressor.release.value = val;
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
.tab-content {
  min-height: calc(264px + 16px);
}

.canvas-container {
  position: relative;
  border: 1px dotted lightgray;
}
#fullWaveformCanvas,
#fullWaveformCanvas canvas {
  width: 1024px;
}
#frequencyCanvas,
#frequencyCanvas canvas {
  width: 768px;
}
#waveformCanvas,
#waveformCanvas canvas {
  width: 256px;
}

.canvas-container canvas {
  position: absolute;
  background-color: transparent;
  left: 0;
  top: 0;
}
</style>


