package com.carpool.service.impl;

import com.carpool.entity.City;
import com.carpool.entity.Location;
import com.carpool.mapper.CityandLocationMapper;
import com.carpool.service.CityandLocationService;
import org.springframework.stereotype.Service;

@Service
public class CityandLocationServiceImpl implements CityandLocationService {
    private final CityandLocationMapper cityandLocationMapper;
    public CityandLocationServiceImpl(CityandLocationMapper cityandLocationMapper) {
        this.cityandLocationMapper = cityandLocationMapper;
    }
    public void createCityIfNotExist(String cityName_cn) {
        cityandLocationMapper.createCityIfNotExist(cityName_cn);
    }

    public void createLocationIfNotExist(String locationName_cn, String cityName_cn) {
        Long cityId = cityandLocationMapper.getCityIdByName(cityName_cn);
        cityandLocationMapper.createLocationIfNotExist(locationName_cn, cityId);
    }

}
