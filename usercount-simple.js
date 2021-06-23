db.users.find({}).forEach(
  function(user) {
    var user_created = user.createStamp.time;
    var userid = user._id; 
    var cohort = "cohort-not-defined";
    var tmpTime=ISODate ("2016-08-24T00:00:01.000Z").getTime();
    var step=1000*60*60*24*14
    var cohort_start=[tmpTime];
    tmpTime=user_created-tmpTime
    if(tmpTime<0){
      cohort = "pre-defined-cohort";
    }else{
      cohort=Math.floor(tmpTime/(1000*60*60*24*14))
    }

    // Wensheng: Somehting is wrong here
    var OMTM_age = ISODate().getTime() - 1000 * 60 * 60 * 24 *7;
    //print("OMTM",OMTM_age);
    var testCount = 0;
    var newTestCount = 0;
    
    var newestUpdate = 0;

    db.versions.find({"modules.tests.updateStamp.user":userid}).forEach(
       function(version) {
          //print("JSON: " + JSON.stringify(version));
          for (var modulekey in version.modules) {
            var module = version.modules[modulekey];
            for (var testkey in module.tests)  {
              var test = module.tests[testkey];
              if (test.updateStamp && test.updateStamp.user){
                var timestamp = test.updateStamp.time;
                if (newestUpdate < timestamp){
                  newestUpdate = timestamp;
                }
                testCount++;
              }
              if (test.updateStamp && (test.updateStamp.time > OMTM_age)){
                newTestCount++;
              }
            }
          }
        }
    )
    var OMTM = newestUpdate > OMTM_age;

    var sep = ",";
    print(user.email + sep + cohort + sep + user.contactInfo.firstName + sep + user.contactInfo.lastName + sep + new Date(user.createStamp.time) + sep + (user.status === "active") + sep +(newestUpdate?new Date(newestUpdate):'na') + sep + (user.projectMap ? Object.keys(user.projectMap).length : 0) + sep + testCount + sep + newTestCount);
}
);
