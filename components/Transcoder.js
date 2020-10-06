import { createFFmpeg } from '@ffmpeg/ffmpeg'

/**
 * Whether or not to output FFMpeg output
 * @type {Boolean}
 */
const SHOW_STD_OUT = true

/**
 * Small wrapper for the Transcoder
 * @extends Error
 */
class TranscoderError extends Error {
  constructor(message) {
    super(message)
    this.message = message
    this.name = 'TranscoderError'
  }
}

class TranscoderItem {
  constructor(file, format) {
    this.format = format ? format : 'mp3'
    this.file = file

    // change file extension to mp3
    let fna = this.file.name.split('.')
    // If the file name has an extension split it and replace the last index after a '.' with mp3.
    if (fna.length > 1) {
      this.originalExtension = fna[fna.length - 1]

      fna[fna.length - 1] = 'mp3'
      this.newFileName = fna.join('.')
    } else {
      // Otherwise just this.
      this.originalExtension = ''
      this.newFileName = fna[0] + '.mp3'
    }
  }
  async run() {
    // const ffmpegCmd = `-i ${input} ${cmd.join(' ')}`;
    const run = async () => {
      const ffmpeg = createFFmpeg({
        log: SHOW_STD_OUT,
      })
      // let name = this.file.name.replace(/(\s+)/g, '$1');
      try {
        await ffmpeg.load()
      } catch (err) {
        console.error('Error loading FFMpeg', err)
        throw new TranscoderError('Error loading FFMpeg')
      }
      try {
        await ffmpeg.write('input', this.file)
      } catch (err) {
        console.error('Error writing file', err)
        throw new TranscoderError('Error Writing file')
      }
      /**
       * Number of threads ffmpeg will use.
       * @type {Number}
       */
      let concurrency = 1
      try {
        /* Determines number of threads available. Does not work in IE */
        concurrency = navigator.hardwareConcurrency
      } catch (err) {
        console.error('Cannot get hardware concurrency.')
      }
      try {
        await ffmpeg.run(
          `-i input -ac 1 -ab 192k -threads ${concurrency} output.mp3`
        )
      } catch (err) {
        console.error('Error transcoding file', err)
        throw new TranscoderError('Error transcoding file')
      }
      try {
        const data = ffmpeg.read('output.mp3')
        const _file = new File([data.buffer], this.newFileName, {
          type: 'audio/mpeg',
        })
        try {
          ffmpeg.remove('output.mp3')
        } catch (err) {
          console.error('Error removing file created with FFMpeg', err)
        }
        return Promise.resolve(_file)
      } catch (err) {
        console.error('Error reading encoded file', err)
        throw new TranscoderError('Error reading ecoded file')
      }
    }
    return run()
  }
}
/**
 * FFmpeg.wasm implementation
 * * start to transcode
 */
class Transcoder {
  /**
   * t
   * @param {[file]} file file object
   * @param {[object]} opts parameters for ffmpeg transcoder
   */
  constructor(file, opts) {
    if (!opts) {
      opts = {}
    }

    // TODO implement enabling and disabling log verbosity
    this.logs = !!opts && !!opts.logs ? opts.logs : true

    // Default format is mp3
    this.format = !!opts && !!opts.format ? opts.format : 'mp3'

    this.file = file
  }

  async load(file) {
    if (!file) {
      throw new TranscoderError('No file selected. Cannot transcode')
    }
    let transcoder = new TranscoderItem(file, this.format)
    // await transcoder.load();

    return await transcoder.run()
    // return transcodedFile;
  }
  async transcode(file, format) {
    let type = format === 'mp3' ? 'audio/mpeg' : 'video/mp4'
    const ffmpeg = createFFmpeg({})
    await ffmpeg.load()
    await ffmpeg.write('input', file)
    await ffmpeg.run(`-i input -v:codec libx264 output.${format}`)
    const data = ffmpeg.read('output.mp3')
    const _file = new File([data.buffer], file.name + '.' + format, {
      type: type,
    })
    return Promise.resolve(_file)
  }
}
console.log('Transcoder', Transcoder)
export default Transcoder
