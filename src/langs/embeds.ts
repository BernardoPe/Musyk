export interface EmbedsLangConfig {
    analytics: AnalyticsLangConfig;
    left: LeftLangConfig;
    leaving: LeavingLangConfig;
    create_link: CreateLinkLangConfig;
    now_playing: NowPlayingLangConfig;
    queue: QueueLangConfig;
    playlist_queued: PlaylistQueuedLangConfig;
    song_queued: SongQueuedLangConfig;
    help: HelpLangConfig;
}

interface AnalyticsLangConfig {
    global_title: string;
    global_description: string;
    title: string;
    description: string;
    fields: AnalyticsFieldsLangConfig;
}

interface AnalyticsFieldsLangConfig {
    instances: string;
    players: string;
    event_loop_lag: string;
    tracks_count: string;
    history_size: string;
    rss: string;
    heap_total: string;
    heap_used: string;
}

interface LeftLangConfig {
    description: string;
}

interface LeavingLangConfig {
    description: string;
}

interface CreateLinkLangConfig {
    label: string;
}

interface NowPlayingLangConfig {
    title: string;
    description: string;
    fields: NowPlayingFieldsLangConfig;
}

interface NowPlayingFieldsLangConfig {
    duration: string;
    author: string;
    requested_by: string;
    volume: string;
    songs_in_queue: string;
    total_queue_duration: string;
    next_track: string;
}

interface QueueLangConfig {
    title: string;
    fields: QueueFieldsLangConfig;
}

interface QueueFieldsLangConfig {
    currently_playing: string;
    position: string;
    total_queue_duration: string;
    songs_in_queue: string;
}

interface PlaylistQueuedLangConfig {
    title: string;
    fields: PlaylistQueuedFieldsLangConfig;
}

interface PlaylistQueuedFieldsLangConfig {
    songs: string;
    duration: string;
}

interface SongQueuedLangConfig {
    title: string;
    duration: string;
    position: string;
    requested_by: string;
}

interface HelpLangConfig {
    intro: HelpIntroLangConfig;
    playing_music: HelpPlayingMusicLangConfig;
    commands: HelpCommandsLangConfig;
    buttons: ButtonsLangConfig;
    filters: FiltersLangConfig;
    additional_info: AdditionalInfoLangConfig;
}

interface HelpIntroLangConfig {
    title: string;
    description: string;
}

interface HelpPlayingMusicLangConfig {
    title: string;
    description: string;
}

interface HelpCommandsLangConfig {
    title: string;
    description: string;
}

interface ButtonsLangConfig {
    title: string;
    fields: ButtonsFieldsLangConfig;
}

interface ButtonsFieldsLangConfig {
    skip: string;
    pause: string;
    stop: string;
    increase_volume: string;
    decrease_volume: string;
    shuffle: string;
    queue: string;
    reverse: string;
    clear: string;
    loop: string;
    autoplay: string;
    dc: string;
}

interface FiltersLangConfig {
    title: string;
    description: string;
}

interface AdditionalInfoLangConfig {
    title: string;
    description: string;
}
