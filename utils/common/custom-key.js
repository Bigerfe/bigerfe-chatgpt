

const ErrorCode = {
  cardDisable: -999, //卡密无效
}

const USER_SK_IDS_KEY = 'user-sk-ids';

function getDefaultKey(key) {
  if(key.indexOf('sk-')>-1) {
    return key;
  }
  const cusKeyObj = CustomCards[key];
  if (!cusKeyObj || !cusKeyObj.status) {
    return ErrorCode.cardDisable.toString(); //卡密已无效，请重新获取。
  }

  const index = cusKeyObj.index || 0; //0 free ，其他是收费

  const s00 = 'FcSmbhwdUJRj';
  const s10 = 'gNedNSC3T3BlbkFJY'
  const s20 = 'ko1qP05nj0l1IAQCbZW';
  //---
  const s01 = 'Q1KJl8A3yNlAym2';
  const s11 = 'Ve6OPT3BlbkFJND5ML'
  const s21 = 'vyKjn3onzBw4UiX';
  const keyMap = {
    '0': `sk-${s00}${s10}${s20}`, //free
    '1': `sk-${s01}${s11}${s21}`, //shel
  }

  return  keyMap[`${index}`];
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
  "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7b6a5c4": {
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
  "e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5": {"status": 1, "index": 1},
  "f5g6h7i8-j9k0-l1m2-n3o4-p5q6r7s8t9": {"status": 1, "index": 1},
  "g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5": {"status": 1, "index": 1},
  "h5i6j7k8-l9m0-n1o2-p3q4-r5s6t7u8v9": {"status": 1, "index": 1},
  "i1j2k3l4-m5n6-o7p8-q9r0-s1t2u3v4w5": {"status": 1, "index": 1},
  "j5k6l7m8-n9o0-p1q2-r3s4-t5u6v7w8x9": {"status": 1, "index": 1}
}

export default {
  getDefaultKey,
  CustomCards,
  ErrorCode,
  USER_SK_IDS_KEY
}
