
"use strict";

const combiningChars = new Set([768,769,770,771,772,773,774,775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,1155,1156,1157,1158,1159,1160,1161,1425,1426,1427,1428,1429,1430,1431,1432,1433,1434,1435,1436,1437,1438,1439,1440,1441,1442,1443,1444,1445,1446,1447,1448,1449,1450,1451,1452,1453,1454,1455,1456,1457,1458,1459,1460,1461,1462,1463,1464,1465,1466,1467,1468,1469,1471,1473,1474,1476,1477,1479,1552,1553,1554,1555,1556,1557,1558,1559,1560,1561,1562,1611,1612,1613,1614,1615,1616,1617,1618,1619,1620,1621,1622,1623,1624,1625,1626,1627,1628,1629,1630,1631,1648,1750,1751,1752,1753,1754,1755,1756,1759,1760,1761,1762,1763,1764,1767,1768,1770,1771,1772,1773,1809,1840,1841,1842,1843,1844,1845,1846,1847,1848,1849,1850,1851,1852,1853,1854,1855,1856,1857,1858,1859,1860,1861,1862,1863,1864,1865,1866,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,2027,2028,2029,2030,2031,2032,2033,2034,2035,2070,2071,2072,2073,2075,2076,2077,2078,2079,2080,2081,2082,2083,2085,2086,2087,2089,2090,2091,2092,2093,2137,2138,2139,2260,2261,2262,2263,2264,2265,2266,2267,2268,2269,2270,2271,2272,2273,2275,2276,2277,2278,2279,2280,2281,2282,2283,2284,2285,2286,2287,2288,2289,2290,2291,2292,2293,2294,2295,2296,2297,2298,2299,2300,2301,2302,2303,2304,2305,2306,2307,2362,2363,2364,2366,2367,2368,2369,2370,2371,2372,2373,2374,2375,2376,2377,2378,2379,2380,2381,2382,2383,2385,2386,2387,2388,2389,2390,2391,2402,2403,2433,2434,2435,2492,2494,2495,2496,2497,2498,2499,2500,2503,2504,2507,2508,2509,2519,2530,2531,2561,2562,2563,2620,2622,2623,2624,2625,2626,2631,2632,2635,2636,2637,2641,2672,2673,2677,2689,2690,2691,2748,2750,2751,2752,2753,2754,2755,2756,2757,2759,2760,2761,2763,2764,2765,2786,2787,2810,2811,2812,2813,2814,2815,2817,2818,2819,2876,2878,2879,2880,2881,2882,2883,2884,2887,2888,2891,2892,2893,2902,2903,2914,2915,2946,3006,3007,3008,3009,3010,3014,3015,3016,3018,3019,3020,3021,3031,3072,3073,3074,3075,3134,3135,3136,3137,3138,3139,3140,3142,3143,3144,3146,3147,3148,3149,3157,3158,3170,3171,3201,3202,3203,3260,3262,3263,3264,3265,3266,3267,3268,3270,3271,3272,3274,3275,3276,3277,3285,3286,3298,3299,3328,3329,3330,3331,3387,3388,3390,3391,3392,3393,3394,3395,3396,3398,3399,3400,3402,3403,3404,3405,3415,3426,3427,3458,3459,3530,3535,3536,3537,3538,3539,3540,3542,3544,3545,3546,3547,3548,3549,3550,3551,3570,3571,3633,3636,3637,3638,3639,3640,3641,3642,3655,3656,3657,3658,3659,3660,3661,3662,3761,3764,3765,3766,3767,3768,3769,3771,3772,3784,3785,3786,3787,3788,3789,3864,3865,3893,3895,3897,3902,3903,3953,3954,3955,3956,3957,3958,3959,3960,3961,3962,3963,3964,3965,3966,3967,3968,3969,3970,3971,3972,3974,3975,3981,3982,3983,3984,3985,3986,3987,3988,3989,3990,3991,3993,3994,3995,3996,3997,3998,3999,4000,4001,4002,4003,4004,4005,4006,4007,4008,4009,4010,4011,4012,4013,4014,4015,4016,4017,4018,4019,4020,4021,4022,4023,4024,4025,4026,4027,4028,4038,4139,4140,4141,4142,4143,4144,4145,4146,4147,4148,4149,4150,4151,4152,4153,4154,4155,4156,4157,4158,4182,4183,4184,4185,4190,4191,4192,4194,4195,4196,4199,4200,4201,4202,4203,4204,4205,4209,4210,4211,4212,4226,4227,4228,4229,4230,4231,4232,4233,4234,4235,4236,4237,4239,4250,4251,4252,4253,4957,4958,4959,5906,5907,5908,5938,5939,5940,5970,5971,6002,6003,6068,6069,6070,6071,6072,6073,6074,6075,6076,6077,6078,6079,6080,6081,6082,6083,6084,6085,6086,6087,6088,6089,6090,6091,6092,6093,6094,6095,6096,6097,6098,6099,6109,6155,6156,6157,6277,6278,6313,6432,6433,6434,6435,6436,6437,6438,6439,6440,6441,6442,6443,6448,6449,6450,6451,6452,6453,6454,6455,6456,6457,6458,6459,6679,6680,6681,6682,6683,6741,6742,6743,6744,6745,6746,6747,6748,6749,6750,6752,6753,6754,6755,6756,6757,6758,6759,6760,6761,6762,6763,6764,6765,6766,6767,6768,6769,6770,6771,6772,6773,6774,6775,6776,6777,6778,6779,6780,6783,6832,6833,6834,6835,6836,6837,6838,6839,6840,6841,6842,6843,6844,6845,6846,6912,6913,6914,6915,6916,6964,6965,6966,6967,6968,6969,6970,6971,6972,6973,6974,6975,6976,6977,6978,6979,6980,7019,7020,7021,7022,7023,7024,7025,7026,7027,7040,7041,7042,7073,7074,7075,7076,7077,7078,7079,7080,7081,7082,7083,7084,7085,7142,7143,7144,7145,7146,7147,7148,7149,7150,7151,7152,7153,7154,7155,7204,7205,7206,7207,7208,7209,7210,7211,7212,7213,7214,7215,7216,7217,7218,7219,7220,7221,7222,7223,7376,7377,7378,7380,7381,7382,7383,7384,7385,7386,7387,7388,7389,7390,7391,7392,7393,7394,7395,7396,7397,7398,7399,7400,7405,7410,7411,7412,7415,7416,7417,7616,7617,7618,7619,7620,7621,7622,7623,7624,7625,7626,7627,7628,7629,7630,7631,7632,7633,7634,7635,7636,7637,7638,7639,7640,7641,7642,7643,7644,7645,7646,7647,7648,7649,7650,7651,7652,7653,7654,7655,7656,7657,7658,7659,7660,7661,7662,7663,7664,7665,7666,7667,7668,7669,7670,7671,7672,7673,7675,7676,7677,7678,7679,8400,8401,8402,8403,8404,8405,8406,8407,8408,8409,8410,8411,8412,8413,8414,8415,8416,8417,8418,8419,8420,8421,8422,8423,8424,8425,8426,8427,8428,8429,8430,8431,8432,11503,11504,11505,11647,11744,11745,11746,11747,11748,11749,11750,11751,11752,11753,11754,11755,11756,11757,11758,11759,11760,11761,11762,11763,11764,11765,11766,11767,11768,11769,11770,11771,11772,11773,11774,11775,12330,12331,12332,12333,12334,12335,12441,12442,42607,42608,42609,42610,42612,42613,42614,42615,42616,42617,42618,42619,42620,42621,42654,42655,42736,42737,43010,43014,43019,43043,43044,43045,43046,43047,43136,43137,43188,43189,43190,43191,43192,43193,43194,43195,43196,43197,43198,43199,43200,43201,43202,43203,43204,43205,43232,43233,43234,43235,43236,43237,43238,43239,43240,43241,43242,43243,43244,43245,43246,43247,43248,43249,43302,43303,43304,43305,43306,43307,43308,43309,43335,43336,43337,43338,43339,43340,43341,43342,43343,43344,43345,43346,43347,43392,43393,43394,43395,43443,43444,43445,43446,43447,43448,43449,43450,43451,43452,43453,43454,43455,43456,43493,43561,43562,43563,43564,43565,43566,43567,43568,43569,43570,43571,43572,43573,43574,43587,43596,43597,43643,43644,43645,43696,43698,43699,43700,43703,43704,43710,43711,43713,43755,43756,43757,43758,43759,43765,43766,44003,44004,44005,44006,44007,44008,44009,44010,44012,44013,64286,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65056,65057,65058,65059,65060,65061,65062,65063,65064,65065,65066,65067,65068,65069,65070,65071,66045,66272,66422,66423,66424,66425,66426,68097,68098,68099,68101,68102,68108,68109,68110,68111,68152,68153,68154,68159,68325,68326,69632,69633,69634,69688,69689,69690,69691,69692,69693,69694,69695,69696,69697,69698,69699,69700,69701,69702,69759,69760,69761,69762,69808,69809,69810,69811,69812,69813,69814,69815,69816,69817,69818,69888,69889,69890,69927,69928,69929,69930,69931,69932,69933,69934,69935,69936,69937,69938,69939,69940,70003,70016,70017,70018,70067,70068,70069,70070,70071,70072,70073,70074,70075,70076,70077,70078,70079,70080,70090,70091,70092,70188,70189,70190,70191,70192,70193,70194,70195,70196,70197,70198,70199,70206,70367,70368,70369,70370,70371,70372,70373,70374,70375,70376,70377,70378,70400,70401,70402,70403,70460,70462,70463,70464,70465,70466,70467,70468,70471,70472,70475,70476,70477,70487,70498,70499,70502,70503,70504,70505,70506,70507,70508,70512,70513,70514,70515,70516,70709,70710,70711,70712,70713,70714,70715,70716,70717,70718,70719,70720,70721,70722,70723,70724,70725,70726,70832,70833,70834,70835,70836,70837,70838,70839,70840,70841,70842,70843,70844,70845,70846,70847,70848,70849,70850,70851,71087,71088,71089,71090,71091,71092,71093,71096,71097,71098,71099,71100,71101,71102,71103,71104,71132,71133,71216,71217,71218,71219,71220,71221,71222,71223,71224,71225,71226,71227,71228,71229,71230,71231,71232,71339,71340,71341,71342,71343,71344,71345,71346,71347,71348,71349,71350,71351,71453,71454,71455,71456,71457,71458,71459,71460,71461,71462,71463,71464,71465,71466,71467,72193,72194,72195,72196,72197,72198,72199,72200,72201,72202,72243,72244,72245,72246,72247,72248,72249,72251,72252,72253,72254,72263,72273,72274,72275,72276,72277,72278,72279,72280,72281,72282,72283,72330,72331,72332,72333,72334,72335,72336,72337,72338,72339,72340,72341,72342,72343,72344,72345,72751,72752,72753,72754,72755,72756,72757,72758,72760,72761,72762,72763,72764,72765,72766,72767,72850,72851,72852,72853,72854,72855,72856,72857,72858,72859,72860,72861,72862,72863,72864,72865,72866,72867,72868,72869,72870,72871,72873,72874,72875,72876,72877,72878,72879,72880,72881,72882,72883,72884,72885,72886,73009,73010,73011,73012,73013,73014,73018,73020,73021,73023,73024,73025,73026,73027,73028,73029,73031,92912,92913,92914,92915,92916,92976,92977,92978,92979,92980,92981,92982,94033,94034,94035,94036,94037,94038,94039,94040,94041,94042,94043,94044,94045,94046,94047,94048,94049,94050,94051,94052,94053,94054,94055,94056,94057,94058,94059,94060,94061,94062,94063,94064,94065,94066,94067,94068,94069,94070,94071,94072,94073,94074,94075,94076,94077,94078,94095,94096,94097,94098,113821,113822,119141,119142,119143,119144,119145,119149,119150,119151,119152,119153,119154,119163,119164,119165,119166,119167,119168,119169,119170,119173,119174,119175,119176,119177,119178,119179,119210,119211,119212,119213,119362,119363,119364,121344,121345,121346,121347,121348,121349,121350,121351,121352,121353,121354,121355,121356,121357,121358,121359,121360,121361,121362,121363,121364,121365,121366,121367,121368,121369,121370,121371,121372,121373,121374,121375,121376,121377,121378,121379,121380,121381,121382,121383,121384,121385,121386,121387,121388,121389,121390,121391,121392,121393,121394,121395,121396,121397,121398,121403,121404,121405,121406,121407,121408,121409,121410,121411,121412,121413,121414,121415,121416,121417,121418,121419,121420,121421,121422,121423,121424,121425,121426,121427,121428,121429,121430,121431,121432,121433,121434,121435,121436,121437,121438,121439,121440,121441,121442,121443,121444,121445,121446,121447,121448,121449,121450,121451,121452,121461,121476,121499,121500,121501,121502,121503,121505,121506,121507,121508,121509,121510,121511,121512,121513,121514,121515,121516,121517,121518,121519,122880,122881,122882,122883,122884,122885,122886,122888,122889,122890,122891,122892,122893,122894,122895,122896,122897,122898,122899,122900,122901,122902,122903,122904,122907,122908,122909,122910,122911,122912,122913,122915,122916,122918,122919,122920,122921,122922,125136,125137,125138,125139,125140,125141,125142,125252,125253,125254,125255,125256,125257,125258,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999])


module.exports = function isCombiningCharacter(c) {
return combiningChars.has(c);
};
