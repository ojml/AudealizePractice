var bufferLoader;
var bufferList;
var source;

var navigator = window.navigator;
var Context = window.AudioContext || window.webkitAudioContext;
var context = new Context();

//Audio
var mediaStream;
var rec;

navigator.getUserMedia = (
  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);


function record() {
  // ask for permission and start recording
  navigator.getUserMedia({audio: true}, function(localMediaStream){
    mediaStream = localMediaStream;

    // create a stream source to pass to Recorder.js
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);

    // create new instance of Recorder.js using the mediaStreamSource
    rec = new Recorder(mediaStreamSource, {
      // pass the path to recorderWorker.js file here
      workerPath: 'file://recorderWorker.js'
    });

    // start recording
    rec.record();
  }, function(err){
    console.log('Browser not supported');
  });
}

function stopRecord() {
  // stop the media stream
  mediaStream.stop();

  // stop Recorder.js
  rec.stop();

  // export it to WAV
  rec.exportWAV(function(e){
    rec.clear();
    Recorder.forceDownload(e, "filename.wav");
  });
}

function fileSelected(filelist){
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	file = filelist.files[0];
	url = URL.createObjectURL(file);
	AUDIOFILE = [url];
	bufferLoader = new BufferLoader( //not defined?
		context,
		AUDIOFILE,
		finishedLoading
		);
	bufferLoader.load();
	function finishedLoading(bufferList){ //why SO slow to start 							 				playing?
		var source = context.createBufferSource();
		source.buffer = bufferList[0];
		source.connect(context.destination);
		source.start(0)
		// BUFFERS = bufferList.slice(0);
	}
// document.getElementById("audiosource").setAttribute("src", filelist.files[0].name);
}

//load file with xmlhhtprequest instead of setting src
function playMusic(){ //how to play audio here?
		// var source = context.createBufferSource();
		// source.buffer = bufferList[0];
		// source.connect(context.destination);
		// source.start(0)
}

