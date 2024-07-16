import { db } from "@/db";

export interface ChannelDetails {
  title: string;
  username: string;
  channelusername: number | string;
  accessHash: number | string;
  isCreator: boolean;
  isBroadcast: boolean;
}

interface Message {
  flags: number;
  out: boolean;
  mentioned: boolean;
  mediaUnread: boolean;
  silent: boolean;
  post: boolean;
  fromScheduled: boolean;
  legacy: boolean;
  editHide: boolean;
  pinned: boolean;
  noforwards: boolean;
  invertMedia: boolean;
  flags2: number;
  offline: boolean;
  id: number;
  fromId: null;
  fromBoostsApplied: null;
  peerId: {
    channelId: string;
    className: string;
  };
  savedPeerId: null;
  fwdFrom: null;
  viaBotId: null;
  viaBusinessBotId: null;
  replyTo: null;
  date: number;
  message: string;
  media: {
    flags: number;
    nopremium: boolean;
    spoiler: boolean;
    video: boolean;
    round: boolean;
    voice: boolean;
    document: {
      flags: number;
      id: string;
      accessHash: string;
      fileReference: {
        type: "Buffer";
        data: number[];
      };
      date: number;
      mimeType: string;
      size: string;
      thumbs: (
        | {
            type: "i";
            bytes: {
              type: "Buffer";
              data: number[];
            };
            className: string;
          }
        | {
            type: "m";
            w: number;
            h: number;
            size: number;
            className: string;
          }
      )[];
      videoThumbs: null;
      dcId: number;
      attributes: {
        w?: number;
        h?: number;
        fileName?: string;
        className: string;
      }[];
      className: string;
    };
    altDocument: null;
    ttlSeconds: null;
    className: string;
  };
  replyMarkup: null;
  entities: null;
  views: number;
  forwards: number;
  replies: null;
  editDate: null;
  postAuthor: null;
  groupedId: null;
  reactions: null;
  restrictionReason: null;
  ttlPeriod: null;
  quickReplyShortcutId: null;
  className: string;
}

export default Message;

export type FilesData = {
  date: string | null;
  id: number;
  userId: string;
  fileName: string;
  mimeType: string;
  size: bigint;
  url: string;
  fileTelegramId: string;
}[];

export type User = Awaited<ReturnType<typeof db.query.usersTable.findFirst>>;
