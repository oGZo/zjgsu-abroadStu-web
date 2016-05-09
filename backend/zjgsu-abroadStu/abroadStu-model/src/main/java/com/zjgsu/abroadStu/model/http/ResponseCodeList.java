package com.zjgsu.abroadStu.model.http;

/**
 * Created by JIADONG on 16/3/16.
 */
public class ResponseCodeList {
    // 请求成功码
    public static final int Success = 0;

    //失败码
    public static final int Fail = 1000;

    //token过期
    public static final int EXPIRED_TOKEN= 99;

    // 服务端错误
    public static final int SERVER_ERROR  = 5001;

    // api过期
    public static final int API_EXPIRED = 5002;

}
