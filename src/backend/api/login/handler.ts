import Handler from "@backend/modules/Handler";
import {NextResponse} from "next/server";
import prisma from "@backend/modules/prisma/Prisma";

export const TapLevels = Array.from({length: 10}).map((_,n) => ({
    "rate": n+1,
    "energy": (n+1)*2,
    "price": 50 * (Math.round(n * 2.5))
}));
export const ChargeLevels = Array.from({length: 10}).map((_,i) => {
    const n = Math.max(1, Math.round(i * 3.5))
    return {
        "rate": i,
        "price": n * 1000
    };
});
export const Leagues = [
    {
        "name": "wood",
        "title": "Wood League",
        "score": 0,
        "reward": 0,
        "reward_ref": 0
    },
    {
        "name": "bronze",
        "title": "Bronze League",
        "score": 1,
        "reward": 1000,
        "reward_ref": 2000
    },
    {
        "name": "silver",
        "title": "Silver League",
        "score": 5000,
        "reward": 5000,
        "reward_ref": 5000
    },
    {
        "name": "gold",
        "title": "Gold League",
        "score": 50000,
        "reward": 10000,
        "reward_ref": 10000
    },
    {
        "name": "platinum",
        "title": "Platinum League",
        "score": 250000,
        "reward": 30000,
        "reward_ref": 15000
    },
    {
        "name": "diamond",
        "title": "Diamond League",
        "score": 500000,
        "reward": 50000,
        "reward_ref": 25000
    },
    {
        "name": "master",
        "title": "Master League",
        "score": 1000000,
        "reward": 100000,
        "reward_ref": 50000
    },
    {
        "name": "grandmaster",
        "title": "Grandmaster League",
        "score": 2500000,
        "reward": 250000,
        "reward_ref": 125000
    },
    {
        "name": "elite",
        "title": "Elite League",
        "score": 5000000,
        "reward": 500000,
        "reward_ref": 250000
    },
    {
        "name": "legendary",
        "title": "Legendary League",
        "score": 10000000,
        "reward": 1000000,
        "reward_ref": 500000
    },
    {
        "name": "mythic",
        "title": "Mythic League",
        "score": 50000000,
        "reward": 5000000,
        "reward_ref": 2500000
    }
]
export const EnergyLevels = Array.from({length: 30}).map((_, n) => {
    n = Math.max(1, Math.round(n * 1.5));

    return {
        "limit": n * 250,
        "price": n * (Math.round(500 * (n / 2)))
    }
});
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
            "ligue": (Leagues.length - 1) - [...Leagues].reverse().findIndex(l => l.score < user.wallet) + 1,
            "energy_level": 20,
            "charge_level": 1,
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
        return userDetails(user);

    }
}
