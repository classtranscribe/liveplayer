import { api } from 'utils';


export const downloadControl = {
  async webVTT(path = '', lang = '', onSuccess, onError) {
    try {
      const { data } = await api.getFile(path);
      console.log('Error - not implemented')
      // fileDownload(data, `transcription-${lang.toLowerCase()}.vtt`);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError();
    }
  },

  epub() {},
};
