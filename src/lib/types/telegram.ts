export interface InputPeerChannel {
	CONSTRUCTOR_ID: number;
	SUBCLASS_OF_ID: number;
	className: 'InputPeerChannel';
	classType: 'constructor';
	channelId: {
		value: bigint;
	};
	accessHash: {
		value: bigint;
	};
	originalArgs: {
		channelId: {
			value: bigint;
		};
		accessHash: {
			value: bigint;
		};
	};
}

export interface TelegramChannelInfo {
	channelId: string;
	accessHash: string;
}
