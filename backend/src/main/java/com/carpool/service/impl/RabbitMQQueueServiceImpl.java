package com.carpool.service.impl;

import com.carpool.service.RabbitMQQueueService;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQQueueServiceImpl implements RabbitMQQueueService {
    private final RabbitAdmin rabbitAdmin;
    public RabbitMQQueueServiceImpl(RabbitAdmin rabbitAdmin) {
        this.rabbitAdmin = rabbitAdmin;
    }
    public void createQueueAndBind(String queueName, String exchange, String routingKey) {
        Queue createdQueue = new Queue(queueName, true);
        TopicExchange createdExchange = new TopicExchange(exchange);
        rabbitAdmin.declareQueue(createdQueue);
        rabbitAdmin.declareExchange(createdExchange); // 如exchange name已存在則不會創建重複的exchange

        Binding binding = BindingBuilder.bind(createdQueue).to(createdExchange).with(routingKey);
        rabbitAdmin.declareBinding(binding);
    }
}
