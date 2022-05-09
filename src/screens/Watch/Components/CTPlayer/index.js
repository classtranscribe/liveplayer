import React, { useCallback, useRef, useEffect, useState } from 'react';
import { connect } from 'dva'
import { isMobile } from 'react-device-detect';
import { useSpeechSynthesis } from 'react-speech-kit';

import PlayerData from '../../player'
import Video from './player'
import VideoHls from './player_hls'

import {
  PRIMARY,
  SECONDARY,
  PS_MODE,
  NESTED_MODE,
} from '../../Utils';
import './index.scss';

// modification for BOT live stream
import './playerModes_liveplayer.scss';
// import './playerModes.css';


const videoRef1 = (node) => { PlayerData.video1 = node };
const videoRef2 = (node) => { PlayerData.video2 = node };
const ClassTranscribePlayerNew = (props) => {
  const { dispatch } = props;
  const { transView, muted, volume, playbackrate, openCC, updating, englishTrack, descriptionTrack } = props;
  const { media = {}, mode, isSwitched, isFullscreen, embedded, captionSpeedUp } = props;
  const { videos = [], isTwoScreen } = media;
  const { srcPath1, srcPath2, useHls = false} = videos[0] || {};

  let pauseCount = 0;
  let wasPaused = false;

  const decrementPauseCount = () => {
    if (pauseCount < 1) return;
    pauseCount -= 1;
    // eslint-disable-next-line 
    console.log(`decrementPauseCount. pauseCount now ${pauseCount}, wasPaused is ${wasPaused}`);
    if(pauseCount === 0 && ! wasPaused) {
// todo toreview: use react to call play indirectly?
      PlayerData.video1 && PlayerData.video1.play();
      PlayerData.video2 && PlayerData.video2.play();
    }
  }
  const incrementPauseCount = () => {
    // todo toreview: use react way to call pause
    if(PlayerData.video1 && pauseCount === 0 ) {
      wasPaused = PlayerData.video1.paused; 
      // fixme this is always false, even when the player is paused
      // console.log(`wasPaused set to ${wasPaused}`);
    }
    pauseCount += 1
    PlayerData.video1 && PlayerData.video1.pause();
    PlayerData.video2 && PlayerData.video2.pause();
  }

  const onEnd = () => {
    decrementPauseCount();
  };
  const { speak, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  
  // Mute Handler
  useEffect(() => {
    PlayerData.video1 && (PlayerData.video1.muted = muted);
    PlayerData.video2 && (PlayerData.video2.muted = true);
  }, [muted]);
  // Volume Handler
  useEffect(() => {
    PlayerData.video1 && (PlayerData.video1.volume = volume);
    PlayerData.video2 && (PlayerData.video2.volume = volume);
  }, [volume]);
  // Playbackrate Handler
  useEffect(() => {
    PlayerData.video1 && (PlayerData.video1.playbackRate = playbackrate);
    PlayerData.video2 && (PlayerData.video2.playbackRate = playbackrate);
  }, [playbackrate]);

  // liveMode speed
  useEffect(() => {
    PlayerData.param = {};
    if (PlayerData.video1) {
      PlayerData.video1.pause()
      PlayerData.video1.load()
    }
    if (PlayerData.video2) {
      PlayerData.video2.pause();
      PlayerData.video2.load()
    }
  }, [srcPath1, srcPath2]);
  const player1Position = isSwitched ? SECONDARY : PRIMARY;
  const player2Position = isSwitched ? PRIMARY : SECONDARY;

  useEffect(() => {
    if (isTwoScreen && !isMobile) {
      dispatch({ type: 'watch/setMode', payload: window.innerWidth <= 900 ? NESTED_MODE : PS_MODE })
    }
  }, [isTwoScreen])
  let [previousTrack, setPreviousTrack] = useState(undefined);
  let [previousDescriptionTrack, setPreviousDescriptionTrack] = useState(undefined);
  // not react glue formerly "thisIsTheWorst"
  let captionReactGlue = function(event) {
    // 
    const toLog = [];
    for (let z = 0; z < event.currentTarget.cues.length; z += 1) {
        const cue = event.currentTarget.cues[z];
        if(cue === undefined || cue.startTime === undefined) {
          // eslint-disable-next-line 
          console.log(`Skipping cue ${cue}`);
          // eslint-disable-next-line 
          continue;
        }
        const aCopy = { kind:'vtt',startTime:String(cue.startTime), endTime:String(cue.endTime), text:cue.text};
        toLog.push(aCopy)
    }
    
    // const prev = undefined;
    if (event.currentTarget.activeCues[0] !== undefined) {
        let curr = event.currentTarget.activeCues[0];
        if (curr.startTime !== undefined && event.currentTarget.activeCues[1] !== undefined 
          && Math.abs(curr.startTime - curr.endTime) > 20) {
            curr = event.currentTarget.activeCues[1];
        }
                
        const aCopy = { startTime:String(curr.startTime), endTime:String(curr.endTime), text:curr.text };
        // eslint-disable-next-line 
        console.log(`Cue copy: ${aCopy.startTime}`);
        dispatch({ type: 'watch/setTranscript', payload:  toLog});
            
        dispatch({ type: 'watch/setCurrCaption', payload:  aCopy});
    }
}

  useEffect(() => {
    if (previousTrack !== undefined) {
      previousTrack.removeEventListener('cuechange', captionReactGlue);
      previousTrack.mode = 'disabled';
    }
    if (englishTrack !== undefined) {
      englishTrack.mode = 'hidden';
      englishTrack.addEventListener("cuechange", captionReactGlue );
      setPreviousTrack(englishTrack);
    }
  }, [englishTrack])

  let previouslySpokenDescriptionCue = new Set()

  let descriptionTrackGlue = function(event) { 
      let activeCues = event.currentTarget.activeCues;
      let newKeys = new Set();
      let wordsToSpeak = [];
      for (let z = 0; z < activeCues.length; z += 1) {
        const cue = activeCues[z];
        if(cue === undefined || cue.startTime === undefined) {
          // eslint-disable-next-line 
          continue;
        }
        let thetext = cue.text;
        let startTime = String(cue.startTime);
        let key = `${thetext}`; // Do not add the startime - this can change
        newKeys.add(key);
        if(! previouslySpokenDescriptionCue.has(key) ) {
          if(window.location.hash.includes("ad") || window.location.hash.includes("tts")) {
            // eslint-disable-next-line 
            console.log(`Speaking ${startTime}:${thetext}`);
            wordsToSpeak.push(thetext);
          }
        } else {
          // eslint-disable-next-line 
          console.log(`Already spoken ${key}`);
        }
      }
      
      const allwords = wordsToSpeak.join(' ').trim();
      if(allwords.length > 0) {
        incrementPauseCount();
        speak({text: allwords, volume: 0.7, rate: 1.1});
      }
      previouslySpokenDescriptionCue = newKeys;
  }
  useEffect(() => {
    if (previousDescriptionTrack !== undefined) {
      previousDescriptionTrack.removeEventListener('cuechange', descriptionTrackGlue);
      previousDescriptionTrack.mode = 'disabled';
    }
    if (descriptionTrack !== undefined) {
      descriptionTrack.mode = 'hidden';
      descriptionTrack.addEventListener("cuechange", descriptionTrackGlue );
      setPreviousDescriptionTrack(descriptionTrack);
    }
  }, [descriptionTrack])
  

  const media1Prop = {
    id: 1,
    videoRef: videoRef1,
    dispatch,
    path: srcPath1,
    isSwitched,
    embedded,
    openCC,

    updating,
    captionSpeedUp

  }
  useEffect(() => {
    if(window.hls) {
        // window.hls.subtitleTrack = openCC ? 0: -1
    }
  }, [openCC])

  let device = 'web';
  if (isMobile) {
    if (window.innerWidth < window.innerHeight) device = 'mobile';
    else device = 'mobile-landscape';
  }

  return (
    <>
      <div
        className={`ct-video-row ct-player-primary-${device}`}
        mode="normal-mode"
        data-trans-view="Caption Line View"
        data-fullscreen={isFullscreen}
      >
        {
          useHls ? <VideoHls
            {...media1Prop}
          /> : <Video
            {...media1Prop}
          />
        }

      </div>
      {isTwoScreen && (
        <div
          className={embedded ? 'ctp ct-video-con' : `ct-video-row ${player2Position}`}
          mode={mode}
          data-trans-view={transView}
          data-fullscreen={isFullscreen}
        >
          <Video
            id={2}
            videoRef={videoRef2}
            dispatch={dispatch}
            path={srcPath2}
            isSwitched={isSwitched}
            embedded={embedded}
          />
        </div>
      )}
    </>
  );
};

export const ClassTranscribePlayer = connect(({ watch: {
  media, mode, isSwitched, isFullscreen, embedded, updating, captionSpeedUp, englishTrack,descriptionTrack
}, playerpref: {
  transView, muted, volume, playbackrate, openCC
}, loading }) => ({
  media, mode, isSwitched, isFullscreen, embedded, transView, muted, volume, playbackrate, openCC, updating, captionSpeedUp, englishTrack,descriptionTrack
}))(ClassTranscribePlayerNew);
