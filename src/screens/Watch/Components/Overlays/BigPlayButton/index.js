import React, { useState, useEffect } from 'react';
import { connect } from 'dva'
import { CTP_LOADING, CTP_ENDED, CTP_ERROR } from '../../../Utils';
import './index.scss';

const PS_PLAY = 'play';
const PS_PAUSE = 'pause';
const PS_NOTHING = 'nothing';

let timeOutEl = null;
let lastPaused = true;

function BigPlayButtonWithRedux(props) {
  const { isPrimary = false, paused = true, ctpPriEvent = CTP_LOADING, dispatch } = props;
  const [pauseStatus, setPauseStatus] = useState(true);

  const handleClick = () => {
    if (ctpPriEvent === CTP_ENDED) {
      dispatch({ type: 'watch/media_replay' })
    }
  };

  useEffect(() => {
    if (lastPaused !== paused) {
      if (timeOutEl) clearTimeout(timeOutEl);
      setPauseStatus(paused ? PS_PAUSE : PS_PLAY);
      lastPaused = paused;
      timeOutEl = setTimeout(() => setPauseStatus(PS_NOTHING), 300);
    }
  }, [paused]);
  if (!isPrimary) {
    return null;
  }
  let bpb_container = null
  if (ctpPriEvent === CTP_ENDED) {
    bpb_container = <button className="wbp-btn plain-btn" onClick={handleClick} aria-label="Replay">
      <span className="big-play-button-content" tabIndex="-1">
        <i className="material-icons">replay</i>
      </span>
    </button>;
  } else if (ctpPriEvent === CTP_ERROR) {
    return <div className="ctp-error-wrapper">Media Unavailable</div>; // Retry
  } else if (ctpPriEvent === CTP_LOADING) {
    bpb_container = <div>
      <div className="sk-chase" color="green">
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
      </div>
    </div>;
  } else if (pauseStatus === PS_PAUSE) {
    bpb_container = <button
      data-show-and-fade
      id="wbpb-pause"
      className="wbp-btn plain-btn"
      // onClick={handleClick}
      aria-hidden="true"
    >
      <span className="big-play-button-content" tabIndex="-1">
        <i className="material-icons">pause</i>
      </span>
    </button>;
  } else if (pauseStatus === PS_PLAY) {
    bpb_container = <div
      data-show-and-fade
      id="wbpb-play"
      className="wbp-btn plain-btn"
      // onClick={handleClick}
      aria-hidden="true"
    >
      <span className="big-play-button-content" tabIndex="-1">
        <i className="material-icons">play_arrow</i>
      </span>
    </div>;
  }
  return (
    <div className="wbp-btn-container" paused={paused.toString()} aria-hidden="true">
      {bpb_container}
    </div>
  )
}

export const BigPlayButton = connect(({ watch: { paused, ctpPriEvent }, loading }) => ({
  paused, ctpPriEvent
}))(BigPlayButtonWithRedux);
