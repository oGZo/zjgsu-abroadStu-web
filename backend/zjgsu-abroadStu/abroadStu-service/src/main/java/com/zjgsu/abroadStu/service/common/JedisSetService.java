package com.zjgsu.abroadStu.service.common;

public interface JedisSetService {

	/**
	 * 构造ToKen
	 */
	public String generationToKen(String account, String password,Integer userType,
								  String uip);

}
