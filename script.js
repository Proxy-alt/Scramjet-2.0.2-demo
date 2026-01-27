const { Controller, config } = $scramjetController;
const LibcurlClient = window.LibcurlTransport.LibcurlClient;
let frame;
async function main() {
    const ScramjetConfig = await fetch('./config.json').then(sjJson => sjJson.json());

    const initPath = ScramjetConfig.initPath;
    const controllerPath = ScramjetConfig.controllerPath;
    const statusEl = document.getElementById(ScramjetConfig.statusElId);
    const embedFrame = document.getElementById(ScramjetConfig.embedFrameId);
    const wispUrl = ScramjetConfig.wispURL;
    const scope = ScramjetConfig.scope;

    config.prefix = scope;
    config.wasmPath = `${initPath}scramjet.wasm`;
    config.injectPath = `${controllerPath}controller.inject.js`;
    config.scramjetPath = `${initPath}scram/scramjet.js`;

    async function init() {
        statusEl.textContent = "Registering service worker...";

        const registration = await navigator.serviceWorker.register("/sw.js");

        // Wait for the service worker to be ready
        if (!navigator.serviceWorker.controller) {
            statusEl.textContent = "Waiting for service worker to activate...";
            window.location.reload();
        }

        statusEl.textContent = 'Initializing controller...';

        const transport = new LibcurlClient({ wisp: wispUrl });

        const controller = new Controller({
            serviceworker: registration.active,
            transport
        });

        await controller.wait;

        const scramjetFrame = controller.createFrame(embedFrame);
        statusEl.textContent = "Ready";
        frame = scramjetFrame;
    }

    init().catch(err => {
        statusEl.textContent = `Error: ${err.message}`;
        console.error('Harness init error:', err);
    });
    await init();
    return frame
}

/**
 * Add your own search logic after here like:
 * frame.go(url)
 */
main().then(frame => {
    frame.go("https://google.com");
});
