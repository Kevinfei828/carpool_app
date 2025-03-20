package com.carpool.MessageQueueConsumer;

import com.carpool.Utils.RabbitMQUtils;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import com.carpool.entity.Message;

// 每個queue都有一個consumer (webSocketServer)
@Component
public class EventChatroomConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final RabbitAdmin rabbitAdmin;
    private final ConnectionFactory connectionFactory;

    public EventChatroomConsumer(
            SimpMessagingTemplate messagingTemplate,
            RabbitAdmin rabbitAdmin,
            ConnectionFactory connectionFactory) {
        this.messagingTemplate = messagingTemplate;
        this.rabbitAdmin = rabbitAdmin;
        this.connectionFactory = connectionFactory;
    }

    public void bindEventQueue(String queueName, Long eventId) {
        startListening(queueName, message -> {
            String notificationMessageJson = new String(message.getBody());
            messagingTemplate.convertAndSend("/topic/event/notifications/" + eventId, notificationMessageJson);
        });
    }

    public void bindChatroomQueue(String queueName, Long chatroomId) {
        startListening(queueName, message -> {
            String chatMessageJson = new String(message.getBody());
            messagingTemplate.convertAndSend("/topic/chatroom/" + chatroomId, chatMessageJson);
        });
    }
    public void createEventAndChatroomQueue(Long eventId, Long chatroomId) {
        String chatroomMessageQueueName = RabbitMQUtils.CHATROOM_MESSAGE_PREFIX + "." + chatroomId;
        String eventNotificationQueueName = RabbitMQUtils.EVENT_NOTIFICATION_PREFIX + "." + eventId;

        // Create and bind queues dynamically
        createQueue(chatroomMessageQueueName, chatroomMessageQueueName);
        createQueue(eventNotificationQueueName, eventNotificationQueueName);

        bindEventQueue(eventNotificationQueueName, eventId);
        bindChatroomQueue(chatroomMessageQueueName, chatroomId);
    }

    public void createDMQueue(Long chatroomId) {
        // Define queue names
        String DMQueueName = RabbitMQUtils.DM_MESSAGE_PREFIX + "." + chatroomId;
        String DMNotificationQueueName = RabbitMQUtils.DM_NOTIFICATION_PREFIX + "." + chatroomId;

        // Create and bind queues dynamically
        createQueue(DMQueueName, DMQueueName);
        createQueue(DMNotificationQueueName, DMNotificationQueueName);

        startListening(DMQueueName, message -> {
            String chatMessageJson = new String(message.getBody());
            messagingTemplate.convertAndSend("/topic/DM/" + chatroomId, chatMessageJson);
        });

        startListening(DMNotificationQueueName, message -> {
            String notificationMessageJson = new String(message.getBody());
            messagingTemplate.convertAndSend("/topic/DM/notifications/" + chatroomId, notificationMessageJson);
        });
    }

    // 每個user在登入時都會建立一個User queue，用來收所有通知(系統通知, 陌生訊息的通知...)
    public void createUserQueue(Long userId) {
        String UserQueueName = RabbitMQUtils.USER_PREFIX + "." + userId;
        createQueue(UserQueueName, UserQueueName);

        startListening(UserQueueName, message -> {
            String notificationMessageJson = new String(message.getBody());
            messagingTemplate.convertAndSend("/topic/user/notifications/" + userId, notificationMessageJson);
        });
    }


    private void createQueue(String queueName, String routingKey) {
        // Declare queue
        Queue queue = new Queue(queueName);
        rabbitAdmin.declareQueue(queue);

        TopicExchange exchange = new TopicExchange(RabbitMQUtils.EXCHANGE_NAME);
        rabbitAdmin.declareExchange(exchange);

        // Declare binding
        Binding binding = BindingBuilder.bind(queue)
                .to(exchange)
                .with(routingKey);
        rabbitAdmin.declareBinding(binding);
    }

    private void startListening(String queueName, MessageListener messageListener) {
        // Create a listener container for the queue
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(queueName);
        container.setMessageListener(messageListener);
        container.start();
    }
}
