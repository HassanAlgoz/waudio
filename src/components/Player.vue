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
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-6">
          <div v-if="nodes.compressor">
            <h3>Compressor</h3>
            <div class="form-group form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="isCompressorConnectedControl"
                v-model="isCompressorConnected"
              />
              <label class="form-check-label" for="isCompressorConnectedControl"
                >Connect</label
              >
            </div>
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
                  v-model="threshold"
                />
              </div>
              <div class="col-1">
                <span>{{ threshold }}</span>
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
                  v-model="knee"
                />
              </div>
              <div class="col-1">
                <span>{{ knee }}</span>
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
                  v-model="ratio"
                />
              </div>
              <div class="col-1">
                <span>{{ ratio }}</span>
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
                  v-model="attack"
                />
              </div>
              <div class="col-1">
                <span>{{ attack }}</span>
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
                  v-model="release"
                />
              </div>
              <div class="col-1">
                <span>{{ release }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <h3>Filter</h3>
          <div class="row">
            <div class="col">
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isBiquadFilterConnectedControl"
                  v-model="isBiquadFilterConnected"
                />
                <label
                  class="form-check-label"
                  for="isBiquadFilterConnectedControl"
                  >Connect</label
                >
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-2">
              <label for="biquadFilterTypeControl">Type</label>
            </div>
            <div class="col">
              <select
                v-model="biquadFilterType"
                class="custom-select"
                id="biquadFilterTypeControl"
              >
                <option value="lowpass">Low-pass</option>
                <option value="highpass">High-pass</option>
                <option value="bandpass">Band-pass</option>
                <option value="lowshelf">Low-shelf</option>
                <option value="highhself">High-shelf</option>
                <option value="peaking">Peaking</option>
                <option value="notch">Notch</option>
                <option value="allpass">All-pass</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group row">
              <div class="col-2">
                <label for="biquadFilterFrequencyControl">Frequency:</label>
              </div>
              <div class="col">
                <input
                  type="number"
                  v-model="biquadFilterFrequency"
                  min="0"
                  max="9000"
                  step="10"
                  id="biquadFilterFrequencyControl"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group row">
              <div class="col-2">
                <label for="biquadFilterQControl">Q:</label>
              </div>
              <div class="col">
                <input
                  type="number"
                  v-model="biquadFilterQ"
                  min="0"
                  max="10"
                  step="0.25"
                  id="biquadFilterQControl"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group row">
              <div class="col-2">
                <label for="biquadFilterGainControl">Gain:</label>
              </div>
              <div class="col">
                <input
                  type="number"
                  v-model="biquadFilterGain"
                  min="0"
                  max="2"
                  step="0.1"
                  id="biquadFilterGainControl"
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="form-group row">
            <div class="col-2">
              <label for="panControl">Pan: {{ pan }}</label>
            </div>
            <div class="col">
              <input
                type="range"
                v-model="pan"
                min="-1"
                max="1"
                step="0.1"
                class="custom-range"
                id="panControl"
              />
            </div>
          </div>
        </div>
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
const AudioContext = window.AudioContext || window.webkitAudioContext;
export default {
  name: "Player",
  components: {},
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
      nodes: {
        source: null,
        // noiseGate: null,
        compressor: null,
        gain: null,
        stereoPanner: null,
        analyserTimeDomainData: null,
        analyserFrequencyData: null,
        biquadFilter: null,
      },
      gain: 1,
      pan: 0,
      isPlaying: false,
      isCompressorConnected: false,
      isBiquadFilterConnected: false,
      threshold: -20,
      knee: 40,
      ratio: 3,
      attack: 0.02,
      release: 0.125,
      // noiseGateThreshold: 0.005,
      graph: {
        source: ["compressor"],
        // noiseGate: ["compressor"],
        compressor: ["biquadFilter"],
        biquadFilter: ["gain"],
        gain: [
          "stereoPanner",
          "analyserTimeDomainData",
          "analyserFrequencyData",
        ],
        stereoPanner: ["OUT"],
      },
      biquadFilterType: "lowpass",
      biquadFilterFrequency: 1000,
      biquadFilterQ: 1.0,
      biquadFilterGain: 1.0,
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
    this.nodes.gain = this.context.createGain();
    this.nodes.stereoPanner = this.context.createStereoPanner({ pan: 0 });
    this.nodes.analyserTimeDomainData = this.context.createAnalyser();
    this.nodes.analyserFrequencyData = this.context.createAnalyser();
    this.nodes.compressor = this.context.createDynamicsCompressor();
    this.nodes.biquadFilter = this.context.createBiquadFilter();
    // await this.context.audioWorklet.addModule("/noise-gate.js");
    // this.nodes.noiseGate = new AudioWorkletNode(this.context, "noise-gate", {
    //   parameterData: {
    //     threshold: new Float32Array([this.noiseGateThreshold]),
    //   },
    // });
    this.nodes.source = this.context.createMediaElementSource(
      this.$refs.elAudio
    );
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
    updateGraph() {
      for (const [nodeKey, destinations] of Object.entries(this.graph)) {
        const node = this.nodes[nodeKey];
        if (!node) {
          setTimeout(() => {
            // retry
            this.updateGraph();
          }, 100);
          return;
        }
        node.disconnect();
        for (const dest of destinations) {
          if (dest !== "OUT") {
            node.connect(this.nodes[dest]);
          } else {
            node.connect(this.context.destination);
          }
        }
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
        this.updateGraph();
      },
    },
    gain: function (val) {
      this.nodes.gain.gain.value = val;
    },
    pan: function (val) {
      this.nodes.stereoPanner.pan.value = val;
    },
    threshold: function (val) {
      this.nodes.compressor.threshold.value = val;
    },
    knee: function (val) {
      this.nodes.compressor.knee.value = val;
    },
    ratio: function (val) {
      this.nodes.compressor.ratio.value = val;
    },
    attack: function (val) {
      this.nodes.compressor.attack.value = val;
    },
    release: function (val) {
      this.nodes.compressor.release.value = val;
    },
    // noiseGateThreshold: function (val) {
    //   this.nodes.noiseGate.parameters
    //     .get("threshold")
    //     .setValueAtTime(val, this.context.currentTime);
    // },
    graph: {
      deep: true,
      handler: function () {
        this.updateGraph();
      },
    },
    isCompressorConnected: {
      immediate: true,
      handler: function (yes) {
        if (!this.graph.source) {
          setTimeout(() => {
            this.isCompressorConnected = yes;
          }, 100);
          return;
        }
        if (yes) {
          this.graph.source = ["compressor"];
          if (this.isBiquadFilterConnected) {
            this.graph.compressor = ["biquadFilter"];
          } else {
            this.graph.compressor = ["gain"];
          }
        } else {
          if (this.isBiquadFilterConnected) {
            this.graph.source = ["biquadFilter"];
          } else {
            this.graph.source = ["gain"];
          }
        }
      },
    },
    isBiquadFilterConnected: {
      immediate: true,
      handler: function (yes) {
        // assumes it is connected to the compressor
        if (!this.graph.source) {
          setTimeout(() => {
            this.isBiquadFilterConnected = yes;
          }, 100);
          return;
        }
        if (yes) {
          this.graph.biquadFilter = ["gain"];
          if (this.isCompressorConnected) {
            this.graph.compressor = ["biquadFilter"];
          } else {
            this.graph.source = ["biquadFilter"];
          }
        } else {
          if (this.isCompressorConnected) {
            this.graph.compressor = ["gain"];
          } else {
            this.graph.source = ["gain"];
          }
        }
      },
    },
    biquadFilterType: function (type) {
      if (
        ![
          "lowpass",
          "highpass",
          "passband",
          "lowshelf",
          "highshelf",
          "peaking",
          "notch",
          "allpass",
        ].includes(type)
      ) {
        console.log("biquadFilter type cannot be:", type);
        return;
      }
      this.nodes.biquadFilter.type = type;
    },
    biquadFilterQ: function (val) {
      this.nodes.biquadFilter.Q.value = val;
    },
    biquadFilterGain: function (val) {
      this.nodes.biquadFilter.gain.value = val;
    },
    biquadFilterFrequency: function (val) {
      this.nodes.biquadFilter.frequency.value = val;
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
