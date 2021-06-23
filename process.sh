DIR=`date +%m%d%y`
scp centos@db1be.boozang.com:/var/backup/metrics/bz_usercount_simple .

less bz_usercount_simple |grep -v Wensheng | grep -v Mats |grep -v Amol| grep -v mailinator | grep -v lwshome | grep -v boozang.com > stats

less stats  |  awk -F ","  '{ print ($9 > 0) ? $2","$9",1" : $2","$9",0" }'            > cohorts_breakdown.csv
less stats |  grep ",true," | awk -F "," '{ print $2",0,1"}'                              > cohorts_activated.csv
less stats |  awk -F ","  '{ print ($8 > 0) ? $2",0,1":"skip" }'        | grep -v "skip"  > cohorts_project.csv 
less stats |  awk -F ","  '{ print ($9 > 5) ? $2",0,1" :"skip" }'       | grep -v "skip"  > cohorts_10tests.csv 
less stats |  awk -F ","  '{ print ($9 > 50) ? $2",0,1" :"skip" }'      | grep -v "skip"  > cohorts_100tests.csv 
less stats |  awk -F ","  '{ print ($10 > 0) ? $2",0,1" : "skip" }'     | grep -v "skip"  > cohorts_newtest.csv 

gnuplot -p histogram_cohorts.pt
gnuplot -p actions_over_cohorts.pt

