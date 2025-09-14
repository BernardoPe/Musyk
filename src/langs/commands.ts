export interface CommandsLangConfig {
	shared: SharedCommandLangConfig
	cycle: CycleLangConfig
	pause: PauseLangConfig
	resume: ResumeLangConfig
	seek: SeekLangConfig
	filter: FilterLangConfig
	clear: ClearLangConfig
	jump: JumpLangConfig
	remove: RemoveLangConfig
	reverse: ReverseLangConfig
	shuffle: ShuffleLangConfig
	swap: SwapLangConfig
	volume: VolumeLangConfig
	play: PlayLangConfig
}

interface SharedCommandLangConfig {
	empty_queue: string
	invalid_position: string
	value_must_be_number: string
	current_prefix: string
	current_lang: string
}

interface CycleLangConfig {
	autoplay_on: string
	loop_mode_off: string
	looping_queue_on: string
	repeat_mode_on: string
	current_mode: string
}

interface PauseLangConfig {
	already_paused: string
	paused: string
}

interface ResumeLangConfig {
	already_playing: string
	resumed: string
}

interface SeekLangConfig {
	invalid_time: string
	invalid_time_format: string
	seeked: string
}

interface FilterLangConfig {
	disabled_all: string
	disabled_single: string
	enabled_single: string
	invalid_filter: string
}

interface ClearLangConfig {
	cleared: string
	empty_queue: string
}

interface JumpLangConfig {
	invalid_index: string
}

interface RemoveLangConfig {
	removed: string
	invalid_index: string
}

interface ReverseLangConfig {
	reversed: string
}

interface ShuffleLangConfig {
	not_enough_songs: string
	shuffled: string
}

interface SwapLangConfig {
	invalid_position_1: string
	invalid_position_2: string
	swapped: string
}

interface VolumeLangConfig {
	current_volume: string
	invalid_volume: string
	volume_set: string
}

interface PlayLangConfig {
	provide_search: string
	need_to_be_in_voice: string
	need_permissions: string
	already_connected: string
	no_results: string
	error: string
}
