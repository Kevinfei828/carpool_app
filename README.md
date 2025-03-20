# Carpool Service Application

## Use Docker to run the app.

### Tech stacks
Frontend: React, npm \
Backend: Spring boot, maven \
Database: MySQL, Redis \
Others: RabbitMQ, Websocket

### Docker Settings
Edit backend/Dockerfile or frontend/Dockerfile for custom settings 


Create docker-compose file using the following template
```bash
mysql:
    image: mysql:8.0
    container_name: mysql
    environment:
      MYSQL_ROOT_PASSWORD: <your_mysql_root_password>
      MYSQL_DATABASE: carpool_app
      MYSQL_USER: <your_mysql_user_name>
      MYSQL_PASSWORD: <your_mysql_user_password>
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - mynetwork
    
    # on Linux or Mac
    command: 
      - --lower_case_table_names=1
redis:
    image: redis:7.0
    container_name: redis
    ports:
      - "6379:6379"
    environment:
      REDIS_PASSWORD: <your_redis_password>
    networks:
      - mynetwork

rabbitmq:
    image: rabbitmq:3.11-management
    container_name: rabbitmq
    ports:
      - "5672:5672"  
      - "15672:15672"  # rabbitmq admin UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    networks:
      - mynetwork
    
backend:
    build:
      context: ./backend  
      dockerfile: Dockerfile
    container_name: backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/carpool_app
      SPRING_DATASOURCE_USERNAME: <your_mysql_user_name>
      SPRING_DATASOURCE_PASSWORD: <your_mysql_user_password>
      SPRING_DATA_REDIS_HOST: redis
      SPRING_DATA_REDIS_PASSWORD: <your_redis_password>
      SPRING_RABBITMQ_HOST: rabbitmq
      SPRING_RABBITMQ_USERNAME: <your_rabbitmq_username>
      SPRING_RABBITMQ_PASSWORD: <your_rabbitmq_password>
      # create: 每次重開都會刷新db並create table, update: 只會更新db
      SPRING_JPA_HIBERNATE_DDL_AUTO: create  
      SPRING_JPA_SHOW_SQL: true
      SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL: true
      MYBATIS_CONFIGURATION_LOG_IMPL: org.apache.ibatis.logging.stdout.StdOutImpl
      MYBATIS_CONFIGURATION_MAP_UNDERSCORE_TO_CAMEL_CASE: true
      LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_JDBC_SUPPORT_JDBC_TRANSACTION_MANAGER: debug
      PAGEHELPER_HELPERDIALECT: mysql
      PAGEHELPER_REASONABLE: true
      PAGEHELPER_SUPPORTMETHODSARGUMENTS: true
    depends_on:
      - mysql
      - redis
      - rabbitmq
    networks:
      - mynetwork
    command: >
      sh -c "while ! nc -z mysql 3306; do sleep 2; done;
      java -jar /app/app.jar"

frontend:
    build:
      context: ./frontend  # React 專案的目錄
      dockerfile: Dockerfile
    container_name: frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - mynetwork

networks:
  mynetwork:
    driver: bridge

volumes:
  mysql_data: