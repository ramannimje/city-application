package com.application.city.controller;

import com.application.city.model.City;
import com.application.city.service.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/cities")
public class CityController {
    private final CityRepository cityRepository;

    @Autowired
    public CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public Page<City> getCities(Pageable pageable) {
        return cityRepository.findAll(pageable);
    }

    @GetMapping("/{name}")
    public City getCityByName(@PathVariable String name) {
        return cityRepository.findByName(name);
    }

    @PutMapping("/{id}")
    public City updateCity(@PathVariable String id, @RequestBody City city) {
        city.setId(id);
        return cityRepository.save(city);
    }
}
