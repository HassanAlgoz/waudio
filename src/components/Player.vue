<template>
  <main class="home">
    <article class="container">
      <div class="row">
        <div class="col">
          <h1>Player</h1>
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
          <canvas
            ref="waveformCanvas"
            width="800px"
            height="300px"
            @click="seekThere"
          ></canvas>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <canvas ref="frequencyCanvas" width="800px" height="200px"></canvas>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <!-- <audio
            :src="selectedAudioFile.path"
            ref="elAudio"
            @ended="isPlaying = false"
            @play="isPlaying = true"
            @playing="isPlaying = true"
            @pause="isPlaying = false"
            style="width: 100%"
          ></audio> -->
          <button @click="isPlaying = !isPlaying">
            {{ isPlaying ? "Pause" : "Play" }}
          </button>
        </div>
      </div>

      <!-- #region Effects Tabs -->
      <div class="row">
        <div class="col">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <a
                class="nav-link active"
                id="compressor-tab"
                data-toggle="tab"
                href="#compressor"
                role="tab"
                aria-controls="compressor"
                aria-selected="true"
                >Compressor</a
              >
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                id="noisegate-tab"
                data-toggle="tab"
                href="#noisegate"
                role="tab"
                aria-controls="noisegate"
                aria-selected="false"
                >Noise Gate</a
              >
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                id="pan-tab"
                data-toggle="tab"
                href="#pan"
                role="tab"
                aria-controls="pan"
                aria-selected="false"
                >Pan</a
              >
            </li>
          </ul>
          <div class="tab-content" id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="compressor"
              role="tabpanel"
              aria-labelledby="compressor-tab"
            >
              <div v-if="nodes.compressor">
                <div class="form-group form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="isCompressorConnectedControl"
                    v-model="isCompressorConnected"
                  />
                  <label
                    class="form-check-label"
                    for="isCompressorConnectedControl"
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
            <div
              class="tab-pane fade"
              id="noisegate"
              role="tabpanel"
              aria-labelledby="noisegate-tab"
            >
              <div class="form-group row">
                <div class="col-3">
                  <label for="noiseGateThresholdControl">Threshold:</label>
                </div>
                <div class="col">
                  <input
                    type="range"
                    class="custom-range"
                    id="noiseGateThresholdControl"
                    min="0"
                    max="0.01"
                    step="0.0001"
                    v-model="noiseGateThreshold"
                  />
                </div>
                <div class="col-1">
                  <span>{{ noiseGateThreshold }}</span>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pan"
              role="tabpanel"
              aria-labelledby="pan-tab"
            >
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
          </div>
        </div>
      </div>
      <!-- #endregion -->
    </article>
  </main>
</template>

<script>
import { getMousePosition } from "../utils";
const AudioContext = window.AudioContext || window.webkitAudioContext;
export default {
  name: "Home",
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
      nodes: {
        source: null,
        noiseGate: null,
        compressor: null,
        gain: null,
        stereoPanner: null,
        analyserTimeDomainData: null,
        analyserFrequencyData: null,
      },
      gain: 1,
      pan: 0,
      isPlaying: false,
      isCompressorConnected: true,
      threshold: -20,
      knee: 40,
      ratio: 3,
      attack: 0.02,
      release: 0.125,
      noiseGateThreshold: 0.005,
      graph: {
        source: ["compressor"],
        // noiseGate: ["compressor"],
        compressor: ["gain"],
        gain: [
          "stereoPanner",
          "analyserTimeDomainData",
          "analyserFrequencyData",
        ],
        stereoPanner: ["OUT"],
      },
      mouseX: 0,
      mouseY: 0,
      seek: 0,
    };
  },
  created() {
    this.selectedAudioFile = this.audioFiles[0];
  },
  destroyed() {
    this.context.close();
  },
  async mounted() {
    // 1. Create Audio Graph
    this.context = new AudioContext();
    await this.context.audioWorklet.addModule("/noise-gate.js");
    // 1.3 Create Nodes
    // this.nodes.source = this.context.createMediaElementSource(
    //   this.$refs.elAudio
    // );
    this.nodes.gain = this.context.createGain();
    // Stereo Panner
    this.nodes.stereoPanner = this.context.createStereoPanner({ pan: 0 });
    // Analyzer
    this.nodes.analyserTimeDomainData = this.context.createAnalyser();
    this.nodes.analyserFrequencyData = this.context.createAnalyser();
    // Compressor
    this.nodes.compressor = this.context.createDynamicsCompressor();
    // Noise Gate
    this.nodes.noiseGate = new AudioWorkletNode(this.context, "noise-gate", {
      parameterData: {
        threshold: new Float32Array([this.noiseGateThreshold]),
      },
    });
    // Draw
    this.visualize();
  },
  methods: {
    seekThere(evt) {
      let { x, y } = getMousePosition(evt);
      this.mouseX = x;
      this.mouseY = y;
      let width = this.$refs.waveformCanvas.width;
      // let height = this.$refs.waveformCanvas.height;
      const offset = (x / width) * this.nodes.source.buffer.duration;
      this.seek = offset;
      if (this.isPlaying) {
        this.isPlaying = false;
        setTimeout(() => {
          this.isPlaying = true;
        }, 0);
      }
    },
    visualize() {
      const freqCanvasContext = this.$refs.frequencyCanvas.getContext("2d");
      const WIDTH = freqCanvasContext.canvas.width;
      const HEIGHT = freqCanvasContext.canvas.height;

      // TimeDomain Data (Waveform)
      this.nodes.analyserTimeDomainData.fftSize = 2 ** 11;
      this.nodes.analyserTimeDomainData.smoothingTimeConstant = 0.8;
      let timeDomainDataBufferLength = this.nodes.analyserTimeDomainData
        .frequencyBinCount;
      let timeDomainDataArray = new Uint8Array(timeDomainDataBufferLength);
      const sliceWidth = (WIDTH * 1.0) / timeDomainDataBufferLength;

      // Frequency Data (Frequency Bars)
      this.nodes.analyserFrequencyData.fftSize = 2 ** 8;
      this.nodes.analyserFrequencyData.smoothingTimeConstant = 0.8;
      let frequencyDataBufferLength = this.nodes.analyserFrequencyData
        .frequencyBinCount;
      let frequencyDataArray = new Uint8Array(frequencyDataBufferLength);
      const barWidth = 2.5 * (WIDTH / frequencyDataBufferLength);

      // Seek Line
      const waveformCanvasContext = this.$refs.waveformCanvas.getContext("2d");
      // const w = waveformCanvasContext.canvas.width;
      const h = this.$refs.waveformCanvas.height;

      const draw = () => {
        requestAnimationFrame(draw);
        waveformCanvasContext.fillRect(this.seek, 0, 1, h);
        // ---
        if (!this.isPlaying) return;

        // Clear Frequency canvas
        freqCanvasContext.fillStyle = "rgb(200, 200, 200)";
        freqCanvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        this.nodes.analyserFrequencyData.getByteFrequencyData(
          frequencyDataArray
        );
        drawFrequencyBars(frequencyDataArray, barWidth);

        this.nodes.analyserTimeDomainData.getByteTimeDomainData(
          timeDomainDataArray
        );
        drawWaveform(timeDomainDataArray, sliceWidth);
      };
      draw();

      const drawWaveform = (dataArray, sliceWidth) => {
        freqCanvasContext.lineWidth = 2;
        freqCanvasContext.strokeStyle = "rgb(0, 0, 0)";
        freqCanvasContext.beginPath();
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          let v = dataArray[i] / 128.0;
          let y = (v * HEIGHT) / 2;

          if (i === 0) {
            freqCanvasContext.moveTo(x, y);
          } else {
            freqCanvasContext.lineTo(x, y);
          }

          x += sliceWidth;
        }
        freqCanvasContext.lineTo(WIDTH, HEIGHT / 2);
        freqCanvasContext.stroke();
      };

      const drawFrequencyBars = (dataArray, barWidth) => {
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
      const canvasCtx = this.$refs.waveformCanvas.getContext("2d");
      const WIDTH = canvasCtx.canvas.width;
      const HEIGHT = canvasCtx.canvas.height;

      const data = this.nodes.source.buffer.getChannelData(0);
      const step = Math.ceil(data.length / WIDTH);
      const amp = HEIGHT / 2;
      for (let i = 0; i < WIDTH; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          let datum = data[i * step + j];
          if (datum < min) {
            min = datum;
          }
          if (datum > max) {
            max = datum;
          }
        }
        canvasCtx.fillRect(
          i,
          (1 + min) * amp,
          1,
          Math.max(1, (max - min) * amp)
        );
      }
    },
    updateGraph() {
      for (const [nodeKey, destinations] of Object.entries(this.graph)) {
        const node = this.nodes[nodeKey];
        node.disconnect();
        for (const dest of destinations) {
          if (dest !== "OUT") {
            node.connect(this.nodes[dest]);
          } else {
            node.connect(this.context.destination);
          }
        }
      }
      console.log("graph:", this.graph);
    },
  },
  watch: {
    selectedAudioFile: {
      handler: async function (val) {
        const response = await fetch(val.path);
        const audioData = await response.arrayBuffer();
        const buffer = await this.context.decodeAudioData(audioData);
        this.nodes.source = this.context.createBufferSource();
        this.nodes.source.buffer = buffer;
        console.log("source.buffer", this.nodes.source.buffer);
        this.drawFullWaveform();
        this.updateGraph();
      },
    },
    isPlaying: function (yes) {
      console.log("context.currentTime", this.context.currentTime);
      if (yes && this.context.state === "suspended") {
        this.context.resume();
      }

      // check if context is in suspended state (autoplay policy)
      if (yes) {
        const source = this.context.createBufferSource();
        const buffer = this.nodes.source.buffer;
        this.nodes.source.disconnect();
        this.nodes.source = source;
        this.nodes.source.buffer = buffer;
        this.updateGraph();
        this.nodes.source.start(0, this.seek);
        this.nodes.source.addEventListener("ended", () => {
          this.seek = this.context.currentTime;
        });
      } else {
        this.nodes.source.stop(0);
      }
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
    noiseGateThreshold: function (val) {
      this.nodes.noiseGate.parameters
        .get("threshold")
        .setValueAtTime(val, this.context.currentTime);
    },
    graph: {
      deep: true,
      handler: function () {
        this.updateGraph();
      },
    },
    isCompressorConnected: function (yes) {
      if (yes) {
        this.graph.source = ["compressor"];
      } else {
        this.graph.source = this.graph.compressor;
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
