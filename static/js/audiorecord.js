var bufferLoader;
var bufferList;
var source;

var navigator = window.navigator;
var Context = window.AudioContext || window.webkitAudioContext;
var context = new Context();

//Audio
var mediaStream;
var rec;

var outputElement = document.getElementById('output');
var outputString;

navigator.getUserMedia = (
  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);


function record() {
  // ask for permission and start recording
    outputElement.innerHTML = 'Recording...';  
    navigator.getUserMedia({audio: true}, function(localMediaStream){
    mediaStream = localMediaStream;

    // create a stream source to pass to Recorder.js
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);

    // create new instance of Recorder.js using the mediaStreamSource
    rec = new Recorder(mediaStreamSource);

    // start recording
    rec.record();
  }, function(err){
    console.log('Browser not supported');
  });
}

function stopRecord() {

  outputElement.innerHTML = 'Stopped recording.';

  // stop the media stream
  mediaStream.stop();

  // stop Recorder.js
  rec.stop();

  // export it to WAV
  rec.exportWAV(function(e){
  rec.clear();
  fileSelected(e,0);
  });
}

function fileSelected(filelist,filetype){
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
        if (filetype == 0)
	file = filelist;
	else
	file = filelist.files[0];
	url = URL.createObjectURL(file);
	AUDIOFILE = [url];
}

//load file with xmlhhtprequest instead of setting src
function playMusic(){
		
	outputElement.innerHTML = 'Playing audio';

	bufferLoader = new BufferLoader( 
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
}
}

