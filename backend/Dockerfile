# 使用 Maven 作為基礎映像來構建 Spring Boot 應用
FROM maven:3.8.3-openjdk-17 as build

# 設置工作目錄
WORKDIR /app

# 複製 pom.xml 和源代碼
COPY pom.xml .
COPY src ./src

# 構建 Spring Boot 應用
RUN mvn clean package -DskipTests

# 使用 OpenJDK 作為運行環境
FROM openjdk:17-jdk-alpine

# 設置工作目錄
WORKDIR /app

# 從構建階段複製 JAR 文件
COPY --from=build /app/target/*.jar app.jar

# 暴露 8080 端口
EXPOSE 8080

# 啟動 Spring Boot 應用
CMD ["java", "-jar", "app.jar"]