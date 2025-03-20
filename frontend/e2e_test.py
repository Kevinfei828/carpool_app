from selenium.webdriver.chrome.service import Service
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import time


service = Service(executable_path='./chromedriver-linux64/chromedriver')

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--headless') 

driver = webdriver.Chrome(service=service,options=chrome_options)
driver.get('http://localhost:3000')
# driver.get("https://carpool-service-ui-cvklf2agbq-de.a.run.app/")


# Register
def register(user):
    login_page = driver.find_element(by=By.ID, value='nav-Login')
    login_page.click()
    time.sleep(0.5)

    register_button = driver.find_element(by=By.XPATH, value='//*[@id="root"]/div/div[2]/div/div/div/div[4]/p/a')
    register_button.click()

    username_block = driver.find_element(by=By.XPATH,
                                         value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div/input')
    username_block.clear()
    time.sleep(0.5)
    username_block.send_keys(user)
    time.sleep(0.5)

    password_block = driver.find_element(by=By.XPATH,
                                         value='/html/body/div/div/div[2]/div/div/div/div[2]/div/div/input')
    password_block.clear()
    time.sleep(0.5)
    password_block.send_keys('12345678')
    time.sleep(0.5)

    display_name_block = driver.find_element(by=By.XPATH,
                                             value='/html/body/div/div/div[2]/div/div/div/div[3]/div/div/input')
    display_name_block.clear()
    time.sleep(0.5)
    display_name_block.send_keys(user)
    time.sleep(0.5)

    # phone_block = driver.find_element(by=By.ID, value=':rb:')
    # phone_block.clear()
    # time.sleep(0.5)
    # phone_block.send_keys('0912345678')
    # time.sleep(0.5)

    # email_block = driver.find_element(by=By.ID, value=':rd:')
    # email_block.clear()
    # time.sleep(0.5)
    # email_block.send_keys('testplan1@gmail.com')
    # time.sleep(0.5)

    register = driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[6]/button')
    register.click()
    time.sleep(2)
    driver.switch_to.alert.accept()
    time.sleep(2)


# Login
def login(user):
    login_page = driver.find_element(by=By.ID, value='nav-Login')
    login_page.click()
    time.sleep(0.5)

    login_username_block = driver.find_element(by=By.XPATH,
                                               value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div/input')
    login_username_block.clear()
    time.sleep(0.5)
    login_username_block.send_keys(user)
    time.sleep(0.5)

    password_block = driver.find_element(by=By.XPATH,
                                         value='/html/body/div/div/div[2]/div/div/div/div[2]/div/div/input')
    password_block.clear()
    time.sleep(0.5)
    password_block.send_keys('12345678')
    time.sleep(0.5)

    signin_button = driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[3]/button')
    signin_button.click()

    time.sleep(2)


# User License
def user_license(license_path):
    user_page = driver.find_element(by=By.ID, value='nav-user')
    user_page.click()
    time.sleep(0.5)

    license_confirm = driver.find_element(by=By.XPATH,
                                          value='/html/body/div/div/div[2]/div/div/div/div[2]/div/div[2]/button')
    license_confirm.click()
    time.sleep(0.5)

    choose_license_file = driver.find_element(by=By.XPATH,
                                              value='/html/body/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/input')
    choose_license_file.send_keys(license_path)
    time.sleep(0.5)

    upload_button = driver.find_element(by=By.XPATH,
                                        value='/html/body/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/button')
    upload_button.click()
    time.sleep(2)


# Edit user information
def edit_user_information(display_name, user_email, user_phone):
    user_page = driver.find_element(by=By.ID, value='nav-user')
    user_page.click()
    time.sleep(0.5)

    edit = driver.find_element(by=By.XPATH,
                               value='/html/body/div/div/div[2]/div/div/div/div[1]/div[2]/div/div[1]/button')
    edit.click()
    time.sleep(0.5)

    edit_display_name = driver.find_element(by=By.XPATH,
                                            value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div[1]/div/input')
    # edit_display_name.clear()
    # time.sleep(0.5)
    driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div[1]/label').click()
    for i in range(200):
        edit_display_name.send_keys(Keys.BACKSPACE)
    edit_display_name.send_keys(display_name)
    time.sleep(0.5)

    edit_email = driver.find_element(by=By.XPATH,
                                     value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div[2]/div/input')
    # edit_email.clear()
    # time.sleep(0.5)
    driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div[2]/div/input').click()
    edit_email.send_keys(Keys.DOWN)
    for i in range(200):
        edit_email.send_keys(Keys.BACKSPACE)
    edit_email.send_keys(user_email)
    time.sleep(0.5)

    edit_phone_num = driver.find_element(by=By.XPATH,
                                         value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div[3]/div/input')
    # edit_phone_num.clear()
    # time.sleep(0.5)
    driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div[3]/div/input').click()
    edit_phone_num.send_keys(Keys.DOWN)
    for i in range(200):
        edit_phone_num.send_keys(Keys.BACKSPACE)
    edit_phone_num.send_keys(user_phone)
    time.sleep(0.5)

    save_button = driver.find_element(by=By.XPATH,
                                      value='/html/body/div/div/div[2]/div/div/div/div[1]/div/div[4]/div/div[1]/button')
    save_button.click()
    time.sleep(2)


# initiate the carpool
def initiate_the_carpool(start_location, end_location, other_location, year, month, date, hour, minute, carpool_money):
    initiate_page = driver.find_element(by=By.ID, value='nav-launch')
    initiate_page.click()
    time.sleep(0.5)

    input_datetime = driver.find_element(by=By.XPATH,
                                         value='/html/body/div/div/div[2]/div/div/div/form/div[1]/div[2]/div/div/input')
    driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/form/div[1]/div[2]/div/label').click()
    input_datetime.send_keys(year)
    time.sleep(0.5)
    input_datetime.send_keys(month)
    time.sleep(0.5)
    input_datetime.send_keys(date)
    time.sleep(0.5)
    input_datetime.send_keys(hour)
    time.sleep(0.5)
    input_datetime.send_keys(minute)
    time.sleep(0.5)

    input_carpool_money = driver.find_element(by=By.XPATH,
                                              value='/html/body/div/div/div[2]/div/div/div/form/div[2]/div/div/input')
    input_carpool_money.send_keys(carpool_money)
    time.sleep(0.5)

    input_start_locaiton = driver.find_element(by=By.XPATH,
                                               value='/html/body/div/div/div[2]/div/div/div/form/div[3]/div[1]/div/div/input')
    input_start_locaiton.send_keys(start_location)
    time.sleep(0.5)

    input_end_location = driver.find_element(by=By.XPATH,
                                             value='/html/body/div/div/div[2]/div/div/div/form/div[3]/div[2]/div/div/input')
    input_end_location.send_keys(end_location)
    time.sleep(0.5)

    input_carpool_people_select_button = driver.find_element(by=By.XPATH,
                                                             value='/html/body/div/div/div[2]/div/div/div/form/div[3]/div[3]/div/div/div')
    input_carpool_people_select_button.click()
    time.sleep(0.5)
    five_people = driver.find_element(by=By.XPATH, value='/html/body/div[2]/div[3]/ul/li[4]')
    five_people.click()
    time.sleep(0.5)

    input_carpool_way_select_button = driver.find_element(by=By.XPATH,
                                                          value='/html/body/div/div/div[2]/div/div/div/form/div[3]/div[4]/div/div/div[2]')
    input_carpool_way_select_button.click()
    time.sleep(0.5)
    not_self_drive = driver.find_element(by=By.XPATH, value='/html/body/div[2]/div[3]/ul/li[2]')
    not_self_drive.click()
    time.sleep(0.5)

    input_other_location = driver.find_element(by=By.XPATH,
                                               value='/html/body/div/div/div[2]/div/div/div/form/div[4]/div[1]/div/div/input')
    input_other_location.send_keys(other_location)
    time.sleep(0.5)
    add_button = driver.find_element(by=By.XPATH,
                                     value='/html/body/div/div/div[2]/div/div/div/form/div[4]/div[2]/button')
    add_button.click()
    time.sleep(0.5)

    initiate_button = driver.find_element(by=By.XPATH,
                                          value='/html/body/div/div/div[2]/div/div/div/form/div[6]/div[1]/button')
    initiate_button.click()
    time.sleep(2)


# end or dismiss the carpool
def end_or_dismiss_the_carpool():
    already_join_page = driver.find_element(by=By.ID, value='nav-joined')
    already_join_page.click()
    time.sleep(0.5)

    end_or_dismiss_button = driver.find_element(by=By.XPATH,
                                                value='/html/body/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div[2]/button')
    end_or_dismiss_button.click()
    time.sleep(0.5)

    driver.find_element(by=By.XPATH, value='/html/body/div[2]/div[3]/div/div/button[2]').click()
    time.sleep(2)
    driver.switch_to.alert.accept()
    time.sleep(2)


# Search
def search_the_carpool(s_start_location, s_end_location, s_year, s_month, s_date, s_hour, s_minute, s_AMPM):
    search_page = driver.find_element(by=By.ID, value='nav-search')
    search_page.click()
    time.sleep(0.5)

    get_into_location = driver.find_element(by=By.XPATH,
                                            value='/html/body/div/div/div[2]/div/div/div/div[1]/div[1]/div/div/input')
    get_into_location.send_keys(s_start_location)
    time.sleep(0.5)

    get_out_location = driver.find_element(by=By.XPATH,
                                           value='/html/body/div/div/div[2]/div/div/div/div[1]/div[2]/div/div/input')
    get_out_location.send_keys(s_end_location)
    time.sleep(0.5)

    input_search_datetime = driver.find_element(by=By.XPATH,
                                                value='/html/body/div/div/div[2]/div/div/div/div[1]/div[3]/div/div/input')
    driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[1]/div[3]/div/label').click()
    input_search_datetime.send_keys(s_month)
    time.sleep(0.5)
    input_search_datetime.send_keys(s_date)
    time.sleep(0.5)
    input_search_datetime.send_keys(s_year)
    time.sleep(0.5)
    input_search_datetime.send_keys(s_hour)
    time.sleep(0.5)
    input_search_datetime.send_keys(s_minute)
    time.sleep(0.5)
    input_search_datetime.send_keys(s_AMPM)
    time.sleep(0.5)

    search_button = driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[1]/div[4]/button')
    search_button.click()
    time.sleep(2)


def logout():
    user_page = driver.find_element(by=By.ID, value='nav-user')
    user_page.click()
    time.sleep(0.5)

    logout_button = driver.find_element(by=By.XPATH,
                                        value='/html/body/div/div/div[2]/div/div/div/div[1]/div[2]/div/div[3]/button')
    logout_button.click()
    time.sleep(2)


def join_the_carpool():
    join_button = driver.find_element(by=By.XPATH,
                                      value='/html/body/div/div/div[2]/div/div/div/div[3]/div/div/div[2]/div[1]/div/button')
    join_button.click()
    time.sleep(2)


def leave_the_carpool():
    already_join_page = driver.find_element(by=By.ID, value='nav-joined')
    already_join_page.click()
    time.sleep(0.5)

    leave_button = driver.find_element(by=By.XPATH,
                                       value='/html/body/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div[2]/button')
    leave_button.click()

    driver.find_element(by=By.XPATH, value='/html/body/div[2]/div[3]/div/div/button[2]').click()
    time.sleep(2)
    driver.switch_to.alert.accept()
    time.sleep(2)


def check_login():
    arrow_now = driver.find_element(by=By.XPATH, value='/html/body/div/div/div[1]/div/ul/li[1]/a')
    temp = arrow_now.text
    if temp == '搜尋共乘：目前在此':
        print("Login success!!")
    else:
        print("Login error")


def check_user_license():
    arrow_now = driver.find_element(by=By.XPATH,
                                    value='/html/body/div/div/div[2]/div/div/div/div[2]/div/div[1]/div/img')
    temp = arrow_now.get_attribute('src')
    if temp != '/static/media/noLicense.32f353fb8c5700b62de1.png':
        print("Upload license success!!")
    else:
        print("Upload license error")


def check_edit_inforamtion():
    arrow_now = driver.find_element(by=By.XPATH, value='/html/body/div/div/div[2]/div/div/div/div[1]/div[3]/div/div[2]')
    temp = arrow_now.text
    if temp == 'Save Success!':
        print("Edit information success!!")
    else:
        print("Edit information error")


def check_initiate_carpool():
    arrow_now = driver.find_element(by=By.XPATH,
                                    value='/html/body/div/div/div[2]/div/div/div/form/div[6]/div[3]/div/div[2]')
    temp = arrow_now.text
    if temp[0:4] == '發起成功':
        print("Initiate carpool success!!")
    else:
        print("Initiate carpool error")


def check_join_the_carpool():
    arrow_now = driver.find_element(by=By.XPATH,
                                    value='/html/body/div/div/div[2]/div/div/div/div[3]/div/div/div[2]/div[2]/div/div/div/h2')
    temp = arrow_now.text
    if temp == '成功加入行程':
        print("Join the carpool success!!")
    else:
        print("Join the carpool error")


def print_run_time(start_time):
    print('Run time : ', time.time() - start_time)
    print()


if __name__ == '__main__':
    user1 = 'testplan01'
    user2 = 'testplan02'
    user1_phone = '0911111101'
    user2_phone = '0911111102'
    user1_email = 'testplan01@gmail.com'
    user2_email = 'testplan02@gmail.com'

    license_path = './test.jpg'

    start_time = time.time()

    register(user=user1)

    login(user=user1)

    check_login()
    print_run_time(start_time=start_time)

    user_license(license_path=license_path)

    check_user_license()
    print_run_time(start_time=start_time)

    edit_user_information(display_name=user1,
                          user_email=user1_email,
                          user_phone=user1_phone
                          )

    check_edit_inforamtion()
    print_run_time(start_time=start_time)

    initiate_the_carpool(year='2023',
                         month='12',
                         date='12',
                         hour='20',
                         minute='10',
                         carpool_money='100',
                         start_location='台北',
                         end_location='高雄',
                         other_location='台南'
                         )

    check_initiate_carpool()
    print_run_time(start_time=start_time)

    search_the_carpool(s_year='2023',
                       s_month='12',
                       s_date='12',
                       s_hour='5',
                       s_minute='20',
                       s_AMPM='PM',
                       s_start_location='台北',
                       s_end_location='高雄'
                       )

    # end_or_dismiss_the_carpool()

    logout()

    register(user=user2)

    login(user=user2)

    search_the_carpool(s_year='2023',
                       s_month='12',
                       s_date='10',
                       s_hour='5',
                       s_minute='20',
                       s_AMPM='PM',
                       s_start_location='台北',
                       s_end_location='高雄'
                       )

    join_the_carpool()

    check_join_the_carpool()
    print_run_time(start_time=start_time)

    leave_the_carpool()
    driver.quit()