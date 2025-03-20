package com.carpool.config;

import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
//    @Bean
//    public TopicExchange chatroomExchange() {
//        return new TopicExchange("chatroomExchange");
//    }
//
//    @Bean
//    public Queue chatroomQueue() {
//        return new Queue("chatroomQueue");
//    }
//
//    @Bean
//    public Binding bindingChatroomQueue(Queue chatroomQueue, TopicExchange chatroomExchange) {
//        return BindingBuilder.bind(chatroomQueue).to(chatroomExchange).with("chatroom.routingKey");
//    }
//
//    @Bean
//    public TopicExchange notificationExchange() {
//        return new TopicExchange("notificationExchange");
//    }
//
//    @Bean
//    public Queue notificationQueue() {
//        return new Queue("notificationQueue");
//    }
//
//    @Bean
//    public Binding bindingNotificationQueue(Queue notificationQueue, TopicExchange notificationExchange) {
//        return BindingBuilder.bind(notificationQueue).to(notificationExchange).with("notification.routingKey");
//    }
    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

//    @Bean
//    public DirectExchange directExchange() {
//        return new DirectExchange("dynamicExchange");
//    }
}
