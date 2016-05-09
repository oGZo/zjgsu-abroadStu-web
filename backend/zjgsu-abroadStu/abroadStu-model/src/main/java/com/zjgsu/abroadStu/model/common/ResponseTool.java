package com.zjgsu.abroadStu.model.common;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;



/**
 * Created by JIADONG on 16/4/11.
 */
public class ResponseTool {
    // 日志
    private static Logger LOG = LoggerFactory.getLogger(ResponseTool.class);
    /**
     * 将json或者xml写入response
     *
     * @param o
     * @param response
     * @param format
     */
    public static final void writeObjectToResponse(Object o, HttpServletResponse response, Format format){
        switch (format){
            case xml:
                writeObjectToResponseByXml(o, response);
                break;
            case json:
                writeObjectToResponseByJson(o, response);
                break;
        }
    }    
   
    /**
     * 将jsonp写入response
     *
     * @param o
     * @param response
     */
    public static final void writeJsonPToResponse(Object o, HttpServletResponse response,String callBack){
    	writeObjectToResponseByJsonP(o,response,callBack);
    }

    /**
     * 将xml写入response
     *
     * @param o
     * @param response
     */
    private static final void writeObjectToResponseByXml(Object o, HttpServletResponse response) {
        response.setContentType("text/xml");
        response.setCharacterEncoding("utf-8");
        try {
            response.getWriter().write(XMLTool.toXML(o));
            response.getWriter().flush();
            response.getWriter().close();
        }catch (Exception e){

        }

    }

    /**
     * 将json写入response
     *
     * @param o
     * @param response
     */
    private static final void writeObjectToResponseByJson(Object o, HttpServletResponse response){
        response.setContentType("text/json");
        response.setCharacterEncoding("utf-8");
        String s = JSON.toJSONString(o);
        LOG.info("the return json = " + s);
        try{
            response.getWriter().write(s);
            response.getWriter().flush();
            response.getWriter().close();
        }catch (Exception e){

        }

    }
    
    /**
     * 将json写入response
     *
     * @param o
     * @param response
     */
    private static final void writeObjectToResponseByJsonP(Object o, HttpServletResponse response,String callBack){
        response.setContentType("text/json");
        response.setCharacterEncoding("utf-8");
        String s = JSON.toJSONString(o);
        LOG.info("the return json = " + s);
        try{
            response.getWriter().write(callBack == null ? s : (callBack+"("+s+");"));
            response.getWriter().flush();
            response.getWriter().close();
        }catch (Exception e){

        }

    }
    public static enum Format {
        xml,
        json
    }
}
