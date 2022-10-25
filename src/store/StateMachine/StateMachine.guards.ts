import type { Context } from "./StateMachine.types";

export const isEmbedInfoReady = (context: Context): boolean => context.isEmbedConfigValid;
export const isFetchingInfoReady = (context: Context): boolean => context.isFetchConfigValid;
