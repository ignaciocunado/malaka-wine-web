package com.terruno.api.taste;

import java.util.Optional;

import com.terruno.api.user.User;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TasteProfileService {

    private final TasteProfileRepository profiles;

    public TasteProfileService(TasteProfileRepository profiles) {
        this.profiles = profiles;
    }

    @Transactional(readOnly = true)
    public Optional<TasteProfileDto> find(User user) {
        return profiles.findByUserId(user.getId()).map(TasteProfile::toDto);
    }

    @Transactional
    public TasteProfileDto save(User user, TasteProfileDto dto) {
        TasteProfile profile = profiles.findByUserId(user.getId()).orElseGet(() -> new TasteProfile(user));
        profile.apply(dto);
        return profiles.save(profile).toDto();
    }
}
