declare module "api/schemas" {
    import { z } from 'zod';
    export type Asset = z.infer<typeof Asset>;
    export const Asset: z.ZodEnum<["TON", "USDT", "ETH"]>;
    export type Price = z.infer<typeof Price>;
    export const Price: z.ZodObject<{
        asset: z.ZodEnum<["TON", "USDT", "ETH"]>;
        amount: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        asset: "TON" | "USDT" | "ETH";
        amount: string;
    }, {
        asset: "TON" | "USDT" | "ETH";
        amount: string;
    }>;
    export type GiftKindOut = z.infer<typeof GiftKindOut>;
    export const GiftKindOut: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        price: z.ZodObject<{
            asset: z.ZodEnum<["TON", "USDT", "ETH"]>;
            amount: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        }, {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        }>;
        limit: z.ZodNumber;
        inStock: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        price: {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        };
        limit: number;
        inStock: number;
    }, {
        id: string;
        name: string;
        price: {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        };
        limit: number;
        inStock: number;
    }>;
    export type SentGiftOut = z.infer<typeof SentGiftOut>;
    export const SentGiftOut: z.ZodObject<{
        id: z.ZodString;
        kindId: z.ZodString;
        order: z.ZodNumber;
        senderId: z.ZodString;
        purchasePrice: z.ZodObject<{
            asset: z.ZodEnum<["TON", "USDT", "ETH"]>;
            amount: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        }, {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        }>;
        sentAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kindId: string;
        order: number;
        senderId: string;
        purchasePrice: {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        };
        sentAt: Date;
    }, {
        id: string;
        kindId: string;
        order: number;
        senderId: string;
        purchasePrice: {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        };
        sentAt: Date;
    }>;
    export type SendableGiftOut = z.infer<typeof SendableGiftOut>;
    export const SendableGiftOut: z.ZodObject<{
        id: z.ZodString;
        kindId: z.ZodString;
        order: z.ZodNumber;
        purchaseDate: z.ZodDate;
        purchasePrice: z.ZodObject<{
            asset: z.ZodEnum<["TON", "USDT", "ETH"]>;
            amount: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        }, {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        }>;
        sendToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kindId: string;
        order: number;
        purchasePrice: {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        };
        purchaseDate: Date;
        sendToken: string;
    }, {
        id: string;
        kindId: string;
        order: number;
        purchasePrice: {
            asset: "TON" | "USDT" | "ETH";
            amount: string;
        };
        purchaseDate: Date;
        sendToken: string;
    }>;
    export type GiftStatus = z.infer<typeof GiftStatus>;
    export const GiftStatus: z.ZodUnion<[z.ZodObject<{
        status: z.ZodLiteral<"pending">;
    }, "strip", z.ZodTypeAny, {
        status: "pending";
    }, {
        status: "pending";
    }>, z.ZodObject<{
        status: z.ZodLiteral<"purchased">;
        gift: z.ZodObject<{
            id: z.ZodString;
            kindId: z.ZodString;
            order: z.ZodNumber;
            purchaseDate: z.ZodDate;
            purchasePrice: z.ZodObject<{
                asset: z.ZodEnum<["TON", "USDT", "ETH"]>;
                amount: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            }, {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            }>;
            sendToken: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kindId: string;
            order: number;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            purchaseDate: Date;
            sendToken: string;
        }, {
            id: string;
            kindId: string;
            order: number;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            purchaseDate: Date;
            sendToken: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        status: "purchased";
        gift: {
            id: string;
            kindId: string;
            order: number;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            purchaseDate: Date;
            sendToken: string;
        };
    }, {
        status: "purchased";
        gift: {
            id: string;
            kindId: string;
            order: number;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            purchaseDate: Date;
            sendToken: string;
        };
    }>, z.ZodObject<{
        status: z.ZodLiteral<"sent">;
        gift: z.ZodObject<{
            id: z.ZodString;
            kindId: z.ZodString;
            order: z.ZodNumber;
            senderId: z.ZodString;
            purchasePrice: z.ZodObject<{
                asset: z.ZodEnum<["TON", "USDT", "ETH"]>;
                amount: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            }, {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            }>;
            sentAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kindId: string;
            order: number;
            senderId: string;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            sentAt: Date;
        }, {
            id: string;
            kindId: string;
            order: number;
            senderId: string;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            sentAt: Date;
        }>;
    }, "strip", z.ZodTypeAny, {
        status: "sent";
        gift: {
            id: string;
            kindId: string;
            order: number;
            senderId: string;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            sentAt: Date;
        };
    }, {
        status: "sent";
        gift: {
            id: string;
            kindId: string;
            order: number;
            senderId: string;
            purchasePrice: {
                asset: "TON" | "USDT" | "ETH";
                amount: string;
            };
            sentAt: Date;
        };
    }>]>;
    export type UserOut = z.infer<typeof UserOut>;
    export const UserOut: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        isPremium: z.ZodBoolean;
        receivedGiftsCount: z.ZodNumber;
        rank: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        isPremium: boolean;
        receivedGiftsCount: number;
        rank: number;
    }, {
        id: string;
        name: string;
        isPremium: boolean;
        receivedGiftsCount: number;
        rank: number;
    }>;
    export type Pagination = z.infer<typeof Pagination>;
    export const Pagination: z.ZodObject<{
        offset: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        offset: number;
    }, {
        limit?: number | undefined;
        offset?: number | undefined;
    }>;
}
declare module "common/utils" {
    import type { Long } from 'mongodb';
    export function deleteUndefined(obj: any): any;
    export function clamp(x: number, min: number, max: number): number;
    export const sleep: (ms: number) => Promise<unknown>;
    export const T: {
        Ms: number;
        Sec: number;
        Min: number;
        Hour: number;
        Day: number;
    };
    export function randstr(length: number, alphabet: string): string;
    export function num(x: number | Long): number;
}
declare module "common/constants" {
    export const TMA_INIT_DATA_EXPIRE_SECONDS: number;
    export const CRYPTO_PAY_INVOICE_EXPIRE_SECONDS: number;
    export const RECEIVE_GIFT_TOKEN_LIFETIME: number;
    export const INVALID_INLINE_QUERY_RESULT_CACHE_SECONDS = 15;
    export const VALID_SEND_GIFT_INLINE_QUERY_RESULT_CACHE_SECONDS = 10;
}
declare module "common/crypto-pay/types" {
    export type Invoice = {
        currency_type: 'fiat' | 'crypto';
        asset?: CryptoCurrency;
        fiat?: FiatCurrency;
        accepted_assets?: CryptoCurrency[];
        invoice_id: number;
        hash: string;
        amount: string;
        created_at: string;
        description?: string;
        hidden_message?: string;
        payload?: string;
        status: InvoiceStatus;
        bot_invoice_url: string;
        mini_app_invoice_url: string;
        web_app_invoice_url: string;
        allow_comments?: boolean;
        allow_anonymous?: boolean;
        expiration_date?: string;
        paid_at?: string;
        paid_asset?: CryptoCurrency;
        paid_amount?: string;
        paid_fiat_rate?: string;
        paid_usd_rate?: string;
        paid_anonymously?: boolean;
        comment?: string;
        fee_asset?: CryptoCurrency;
        fee_amount?: number;
        paid_btn_name?: PaidButtonName;
        paid_btn_url?: string;
    };
    export type InvoiceStatus = 'active' | 'paid' | 'expired';
    export type PaidButtonName = 'viewItem' | 'openChannel' | 'openBot' | 'callback';
    export type CryptoCurrency = 'USDT' | 'TON' | 'BTC' | 'ETH' | 'LTC' | 'BNB' | 'TRX' | 'USDC' | 'JET';
    export type FiatCurrency = 'USD' | 'EUR' | 'RUB' | 'BYN' | 'UAH' | 'GBP' | 'CNY' | 'KZT' | 'UZS' | 'GEL' | 'TRY' | 'AMD' | 'THB' | 'INR' | 'BRL' | 'IDR' | 'AZN' | 'AED' | 'PLN' | 'ILS';
}
declare module "common/crypto-pay/errors" {
    export class NetworkError extends Error {
        originalError: unknown;
        constructor(originalError: unknown);
    }
    export class InvalidResponseError extends Error {
        originalError: unknown;
        constructor(originalError: unknown);
    }
    export class RequestFailedError extends Error {
        detail: unknown;
        constructor(detail: unknown);
    }
}
declare module "common/crypto-pay/client" {
    import type { CryptoCurrency, FiatCurrency, Invoice, InvoiceStatus, PaidButtonName } from "common/crypto-pay/types";
    export class CryptoPay {
        private baseUrl;
        private token;
        constructor(baseUrl: string, token: string);
        getInvoices(options: {
            asset?: CryptoCurrency;
            fiat?: FiatCurrency;
            ids?: number[];
            status?: InvoiceStatus;
            offset?: number;
            count?: number;
        }): Promise<{
            items: Invoice[];
        }>;
        createInvoice(options: {
            currency_type?: 'crypto' | 'fiat';
            asset?: CryptoCurrency;
            fiat?: FiatCurrency;
            accepted_assets?: CryptoCurrency[];
            amount: string;
            description?: string;
            hidden_message?: string;
            paid_btn_name?: PaidButtonName;
            paid_btn_url?: string;
            payload?: string;
            allow_comments?: boolean;
            allow_anonymous?: boolean;
            expires_in?: number;
        }): Promise<Invoice>;
        private request;
    }
}
declare module "common/crypto-pay/index" {
    export * from "common/crypto-pay/client";
    export * from "common/crypto-pay/errors";
    export * from "common/crypto-pay/types";
}
declare module "common/db/documents" {
    import type { Binary, Long, ObjectId } from 'mongodb';
    import type { Price } from "api/schemas";
    import type { Invoice } from "common/crypto-pay/index";
    export type User = {
        _id: ObjectId;
        name: string;
        createdAt: Date;
        receivedGiftsCount: number;
        tg: {
            id: Long;
            hasPremium: boolean;
            languageCode?: string;
            username?: string;
            firstName: string;
            lastName?: string;
        };
    };
    export type UserAvatar = {
        /** Matches the user's _id. */
        _id: ObjectId;
        /** Undefined if wasn't updated yet. */
        updatedAt?: Date;
        avatar: Binary | null;
    };
    export type Gift = {
        _id: ObjectId;
        kindId: ObjectId;
        purchaserId: ObjectId;
        /**
         * Short string used by the purchaser to send this gift.
         * Unique across other gifts purchased by the same user.
         */
        sendToken: string;
        invoice: Invoice;
    } & ({
        status: 'reserved';
    } | {
        status: 'purchased';
        order: number;
    } | {
        status: 'sent';
        order: number;
        sentAt: Date;
        receiverId: ObjectId;
    });
    export type GiftKind = {
        _id: ObjectId;
        name: string;
        price: Price;
        limit: number;
        purchasedCount: number;
        reservedCount: number;
    };
    export type GiftAction = {
        _id: ObjectId;
        giftId: ObjectId;
        date: Date;
    } & ({
        type: 'purchase';
        purchaserId: ObjectId;
        price: Price;
    } | {
        type: 'sending';
        senderId: ObjectId;
        receiverId: ObjectId;
    });
    export type GiftReceiveToken = {
        _id: string;
        giftId: ObjectId;
        issuedAt: Date;
    };
}
declare module "common/db/utils" {
    export function assertModifiedCount(actual: number, expected: number): void;
    export function assertDeletedCount(actual: number, expected: number): void;
}
declare module "common/config" {
    import { z } from 'zod';
    const Config: z.ZodObject<{
        ENVIRONMENT: z.ZodEnum<["dev", "prod"]>;
        LISTEN_PORT: z.ZodDefault<z.ZodNumber>;
        LISTEN_HOST: z.ZodDefault<z.ZodString>;
        CORS_ALLOWED_ORIGINS: z.ZodDefault<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>>;
        BOT_TOKEN: z.ZodString;
        MONGO_URL: z.ZodString;
        CRYPTO_PAY_TOKEN: z.ZodString;
        CRYPTO_PAY_BASE_URL: z.ZodString;
        MINI_APP_URL: z.ZodString;
        MINI_APP_SHORT_NAME: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        ENVIRONMENT: "dev" | "prod";
        LISTEN_PORT: number;
        LISTEN_HOST: string;
        CORS_ALLOWED_ORIGINS: string[];
        BOT_TOKEN: string;
        MONGO_URL: string;
        CRYPTO_PAY_TOKEN: string;
        CRYPTO_PAY_BASE_URL: string;
        MINI_APP_URL: string;
        MINI_APP_SHORT_NAME: string;
    }, {
        ENVIRONMENT: "dev" | "prod";
        BOT_TOKEN: string;
        MONGO_URL: string;
        CRYPTO_PAY_TOKEN: string;
        CRYPTO_PAY_BASE_URL: string;
        MINI_APP_URL: string;
        MINI_APP_SHORT_NAME: string;
        LISTEN_PORT?: number | undefined;
        LISTEN_HOST?: string | undefined;
        CORS_ALLOWED_ORIGINS?: unknown;
    }>;
    export type Config = z.infer<typeof Config>;
    export function loadConfig(): Config;
}
declare module "common/logging" {
    import type { FastifyBaseLogger, PinoLoggerOptions } from 'fastify/types/logger';
    import type { Logger as PinoLogger } from 'pino';
    import type { Config } from "common/config";
    export function pinoOptionsForEnv(env: Config['ENVIRONMENT']): PinoLoggerOptions;
    export type Logger = PinoLogger | FastifyBaseLogger;
}
declare module "common/db/mongo" {
    import { MongoClient } from 'mongodb';
    import type { Gift, GiftAction, GiftKind, GiftReceiveToken, User, UserAvatar } from "common/db/documents";
    import type { Logger } from "common/logging";
    export type Database = Awaited<ReturnType<typeof initMongo>>;
    export function initMongo(url: string, logger: Logger): Promise<{
        client: MongoClient;
        users: import("mongodb").Collection<User>;
        userAvatars: import("mongodb").Collection<UserAvatar>;
        gifts: import("mongodb").Collection<Gift>;
        giftKinds: import("mongodb").Collection<GiftKind>;
        giftActions: import("mongodb").Collection<GiftAction>;
        giftReceiveTokens: import("mongodb").Collection<GiftReceiveToken>;
    }>;
}
declare module "common/gift-tokens" {
    import type { ObjectId } from 'mongodb';
    import type { GiftReceiveToken } from "common/db/documents";
    import type { Database } from "common/db/mongo";
    export function parseSendToken(s: string): string | null;
    export function generateSendToken(): string;
    export function getReceiveTokenForGift(giftId: ObjectId, db: Database): Promise<GiftReceiveToken>;
}
declare module "common/locales/en" {
    const _default: {
        bot: {
            bio: string;
            intro: string;
            commands: {
                start: string;
            };
        };
        buttons: {
            openApp: string;
            viewGift: string;
            openGifts: string;
            receiveGift: string;
        };
        cryptoPay: {
            invoiceDescription: (giftName: string) => string;
        };
        messages: {
            start: string;
            inline: {
                sendGift: {
                    title: string;
                    description: (giftName: string) => string;
                    message: string;
                };
            };
        };
        notifications: {
            youPurchasedGift: (giftName: string) => string;
            youReceivedGift: ({ senderName, giftName }: {
                senderName: string;
                giftName: string;
            }) => string;
            yourGiftReceived: ({ recipientName, giftName }: {
                recipientName: string;
                giftName: string;
            }) => string;
        };
    };
    export default _default;
}
declare module "common/locales/ru" {
    const _default_1: {
        bot: {
            bio: string;
            intro: string;
            commands: {
                start: string;
            };
        };
        buttons: {
            openApp: string;
            viewGift: string;
            openGifts: string;
            receiveGift: string;
        };
        cryptoPay: {
            invoiceDescription: (giftName: string) => string;
        };
        messages: {
            start: string;
            inline: {
                sendGift: {
                    title: string;
                    description: (giftName: string) => string;
                    message: string;
                };
            };
        };
        notifications: {
            youPurchasedGift: (giftName: string) => string;
            youReceivedGift: ({ senderName, giftName }: {
                senderName: string;
                giftName: string;
            }) => string;
            yourGiftReceived: ({ recipientName, giftName }: {
                recipientName: string;
                giftName: string;
            }) => string;
        };
    };
    export default _default_1;
}
declare module "common/locales/index" {
    import en from "common/locales/en";
    import ru from "common/locales/ru";
    export type Locale = typeof en;
    export { en, ru };
}
declare module "common/tg-user" {
    import type { User } from "common/db/documents";
    import type { Database } from "common/db/mongo";
    import type { Locale } from "common/locales/index";
    import type { Logger } from "common/logging";
    export type TelegramUser = {
        id: number;
        languageCode: string | undefined;
        isPremium: boolean | undefined;
        username: string | undefined;
        firstName: string;
        lastName: string | undefined;
    };
    export function upsertTgUser(tgUser: TelegramUser, db: Database, logger: Logger): Promise<User>;
    export function localeForUserLanguageCode(langCode: string | undefined | null): Locale;
}
declare module "api/auth" {
    import type { FastifyRequest } from 'fastify';
    export function extractTmaInitData(req: FastifyRequest, token: string): import("@telegram-apps/types").InitData | undefined;
}
declare module "api/context" {
    import type { InitData } from '@telegram-apps/init-data-node';
    import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
    import type { Api } from 'grammy';
    import type { Config } from "common/config";
    import type { CryptoPay } from "common/crypto-pay/index";
    import type { Database } from "common/db/mongo";
    import { type Locale } from "common/locales/index";
    import type { Logger } from "common/logging";
    export type Context = {
        config: Config;
        logger: Logger;
        db: Database;
        cryptoPay: CryptoPay;
        tgApi: Api;
        t: Locale;
        tmaInitData?: InitData;
    };
    export function contextBuilder({ db, config, cryptoPay, tgApi, }: {
        db: Database;
        config: Config;
        cryptoPay: CryptoPay;
        tgApi: Api;
    }): ({ req }: CreateFastifyContextOptions) => Promise<Context>;
}
declare module "api/trpc" {
    import type { Context } from "api/context";
    export const router: {
        <TInput extends import("@trpc/server").RouterRecord>(input: TInput): import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
            ctx: Context;
            meta: object;
            errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
            transformer: false;
        }, TInput>;
        <TInput extends import("@trpc/server/unstable-core-do-not-import").CreateRouterOptions>(input: TInput): import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
            ctx: Context;
            meta: object;
            errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
            transformer: false;
        }, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<TInput>>;
    };
    export const publicProcedure: import("@trpc/server/unstable-core-do-not-import").ProcedureBuilder<Context, object, object, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, false>;
    export const miniAppProcedure: import("@trpc/server/unstable-core-do-not-import").ProcedureBuilder<Context, object, {
        db: {
            client: import("mongodb").MongoClient;
            users: import("mongodb").Collection<import("common/db/documents").User>;
            userAvatars: import("mongodb").Collection<import("common/db/documents").UserAvatar>;
            gifts: import("mongodb").Collection<import("common/db/documents").Gift>;
            giftKinds: import("mongodb").Collection<import("common/db/documents").GiftKind>;
            giftActions: import("mongodb").Collection<import("common/db/documents").GiftAction>;
            giftReceiveTokens: import("mongodb").Collection<import("common/db/documents").GiftReceiveToken>;
        };
        config: {
            ENVIRONMENT: "dev" | "prod";
            LISTEN_PORT: number;
            LISTEN_HOST: string;
            CORS_ALLOWED_ORIGINS: string[];
            BOT_TOKEN: string;
            MONGO_URL: string;
            CRYPTO_PAY_TOKEN: string;
            CRYPTO_PAY_BASE_URL: string;
            MINI_APP_URL: string;
            MINI_APP_SHORT_NAME: string;
        };
        cryptoPay: import("common/crypto-pay").CryptoPay;
        tgApi: import("grammy").Api<import("grammy").RawApi>;
        logger: import("common/logging").Logger;
        t: {
            bot: {
                bio: string;
                intro: string;
                commands: {
                    start: string;
                };
            };
            buttons: {
                openApp: string;
                viewGift: string;
                openGifts: string;
                receiveGift: string;
            };
            cryptoPay: {
                invoiceDescription: (giftName: string) => string;
            };
            messages: {
                start: string;
                inline: {
                    sendGift: {
                        title: string;
                        description: (giftName: string) => string;
                        message: string;
                    };
                };
            };
            notifications: {
                youPurchasedGift: (giftName: string) => string;
                youReceivedGift: ({ senderName, giftName }: {
                    senderName: string;
                    giftName: string;
                }) => string;
                yourGiftReceived: ({ recipientName, giftName }: {
                    recipientName: string;
                    giftName: string;
                }) => string;
            };
        };
        tmaInitData: import("@telegram-apps/types").InitData | undefined;
        user: import("common/db/documents").User;
    }, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, false>;
}
declare module "api/router" {
    export type AppRouter = typeof appRouter;
    export const appRouter: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: import("api/context").Context;
        meta: object;
        errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
        transformer: false;
    }, {
        me: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                isPremium: boolean;
                receivedGiftsCount: number;
                rank: number;
            };
        }>;
        user: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: {
                id: string;
                name: string;
                isPremium: boolean;
                receivedGiftsCount: number;
                rank: number;
            };
        }>;
        giftKinds: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                price: {
                    asset: "TON" | "USDT" | "ETH";
                    amount: string;
                };
                limit: number;
                inStock: number;
            }[];
        }>;
        mySendableGifts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                kindId: string;
                order: number;
                purchasePrice: {
                    asset: "TON" | "USDT" | "ETH";
                    amount: string;
                };
                purchaseDate: Date;
                sendToken: string;
            }[];
        }>;
        myGiftStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                giftId: string;
            };
            output: {
                status: "pending";
            } | {
                status: "purchased";
                gift: {
                    id: string;
                    kindId: string;
                    order: number;
                    purchasePrice: {
                        asset: "TON" | "USDT" | "ETH";
                        amount: string;
                    };
                    purchaseDate: Date;
                    sendToken: string;
                };
            } | {
                status: "sent";
                gift: {
                    id: string;
                    kindId: string;
                    order: number;
                    senderId: string;
                    purchasePrice: {
                        asset: "TON" | "USDT" | "ETH";
                        amount: string;
                    };
                    sentAt: Date;
                };
            };
        }>;
        requestPurchaseGift: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                kindId: string;
            };
            output: {
                giftId: string;
                purchaseLink: string;
            };
        }>;
        receiveGift: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                receiveToken: string;
            };
            output: {
                id: string;
                kindId: string;
                order: number;
                senderId: string;
                purchasePrice: {
                    asset: "TON" | "USDT" | "ETH";
                    amount: string;
                };
                sentAt: Date;
            };
        }>;
        userGifts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                my: true;
            } | {
                userId: string;
                my?: false | undefined;
            };
            output: {
                id: string;
                kindId: string;
                order: number;
                senderId: string;
                purchasePrice: {
                    asset: "TON" | "USDT" | "ETH";
                    amount: string;
                };
                sentAt: Date;
            }[];
        }>;
        myActions: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: never;
        }>;
        leaderboard: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
                offset?: number | undefined;
            };
            output: {
                id: string;
                name: string;
                isPremium: boolean;
                receivedGiftsCount: number;
                rank: number;
            }[];
        }>;
    }>;
}
