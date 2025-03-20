package com.carpool.service;

import com.carpool.entity.City;
import com.carpool.entity.Location;

public interface CityandLocationService {
    void createCityIfNotExist(String cityName_cn);
    void createLocationIfNotExist(String locationName_cn, String cityName_cn);

//    City searchCityByName(String cityName_cn);
//    Location searchLocationByName(String locationName_cn);

}
