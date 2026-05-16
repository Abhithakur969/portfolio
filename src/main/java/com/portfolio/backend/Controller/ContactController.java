package com.portfolio.backend.Controller;
import com.portfolio.backend.Model.Contact;
import com.portfolio.backend.Service.ContactService;
import com.portfolio.backend.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ApiResponse submitContact(@RequestBody Contact contact) {
        Contact saved = contactService.saveMessage(contact);
        String message = "Thank you " + contact.getName() + "! Your message has been received.";
        return new ApiResponse(message, 200);
    }

    @GetMapping("/all")
    public List<Contact> getAllMessages() {
        return contactService.getAllMessages();
    }

    @GetMapping("/count")
    public ApiResponse getCount() {
        long count = contactService.getMessageCount();
        return new ApiResponse("Total messages: " + count, 200);
    }
}