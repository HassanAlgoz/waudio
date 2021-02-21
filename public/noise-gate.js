class NoiseGateProcessor extends AudioWorkletProcessor {

    static get parameterDescriptors() {
        return [
            {
                name: 'threshold',
                defaultValue: 0,
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },
            {
                name: 'attack',
                defaultValue: 0.02,
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },
            {
                name: 'release',
                defaultValue: 0.125,
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },
        ];
    }

    constructor() {
        super()
        this.phase = 'none'
    }

    process(inputs, outputs, parameters) {

        const sourceLimit = Math.min(inputs.length, outputs.length);

        for (let inputNum = 0; inputNum < sourceLimit; inputNum++) {
            let input = inputs[inputNum];
            let output = outputs[inputNum];
            let channelCount = Math.min(input.length, output.length);

            for (let channelNum = 0; channelNum < channelCount; channelNum++) {
                let sampleCount = input[channelNum].length;

                for (let i = 0; i < sampleCount; i++) {
                    let t1;
                    let sample = input[channelNum][i];
                    // if (Math.abs(sample) < parameters['threshold'][0]) {
                    //     sample = 0;
                    // }
                    // /* Manipulate the sample */
                    if (Math.abs(sample) < parameters['threshold'][0] && this.phase === 'none') {
                        this.phase = 'attack'
                        t1 = currentTime;
                        console.log('attack')
                    }
                    if (Math.abs(currentTime - t1) >= parameters['attack'][0] && this.phase === 'attack') {
                        this.phase = 'release'
                        t1 = currentTime;
                        console.log('release')
                    }
                    if (Math.abs(currentTime - t1) >= parameters['release'][0] && this.phase === 'release') {
                        this.phase = 'none';
                        console.log('none')
                    }

                    if (this.phase === 'release' || this.phase === 'attack') {
                        sample = 0;
                    }

                    output[channelNum][i] = sample;
                }
            }
        }
        return true
    }
}

registerProcessor('noise-gate', NoiseGateProcessor)