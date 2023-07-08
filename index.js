const sipster = require("sipster");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// initialize pjsip
sipster.init();
// set up a transport to listen for incoming connections, defaults to UDP
var transport = new sipster.Transport({ port: 5060 });

// set up a SIP account, we need at least one -- as required by pjsip.
// this sets up an account for calls coming from 192.168.100.10
var acct = new sipster.Account({
	idUri: "sip:9231997645@179.108.84.136",
	sipConfig: {
		regConfig: {
			registrarUri: "sip:127.0.0.1:5060"
		},
		authCreds: [
			{
				data: "uv7vs",
				dataType: 0,
				scheme: "digest",
				username: "9231997645",
				realm: "*"
			}
		]
	}
});

// watch for incoming calls
// watch for incoming calls
acct.on("state", console.log);

sipster.start();

const call = acct.makeCall("sip:111@179.108.84.136");
let currMedia = null;

call.on("state", async (state) => {
	console.log(`current state: ${state}`);

	if (state === "confirmed") {
		const recorder = sipster.createRecorder("sexo.wav");
		currMedia.startTransmitTo(recorder);

		await delay(5000);

		call.dtmf("3");

		await delay(20000);
		call.dtmf("21444892894");

		await delay(5000);
		call.dtmf("2607");

		await delay(10000);

		currMedia.stopTransmitTo(recorder);
		call.hangup();
	}
});

call.on("media", (medias) => {
	currMedia = medias[0];
});
