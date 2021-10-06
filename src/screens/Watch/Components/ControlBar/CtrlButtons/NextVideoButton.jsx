import React from 'react';
import { withRouter } from 'dva/router';
import { MediaCard } from 'components';
import { api, links } from 'utils';
import { setup, connectWithRedux } from '../../../Utils';
import WatchCtrlButton from '../../WatchCtrlButton';
import setup2 from '../../../model/setup'
const Video = ({ media = null, label = false }) => (
  <MediaCard
    {...MediaCard.parse(media)}
    row
    dark
    posterSize="normal"
    label={label}
  />
);

export function NextVideoWithRedux(props) {
  return null;
}

export const NextVideoButton=withRouter(connectWithRedux(NextVideoWithRedux, ['media', 'playlist']))
