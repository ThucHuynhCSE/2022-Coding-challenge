exports.incidents = []
exports.officers = []
exports.resolve = async(event)=>{
    if (event.type=="IncidentOccurred"){
        const officerIndex = officeToEvent(incidents)
        //push iincidents
        incidents.push({
            id: event.incidentId,
            codeName: event.codeName,
            loc: event.loc,
            officerId: officers[officerIndex].id
        })
    }
    else if (event.type=="IncidentResolved"){
        for (let i in incidents){
            if (incidents[i].id == event.incidentId){
                for (let j in officers){
                    if (officers[j].id == event.officerId){
                        officers[j].active = true;
                        eventToOfficer(officers[j])
                    }
                }
                incidents.splice(i, 1); 
            }
        }
    } 
    else if (event.type=="OfficerGoesOnline"){
        officers.push({
            id: event.officerId,
            badgeName: event.badgeName,
            loc:{
                x: null,
                y: null
            },
            active: false
        })
    }
    else if (event.type=="OfficerLocationUpdated"){
        for (let i in officers){
            if (officers[i].id == event.officerId){
                if (officers[i].loc.x == null && officers[i].loc.y == null){
                    officers[i].loc = event.loc
                    officers[i].active = true; 
                } 
                if (officers[i].active){
                    eventToOfficer(officers[i])
                }
            }
        }
    }
    else if (event.type=="OfficerGoseOffline"){
        for (let i in officers){
            if (officers[i].id == event.officerId){
                for (let j in incidents){
                    if (incidents[j].officerId == event.officerId){
                        incidents[j].officerId = null;
                        officeToEvent(incidents[j]) 
                    }
                }
                officers.splice(i, 1); 
            }
        }
    }
}

const eventToOfficer = (officer)=>{
    let minDist = 1e18;
    let incidentId = null; 
    for (let i in incidents){
        if (incidents[i].officerId == null){
            const dist = sqrt(officer.loc.x-incidents[i].loc.x)**2 + (officer.loc.y-incidents[i].loc.y)**2
            if (minDist > dist){
                minDist = dist;
                incidentId = i
            }
        }
    } 
    if (incidentId){
        officers.active = false
        incidents[incidentId] = officer.id
    }
    return incidentId
}
const officeToEvent = (incident)=>{
    let minDist = 1e18;
    let officerId = null; 
    for (let i in officers){
        if (officers[i].active){
            const dist = sqrt(incident.loc.x-officers[i].loc.x)**2 + (incident.loc.y-officers[i].loc.y)**2
            if (minDist > dist){
                minDist = dist;
                officerId = i
            }
        }
    } 
    if (officerId){
        officers[officerId].active = false
        incident[officerId].officerId = officers[officerId].id
    } 
    return officerId
}