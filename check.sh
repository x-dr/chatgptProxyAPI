#!/bin/bash
Font_Black="\033[30m";
Font_Red="\033[31m";
Font_Green="\033[32m";
Font_Yellow="\033[33m";
Font_Blue="\033[34m";
Font_Purple="\033[35m";
Font_SkyBlue="\033[36m";
Font_White="\033[37m";
Font_Suffix="\033[0m";
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
PLAIN='\033[0m'
BLUE="\033[36m"
SUPPORT_COUNTRY=(AL DZ AD AO AG AR AM AU AT AZ BS BD BB BE BZ BJ BT BA BW BR BG BF CV CA CL CO KM CR HR CY DK DJ DM DO EC SV EE FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IQ IE IL IT JM JP JO KZ KE KI KW KG LV LB LS LR LI LT LU MG MW MY MV ML MT MH MR MU MX MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PE PH PL PT QA RO RW KN LC VC WS SM ST SN RS SC SL SG SK SI SB ZA ES LK SR SE CH TH TG TO TT TN TR TV UG AE US UY VU ZM BO BN CG CZ VA FM MD PS KR TW TZ TL GB)

openai_v4() {
echo -e "OpenAI:"
if [[ $(curl -sS https://chat.openai.com/ -I | grep "text/plain") != "" ]]
then
	echo "您的 IP 已被封锁!"
else
	check4=`ping 1.1.1.1 -c 1 2>&1`;
	if [[ "$check4" != *"received"* ]] && [[ "$check4" != *"transmitted"* ]];then
		echo -e "\033[34mIPv4 is not supported on the current host. Skip...\033[0m";
	else
		iso2_code4=$(curl -4 -sS https://chat.openai.com/cdn-cgi/trace | grep "loc=" | awk -F= '{print $2}')
		if [[ "${SUPPORT_COUNTRY[@]}"  =~ "${iso2_code4}" ]]; 
		then
			echo -e "${GREEN}您的 IP 支持访问 OpenAI。 地区: ${iso2_code4}${PLAIN}" 
		else
			echo -e "${RED}地区: ${iso2_code4}. 目前不支持 OpenAI。${PLAIN}"
		fi
	fi
fi
}

openai_v6() {
echo -e "OpenAI:"
if [[ $(curl -sS https://chat.openai.com/ -I | grep "text/plain") != "" ]]
then
	echo "您的 IP 已被封锁!"
else

	check6=`ping6 240c::6666 -c 1 2>&1`;
	if [[ "$check6" != *"received"* ]] && [[ "$check6" != *"transmitted"* ]];then
		echo -e "\033[34m当前主机不支持 IPv6。 跳过...\033[0m";    
	else
		iso2_code6=$(curl -6 -sS https://chat.openai.com/cdn-cgi/trace | grep "loc=" | awk -F= '{print $2}')
		if [[ "${SUPPORT_COUNTRY[@]}"  =~ "${iso2_code6}" ]]; 
		then
			echo -e "${GREEN}您的 IP 支持访问 OpenAI。 地区: ${iso2_code6}${PLAIN}" 
		else
			echo -e "${RED}地区: ${iso2_code6}. 目前不支持 OpenAI。${PLAIN}"
		fi
	fi
fi
}


echo "-------------------------------------"
echo -e "${Font_SkyBlue} OpenAI解锁判断${Font_Suffix}"
echo -e "${Font_SkyBlue} https://github.com/x-dr/chatgptProxyAPI ${Font_Suffix}"
echo -e "${Font_SkyBlue} 脚本截取至GitHub：https://github.com/xb0or/nftest ${Font_Suffix}"
echo " ** 正在测试 IPv4 解锁情况";
check4=`ping 1.1.1.1 -c 1 2>&1`;
if [[ "$check4" != *"received"* ]] && [[ "$check4" != *"transmitted"* ]];then
    echo -e "\033[34m当前主机不支持IPv4,跳过...\033[0m";
else
    local_ipv4=$(curl -4 -s --max-time 10 api64.ipify.org)
    local_isp4=$(curl -s -4 --max-time 10  --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36" "https://api.ip.sb/geoip/${local_ipv4}" | grep organization | cut -f4 -d '"')
    echo -e "${BLUE}您的 IPv4: ${local_ipv4} - ${local_isp4}${PLAIN}"
openai_v4
fi
echo "====================================="
echo " ** 正在测试 IPv6 解锁情况";
check6=`ping6 240c::6666 -c 1 2>&1`;
if [[ "$check6" != *"received"* ]] && [[ "$check6" != *"transmitted"* ]];then
echo -e "\033[34m当前主机不支持IPv6,跳过...\033[0m";    
echo "-------------------------------------"
else
		local_ipv6=$(curl -6 -s --max-time 20 api64.ipify.org)
		local_isp6=$(curl -s -6 --max-time 10 --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36" "https://api.ip.sb/geoip/${local_ipv6}" | grep organization | cut -f4 -d '"')
                echo -e "${BLUE}您的 IPv6: ${local_ipv6} - ${local_isp6}${PLAIN}"
    openai_v6
    echo "-------------------------------------"
fi
