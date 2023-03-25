import crypto from 'crypto'; //加载crypto库

export default function (v) {

        var md5 = crypto.createHash('md5'); //定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
        md5.update(v);
        return md5.digest('hex'); //加密后的值d

}