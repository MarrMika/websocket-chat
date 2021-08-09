package com.marrmika.websocketchat.controller;

import com.marrmika.websocketchat.domain.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.HashSet;
import java.util.Set;

@Controller
public class ChatController {

    private Set<String> participants = new HashSet<>();

    @MessageMapping("/message")
    @SendTo("/chat/messages")
    public Message getMessage(Message message){
        if (addParticipant(message)) {
            return message;
        }
        throw new RuntimeException("The number of participants is reached!");
    }

    private boolean addParticipant(Message message){
        if (participants.size() < 2){
            participants.add(message.getFrom());
            message.setParticipant(participants.size());
            return true;
        } else if (participants.contains(message.getFrom())){
            message.setParticipant(participants.size());
            return true;
        }
        return false;
    }

}
