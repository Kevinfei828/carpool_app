package com.carpool.mapper;

import com.carpool.entity.City;
import com.carpool.entity.Location;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CityandLocationMapper {
    // on duplicate key update相當於執行update where
    // warning: 如table有多個unique columns則等價於update where ... or ... limit 1，
    // 因為只會update一個row，所以避免在有多個unique indexes時用on duplicate key update

    // on duplicate key update和insert ignore into都會改變auto_increment的值

    @Insert("insert into City (name_cn) values (#{cityName_cn})" +
            "on duplicate key update name_cn = #{cityName_cn}")
    void createCityIfNotExist(String cityName_cn);

    @Select("select id from City where City.name_cn = #{cityName_cn}")
    Long getCityIdByName(String cityName_cn);



    @Insert("insert into Location (name_cn, city_id) values (#{locationName_cn}, #{cityId})" +
            "on duplicate key update city_id = city_id")
    void createLocationIfNotExist(String locationName_cn, Long cityId);

    @Select("select id from Location l where l.name_cn = #{locationName_cn} and l.city_id = #{cityId}")
    Long getLocationIdByNameAndCityId(String locationName_cn, Long cityId);

}
