
export class SmartCam extends HTMLElement {

   webcamButton: HTMLButtonElement | null;
   webcam: HTMLVideoElement | null;
   stream: MediaStream | null;
   capabilities: MediaTrackCapabilities | null;

   constructor(){
      super();
      this.webcamButton = this.querySelector('button');
      if(!this.webcamButton) {
         this.webcamButton = document.createElement('button');
         this.appendChild(this.webcamButton);
      }
      this.webcamButton.innerText = 'Enable Webcam';
      this.webcam = this.querySelector('video');
      if(!this.webcam) {
         this.webcam = document.createElement('video');
         this.appendChild(this.webcam);
      }
      this.stream = null;
      this.capabilities = null;


      this.webcamButton.addEventListener('click', () => this.toggleWebcam());
   };

   getUserMediaSupported(): boolean {
      return !!(
         navigator.mediaDevices &&
         navigator.mediaDevices.getUserMedia);
   }

   isLive(): boolean {
      if (this.stream) {
         const videoTrack = this.stream.getVideoTracks()[0];
         return videoTrack.readyState === 'live';
      }
      return false;
   }

   async toggleWebcam(): Promise<void> {
      if(this.getUserMediaSupported()) {
         if(this.isLive()) {
            this.stream?.getVideoTracks()[0].stop();
            if(this.webcamButton) {
               this.webcamButton.innerText = 'Enable Webcam';
            }
         }
         else {
            try {
               this.stream = await navigator.mediaDevices.getUserMedia({video: true});
               if(this.webcam) {
                  this.webcam.srcObject = this.stream;
                  if (this.webcamButton) {
                     this.webcamButton.innerText = 'Disable Webcam';
                  }
                  this.capabilities = this.stream.getVideoTracks()[0].getCapabilities();
                  console.log(this.capabilities);
               }
            }
            catch(err) {
               console.error('Error accessing the webcam', err);
            }
         }
      }
      else {
         console.log('getUserMedia() not supported by your browser');
      }
   }

   removeEnableButton(): void {
      if(this.webcamButton) {
         this.webcamButton.remove();
      }
   }
}

customElements.define('smart-cam', SmartCam);