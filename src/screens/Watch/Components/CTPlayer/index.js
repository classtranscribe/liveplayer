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

  const decrementPauseCount = () => {
    if (pauseCount < 1) return;
    pauseCount -= 1;
    if(pauseCount === 0) {
// todo toreview: use react to call play
      PlayerData.video1 && PlayerData.video1.play();
      PlayerData.video2 && PlayerData.video2.play();
    }
  }
  const incrementPauseCount = () => {
// todo toreview: use react way to call pause
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

  let thisIsTheWorst = function(event) {
    // 
    const toLog = [];
    for (let z = 0; z < event.currentTarget.cues.length; z += 1) {
        let toCopy = JSON.parse(JSON.stringify(event.currentTarget.cues[z]));
        toCopy.startTime = event.currentTarget.cues[z].startTime;
        toCopy.endTime = event.currentTarget.cues[z].endTime;
        toCopy.text = event.currentTarget.cues[z].text;
        toCopy.kind = 'vtt'
        toLog.push(toCopy)
    }
    
    // const prev = undefined;
    if (event.currentTarget.activeCues[0] !== undefined) {
        let curr = event.currentTarget.activeCues[0];
        if (Math.abs(curr.startTime - curr.endTime) > 20) {
            curr = event.currentTarget.activeCues[1];
        }

        let toCopy = JSON.parse(JSON.stringify(curr));
        toCopy.startTime = curr.startTime;
        toCopy.endTime = curr.endTime;
        toCopy.text = curr.text;
        dispatch({ type: 'watch/setTranscript', payload:  toLog})
            
        dispatch({ type: 'watch/setCurrCaption', payload:  toCopy});
    }
}

  useEffect(() => {
    if (previousTrack !== undefined) {
      previousTrack.removeEventListener('cuechange', thisIsTheWorst);
      previousTrack.mode = 'disabled';
    }
    if (englishTrack !== undefined) {
      englishTrack.mode = 'hidden';
      englishTrack.addEventListener("cuechange", thisIsTheWorst );
      setPreviousTrack(englishTrack);
    }
  }, [englishTrack])

  let previouslySpokenDescriptionCue = new Set()

  let descriptionTrackGlue = function(event) { 
      let activeCues = event.currentTarget.activeCues;
      let newKeys = new Set();
      for (let z = 0; z < activeCues.length; z += 1) {
        let thetext = activeCues[z].text;
        let startTime = String(activeCues[z].startTime);
        let key = `{startTime}:{thetext}` 
        newKeys.add(key);
        if(! previouslySpokenDescriptionCue.has(key) ) {
          if(window.location.href.includes("tts")) {
            incrementPauseCount();
            speak({text: thetext});
          }
        }
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
