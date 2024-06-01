/**
 * 
 * @author Mortal-Li
 * @created Fri Apr 19 2024 14:42:24 GMT+0800 (中国标准时间)
 */

import { AudioClip, AudioSource, Node, assetManager, warn } from "cc";


export default class SoundManager {

    private _bundle: string = "";
    private _path: string = "";

    private _musicVolume = 1;
    private _effectVolume = 1;
    private _isMusicMute = false;
    private _isEffectMute = false;
    private _musicAudio: AudioSource = null;
    private _effectsMap: Map<number, AudioSource> = new Map();
    private _audioID = 0;

    /**
     * 指定声音资源默认路径和所属bundle
     */
    init(bundleStr: string, pathStr: string) {
        this._bundle = bundleStr;
        this._path = pathStr;
    }
    
    /**
     * 播放音乐
     * @param musicName 音乐名字
     * @param bundleName 资源所属bundle，可选
     * @param loop 是否循环，默认true
     * @returns loop如果为true，则开始播放立即返回；否则播放完毕返回
     */
    playMusicAsync(musicName: string, bundleName?: string, loop: boolean = true) {
        return new Promise<void>((resolve, reject) => {
            let bundle = assetManager.getBundle(bundleName ? bundleName : this._bundle);
            if (!bundle) {
                warn("Bundle not found!");
                reject();
                return;
            }

            bundle.load(this._path + musicName, (err, audio: AudioClip) => {
                if (err) {
                    warn(err);
                    reject();
                    return;
                }

                this.stopMusic();

                let nd = new Node();
                this._musicAudio = nd.addComponent(AudioSource);
                this._musicAudio.clip = audio;
                this._musicAudio.volume = this._musicVolume * (this._isMusicMute ? 0 : 1);
                this._musicAudio.loop = loop;
                this._musicAudio.play();

                loop ? resolve() : nd.on(AudioSource.EventType.ENDED, resolve);
            });
        });
    }

    stopMusic() {
        if (this._musicAudio) {
            this._clearAudio(this._musicAudio);
            this._musicAudio = null;
        }
    }

    pauseMusic() {
        if (this._musicAudio) {
            if (this._musicAudio.state == AudioSource.AudioState.PAUSED) return;
            this._musicAudio.pause();
        }
    }

    resumeMusic() {
        if (this._musicAudio) {
            if (this._musicAudio.state != AudioSource.AudioState.PAUSED) return;
            this._musicAudio.play();
        }
    }

    isMusicPlaying() {
        if (this._musicAudio) {
            return this._musicAudio.playing;
        }
        return false;
    }

    /**
     * 播放音效
     * @param effectName 音效名字
     * @param bundleName 资源所属bundle，可选
     * @param loop 是否循环，默认false
     * @returns 异步返回audioID
     */
    playEffectAsync(effectName: string, bundleName?: string, loop: boolean = false) {
        return new Promise<number>((resolve, reject) => {
            let bundle = assetManager.getBundle(bundleName ? bundleName : this._bundle);
            if (!bundle) {
                warn("Bundle not found!");
                reject();
                return;
            }

            bundle.load(this._path + effectName, (err, audio: AudioClip) => {
                if (err) {
                    warn(err);
                    reject();
                    return;
                }

                let nd = new Node();
                let effectAudio = nd.addComponent(AudioSource);
                effectAudio.clip = audio;
                effectAudio.volume = this._effectVolume * (this._isEffectMute ? 0 : 1);
                effectAudio.loop = loop;
                effectAudio.play();

                this._audioID += 1;
                let id = this._audioID;
                this._effectsMap.set(id, effectAudio);
                if (!loop) {
                    nd.on(AudioSource.EventType.ENDED, () => {
                        this.stopEffect(id);
                    });
                }
                resolve(id);
            });
        });
    }

    stopEffect(audioID: number) {
        let as = this._effectsMap.get(audioID);
        if (as) {
            this._clearAudio(as);
            this._effectsMap.delete(audioID);
        }
    }

    stopAllEffects() {
        this._effectsMap.forEach((as, id) => {
            this._clearAudio(as);
        });
        this._effectsMap.clear();
    }

    stopAll() {
        this.stopMusic();
        this.stopAllEffects();
    }

    pauseEffect(audioID: number) {
        let as = this._effectsMap.get(audioID);
        if (as) {
            if (as.state == AudioSource.AudioState.PAUSED) return;
            as.pause();
        }
    }

    resumeEffect(audioID: number) {
        let as = this._effectsMap.get(audioID);
        if (as) {
            if (as.state != AudioSource.AudioState.PAUSED) return;
            as.play();
        }
    }

    setMusicVolume(v: number) {
        this._musicVolume = v;
        if (this._musicAudio) {
            this._musicAudio.volume = v * (this._isMusicMute ? 0 : 1);
        }
    }

    setEffectsVolume(v: number) {
        this._effectVolume = v;
        this._effectsMap.forEach((as, id) => {
            as.volume = v * (this._isEffectMute ? 0 : 1);
        });
    }

    /**
     * 设置是否静音，true为静音
     * @param isMute 
     */
    setMute(isMute: boolean) {
        this.setMusicMute(isMute);
        this.setEffectMute(isMute);
    }

    /**
     * 是否静音背景音乐
     */
    setMusicMute(isMute: boolean) {
        if (isMute == this._isMusicMute) return;
        this._isMusicMute = isMute;
        this.setMusicVolume(this._musicVolume);
    }

    /**
     * 是否静音音效
     */
    setEffectMute(isMute: boolean) {
        if (isMute == this._isEffectMute) return;
        this._isEffectMute = isMute;
        this.setEffectsVolume(this._effectVolume);
    }
    
    private _clearAudio(as: AudioSource) {
        as.node.off(AudioSource.EventType.ENDED);
        as.stop();
        as.clip = null;
        as.node.destroy();
    }
}
