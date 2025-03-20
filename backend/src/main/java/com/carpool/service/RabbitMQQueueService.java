package com.carpool.service;

public interface RabbitMQQueueService {
    void createQueueAndBind(String queueName, String exchange, String routingKey);


}
