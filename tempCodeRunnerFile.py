import requests
from bs4 import BeautifulSoup

def listToString(s):
 
    # initialize an empty string
    str1 = ""
 
    # traverse in the string
    for ele in s:
        str1 += ele
 
    # return string
    return str1
# url = "https://leetcode.com/the_detective/"
url = "https://leetcode.com/{}".format("the_detective")+"/"
# page = requests.get(url)
# data_cc = BeautifulSoup(page.text, "html.parser")
# # ttg = data_cc.findAll("span", class_="mr-[5px] text-base font-medium leading-[20px] text-label-1 dark:text-dark-label-1")
# lt_questions=data_cc.findAll("span", class_="mr-[5px] text-base font-medium leading-[20px] text-label-1 dark:text-dark-label-1")
# print(int(listToString(lt_questions[0].text.split(','))))
# print(int(listToString(lt_questions[1].text.split(','))))
# print(int(listToString(lt_questions[2].text.split(','))))
# print(lt_questions[0].text.split(','))
# print(ttg[1].text)
# print(ttg[2].text)
print(url)
