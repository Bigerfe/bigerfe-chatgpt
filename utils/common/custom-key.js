

const ErrorCode = {
  cardDisable: -999, //卡密无效
}

const USER_SK_IDS_KEY = 'user-sk-ids';
const PRICE_KEY_PREFIX='pmkpr-';//收费key的前缀，会作为key存储reids，然后请求时根据index来获取
//另外需要开发一个设置key的入口

function getDefaultKey(key) {
  if(key.indexOf('sk-')>-1) {
    return key;
  }
  const buketStr = 'bucket';
  const keyArr = key.split(buketStr);
  const realKey = keyArr[0];
  let keyBucket = keyArr[1];
  
  const cusKeyObj = CustomCards[realKey];
  if (!cusKeyObj || !cusKeyObj.status) {
    return ErrorCode.cardDisable.toString(); //卡密已无效，请重新获取。
  }

  const index = cusKeyObj.index || 0; //0 free ，其他是收费

  if(index !== 0){
    //0是免费的，其他的是收费的，其他的如果么有后缀信息，则默认是1
    keyBucket = keyBucket || 1; //默认第一个桶
  }else{
    keyBucket = 0;
  }
  const s00 = 'WO42sZxtf9rf1';
  const s10 = '0zxPAAf5T3BlbkF'
  const s20 = 'J5PIXrfL42QVfk81Yrtad';


  //---sk-sk-xsk-
  const s01 = 'WO42sZxtf9rf';
  const s11 = '0zxPAAf5T3BlbkF'
  const s21 = 'J5PIXrfL42QVfk81Yrtad';

  //---sk-sk-
  const s02 = 'Ylncd2r2h';
  const s12 = '72KQJYGAQLfT3Blbk'
  const s22 = 'FJEZv6DGHK82lUbNBQdAeH';

  //---sk-sk-
  const s03 = '4goUBINI7Kf';
  const s13 = 'ViWQpqYjlT3BlbkFJT'
  const s23 = 'XWFSvTLtkPQDLb0nHMD';

  
  //---sk-sk-
  const s04 = '4tPrZOXm7Oqb';
  const s14 = 'K4bmnuWnT3BlbkF'
  const s24 = 'JSHVVymG7wmA7BMYNUW6o';


  //---sk-sk-
  const s05 = '4goUBINI7Kf';
  const s15 = 'ViWQpqYjlT3BlbkF'
  const s25 = 'JTXWFSvTLtkPQDLb0nHMD';


  //---sk-sk-99 独向账号
  const s099 = '4goUBINI7Kf';
  const s199 = 'ViWQpqYjlT3BlbkF'
  const s299 = 'JTXWFSvTLtkPQDLb0nHMD';

  const keyMap = {
    '0': `sk-${s00}${s10}${s20}`, //free
    '1': `sk-${s01}${s11}${s21}`, //shel
    '2': `sk-${s02}${s12}${s22}`, //shel
    '3': `sk-${s03}${s13}${s23}`, //shel
    '4': `sk-${s04}${s14}${s24}`, //shel
    '5': `sk-${s05}${s15}${s25}`, //shel
    '99': `sk-${s099}${s199}${s299}`, //独享账号 琪仔
  }

  return  keyMap[`${keyBucket}`];
}

const CustomCards = {
  'gk-guest3BlbkFJh': {
    status: 1,
  },
  "9c5d7c5e-7c5d-4c8e-9d5c-6d7c5d4c8e9d": {
    "status": 1
  },
  "3f6a8b2c-8b2c-4d1e-9a6b-6a8b2c4d1e9a": {
    "status": 1
  },
  "7e9f1d5a-1d5a-4b3c-8e9f-9f1d": {
    "status": 1
  },
  "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6": {
    "status": 1
  },
  "f1e2d3c4-b5a6-c7d8-e9f0-1a2b3c4d5e6": {
    "status": 1
  },
  "5f4e3d2c-1b2a-3c4d-5e6f-7a8b9c0d1e2": {
    "status": 1
  },
  "6a5b4c3d-2e1f-0c9d-8b7a-6f5e4d3c2b1": {
    "status": 1
  },
  "d1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a": {
    "status": 1
  },
  "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6": {
    "status": 1
  },
  "c1d2e3f4-a5b6-c7d8-e9f0-1a2b3c4d5e6": {
    "status": 1
  },
  "f1e2d3c4-b5a6-7c8d-9e0f-1a2b3c4d5e6": {
    "status": 1
  },
  "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7b6a5c4": {
    "status": 1
  },
  "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8": {
    "status": 1
  },
  "b1c2d3e4-f5a6-b7c8-d9e0-f1e2d3c4a5": {
    "status": 1
  },
  "5e4d3c2b-1a2b-3c4d-5e6f-7a8b9c0d1e2": {
    "status": 1
  },
  "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8": {
    "status": 1
  },
  "b1c2d3e4-f5a6-b7c8-d9e0-f1e2d3c4a5": {
    "status": 1
  },
  "c1d2e3f4-a5b6-c7d8-e9f0-1a2b3c4d5e6": {
    "status": 1
  },
  "f1e2d3c4-b5a6-7c8d-9e0f-1a2b3c4d5e6": {
    "status": 1
  },
  "f1e2d3c4-b5a6-7c8d-9e0f-1a2b3c4d5e6": {
    "status": 1
  },
  "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6": {"status": 1, "index": 1},
  "b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9": {"status": 1, "index": 1},
  "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5": {"status": 1, "index": 1},
  "d5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9": {"status": 1, "index": 1},
  "e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5": {"status": 1, "index": 1,"endtime": "2024-02-11"},
  "f5g6h7i8-j9k0-l1m2-n3o4-p5q6r7s8t9": {"status": 1, "index": 1,"endtime": "2024-02-11"},
  "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5": {"status": 1, "index": 1,"endtime": "2024-02-11"},
  "h5i6j7k8-l9m0-n1o2-p3q4-r5s6t7u8v9": {"status": 1, "index": 1,"endtime": "2024-02-11"},
  "i1j2k3l4-m5n6-o7p8-q9r0-s1t2u3v4w5": {"status": 1, "index": 1,"endtime": "2024-02-11"},
  "j5k6l7m8-n9o0-p1q2-r3s4-t5u6v7w8x9": {"status": 1, "index": 1,"endtime": "2024-02-11"},
  "da4a2d15-816f-4c4b-8d3a-9e1350c8a3a1": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "8b88e6c4-2cf0-423e-ae46-88c8b6148e5b": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "2d3f1f49-03d7-4b73-981f-3272aa0732a9": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "ec9a837d-2643-4b75-9b07-9d8d9e37b736": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "fb5c82ea-97f2-43a6-9d22-e0cc48560c22": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "88c72ff9-69b7-4e7c-8eaa-8b5b0be97e47": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "e6e7a9d2-3990-4d9e-834e-25f3daa8c5ac": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "125751d4-8ef2-47d9-9b92-8df8b7f8a64d": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "89c3e4b6-b13c-4730-a439-ea05c4dafe13": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "6fc4ac9b-40ef-4089-81b1-2170d09eb0d0": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "7c3a00a0-2b97-49c8-9d50-9d83be3564ea": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "7e4f4f36-1491-49c7-b5d7-7e64204d6e3d": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "2b6887cd-bec0-4a1a-8d04-5f3783e3ec57": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "34c9aa4d-81f8-4b14-87eb-977c546edcbc": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "f9e6a591-02e4-4e18-880d-69d7d92a92c8": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "cd8df0cc-e578-4799-9c8b-df141c856c6b": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "a3cbb9d3-06e5-4fe4-8a5c-5abfc44e3187": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "54349f14-4b85-4c57-9812-1d40d22560f7": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "fdb1b798-0620-4a4e-a1d7-7278e87955e2": {"status": 1, "index": 1, "endtime": "2024-02-20"},
  "bcc09d4d-4e18-4b89-86b2-5087264a167e": {"status": 1, "index": 1, "endtime": "2024-02-20"}
}

export default {
  getDefaultKey,
  CustomCards,
  ErrorCode,
  USER_SK_IDS_KEY
}
