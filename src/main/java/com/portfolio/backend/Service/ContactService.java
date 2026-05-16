package com.portfolio.backend.Service;

import com.portfolio.backend.Model.Contact;
import com.portfolio.backend.Repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public Contact saveMessage(Contact contact) {
        return contactRepository.save(contact);
    }

    public List<Contact> getAllMessages() {
        return contactRepository.findAll();
    }

    public long getMessageCount() {
        return contactRepository.count();
    }
}