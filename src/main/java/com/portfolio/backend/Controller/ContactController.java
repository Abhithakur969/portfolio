package com.portfolio.backend.Controller;

import com.portfolio.backend.Model.Contact;
import com.portfolio.backend.Service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public Map<String, Object> submitContact(@RequestBody Contact contact) {
        Contact saved = contactService.saveMessage(contact);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("id", saved.getId());
        return response;
    }

    @GetMapping("/all")
    public List<Contact> getAllMessages() {
        return contactService.getAllMessages();
    }

    @GetMapping("/count")
    public Map<String, Long> getCount() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", contactService.getMessageCount());
        return response;
    }
}