export const formatSearchData = (data) => {
    return data.map((item) => {
      // Extract carpoolEvents-related fields
      const startLocations = item.carpoolEvents.map(attendant => attendant.getOnLocation.name_cn);
      const endLocations = item.carpoolEvents.map(attendant => attendant.getOffLocation.name_cn);
      const attendantId = item.carpoolEvents.map(attendant => attendant.attendant.id);
      const attendantName = item.carpoolEvents.map(attendant => attendant.attendant.name);
  
      return {
        id: item.id,
        initiator: item.initiator.name,
        initiatorId: item.initiator.id,
        startLocation: item.startLocation.name_cn,
        endLocation: item.endLocation.name_cn,
        startCity: item.startCity.name_cn,
        endCity: item.endCity.name_cn,
        attendantStartLocations: startLocations,
        attendantEndLocations: endLocations, 
        attendantId: attendantId,
        attendantName: attendantName,
        maxAvailableSeat: item.maxAvailableSeat,
        currentAvailableSeat: item.currentAvailableSeat,
        time: item.startTime,
        start_time: item.startTime,
        is_ended: item.completed,
        carpool_attribute: item.selfDrive ? "發起人自駕" : "非自駕",
      };
    });
  };
