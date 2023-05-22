package com.application.city.service;

import com.application.city.model.City;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CityRepository extends MongoRepository<City, String> {
        City findByName(String name);
}
