var AudioAnalyser = /** @class */ (function () {
    function AudioAnalyser(selector, fftSize) {
        if (fftSize === void 0) { fftSize = 2048; }
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.target = document.querySelector(selector) || new Audio();
        this.context = new AudioContext();
        if (!this.source) {
            this.source = this.context.createMediaElementSource(this.target);
            this.analyser = this.context.createAnalyser();
            this.source.connect(this.analyser);
            this.analyser.connect(this.context.destination);
            this.analyser.fftSize = fftSize;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = -10;
            this.analyser.smoothingTimeConstant = 0.85;
            this.buffer = new Uint8Array(this.analyser.frequencyBinCount);
            this.target.play();
            this.updateBuffer();
        }
    }
    AudioAnalyser.prototype.updateBuffer = function () {
        var _this = this;
        var _a;
        this.analyser.getByteFrequencyData(this.buffer);
        (_a = this.getBuffer) === null || _a === void 0 ? void 0 : _a.call(this);
        requestAnimationFrame(function () { return _this.updateBuffer(); });
    };
    AudioAnalyser.prototype.destroy = function () {
        this.context.close();
    };
    return AudioAnalyser;
}());
var canvas = document.querySelector("canvas") || new HTMLCanvasElement();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var renderer = canvas.getContext("2d") || new CanvasRenderingContext2D();
window.addEventListener("load", function () {
    var btn = document.querySelector("#btn") || new HTMLButtonElement();
    btn.addEventListener("click", function () {
        var audioAnalyser = new AudioAnalyser("#audio");
        window.addEventListener("unload", function () {
            audioAnalyser.destroy();
        });
        audioAnalyser.getBuffer = function () {
            renderer.clearRect(0, 0, canvas.width, canvas.height);
            var buffer = audioAnalyser.buffer;
            var bufferLength = Math.ceil((audioAnalyser.analyser.frequencyBinCount * 10000) / (audioAnalyser.context.sampleRate / 2));
            var bufferUnitWidth = canvas.width / bufferLength;
            for (var x = 0; x < bufferLength; x++) {
                renderer.fillStyle = "#47f282";
                if (x % 2 === 0) {
                    renderer.fillRect(bufferUnitWidth * x, canvas.height / 2 - buffer[x], bufferUnitWidth, buffer[x] || 0.1);
                }
                else {
                    renderer.fillRect(bufferUnitWidth * x, canvas.height / 2, bufferUnitWidth, buffer[x] || 0.1);
                }
            }
        };
        btn.style.display = "none";
    });
});
