import Handler from "@backend/modules/Handler";
import {NextResponse} from "next/server";
import prisma, {ChargeLevels, EnergyLevels, Leagues, TapLevels} from "@backend/modules/prisma/Prisma";


export async function userDetails(user: Awaited<ReturnType<typeof prisma.user.findUnique>>) {
    if (!user) return null;

    const refs = await prisma.user.count({
        where: {
            refId: user.id
        }
    })

    return {
        "access_token": user.token,
        "player": {
            "id": user.id,
            "name": user.username,
            "full_name": user.username,
            "login_ts": 1715204732230,
            "time": 1715204732230,
            "energy": user.energy,
            "shares": user.wallet,
            "tokens": 99,
            "ligue": user.wallet === 0 ? 1:(Leagues.length - 1) - [...Leagues].reverse().findIndex(l => l.score < user.wallet) + 1,
            "energy_level": user.energyLvl,
            "charge_level": user.chargeLvl,
            "tap_level": user.tapLvl,
            "tap_bot": false,
            "boost": [],
            "boost_time": 1715126400000,
            "claims": [
                "L2"
            ],
            "stat": {
                "taps": user.wallet / user.tapLvl,
                "ref_in": refs,
                "ref_out": refs,
                "ref_cnt": refs,
                "earned": user.wallet,
                "reward": 0,
                "spent": user.wallet / user.tapLvl
            }
        },
        "account": {
            "id": 1016434018,
            "missions": {
                "completed": [],
                "active": [
                    {
                        "id": "M0",
                        "items": [
                            {
                                "type": "tg",
                                "verified": false,
                                "verified_at": 1715002326031
                            },
                            {
                                "type": "x",
                                "verified": false,
                                "verified_at": 1715002337660
                            },
                            {
                                "type": "website",
                                "verified": false,
                                "verified_at": 1715002348961
                            }
                        ]
                    },
                    {
                        "id": "M3",
                        "items": [
                            {
                                "type": "wallet_connect"
                            }
                        ]
                    }
                ]
            }
        },
        "bot_shares": 0,
        "conf": {
            "energy_levels": EnergyLevels,
            "charge_levels": ChargeLevels,
            "tap_levels": TapLevels,
            "ligues": Leagues,
            "ref_rewards": [
                {
                    "cnt": 0,
                    "reward": 0
                },
                {
                    "cnt": 1,
                    "reward": 2500
                },
                {
                    "cnt": 3,
                    "reward": 50000
                },
                {
                    "cnt": 10,
                    "reward": 200000
                },
                {
                    "cnt": 25,
                    "reward": 250000
                },
                {
                    "cnt": 50,
                    "reward": 300000
                },
                {
                    "cnt": 100,
                    "reward": 500000
                },
                {
                    "cnt": 500,
                    "reward": 2000000
                },
                {
                    "cnt": 1000,
                    "reward": 2500000
                },
                {
                    "cnt": 10000,
                    "reward": 10000000
                },
                {
                    "cnt": 100000,
                    "reward": 100000000
                }
            ],
            "boosts": {
                "energy": {
                    "duration": 0
                },
                "turbo": {
                    "duration": 20,
                    "rateMult": 5
                },
                "double": {
                    "duration": 86400,
                    "rateMult": 2,
                    "energy": 1
                }
            },
            "tap_bot": {
                "duration": 43200,
                "price": 200000
            },
            "notifications": {
                "NL": [
                    {
                        "reward": 100000,
                        "sleep_time_hours": 6
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 18
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 144
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 96
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 96
                    }
                ],
                "NT": [
                    {
                        "reward": 0,
                        "sleep_time_hours": 48
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 48
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 48
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 48
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 96
                    }
                ],
                "NB": [
                    {
                        "reward": 0,
                        "sleep_time_hours": 12
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 24
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 24
                    },
                    {
                        "reward": 0,
                        "sleep_time_hours": 48
                    }
                ]
            },
            "missions": [
                {
                    "id": "M0",
                    "title": "Join our socials",
                    "description": "We regularly share valuable content on our socials. Join us there and get the rewards",
                    "reward": 200000,
                    "items": [
                        {
                            "type": "tg",
                            "name": "@DODO Coinai",
                            "link": "https://t.me/DODO Coinai"
                        },
                        {
                            "type": "x",
                            "name": "DODO Coinai"
                        },
                        {
                            "type": "website",
                            "name": "https://DODO Coin.ai/"
                        }
                    ]
                },
                {
                    "id": "M3",
                    "title": "Connect Solana wallet",
                    "description": "Log in to DODO Coin with your Solana Wallet. All project and partner drops will be sent to the wallet you provide here.\nIf you don't have a Solana wallet, you can download the Phantom wallet from https://phantom.app/ or feel free to download any other legitimate Solana wallets",
                    "reward": 100000,
                    "items": [
                        {
                            "type": "wallet_connect",
                            "name": "Solana address"
                        }
                    ]
                }
            ]
        },
        "settings": {
            "start_date": "2024-02-15T00:00:00.000Z",
            "submit_interval_s": 15
        }
    };
}

export default class LoginHandler extends Handler {
    async handler() {
        const token = this.get('token', "Token Required");
        const user = await prisma.user.findUnique({
            where: {
                token: token+""
            }
        });
        if (!user) throw(401);
        const res = NextResponse.json(await userDetails(user));
        res.cookies.set("token", token, {
            path: "/",
            expires: new Date().getTime() + (3600 * 60 * 60)
        });
        return res;
    }
}
