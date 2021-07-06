export GIT_SSH_COMMAND="ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"
git config --global user.email "theuscovidatlas@gmail.com"
git config --global user.name "theuscovidatlas"


git clone --depth 1 git@github.com:GeoDaCenter/covid.git && cd covid

case $DATA_SOURCE in

	berkeley_predictions)
		export COMMAND="python ./data-scripts/berkeley_predictions/berkeley_predictions.py"
		;;

	usafacts)
	  export COMMAND="python ./data-scripts/usafacts/usafacts.py"
		;;

	1p3a)
		export COMMAND="python ./data-scripts/_1p3a/_1p3a.py"
		;;

	lisa)
		export COMMAND="python ./data-scripts/lisa/update_lisa_json.py"
		;;

	nyt)
		export COMMAND="python ./data-scripts/nyt/nyt.py"
		;;

	cdc)
		export COMMAND="python ./data-scripts/cdc/getCdcCountyData.py"
		;;
	
	vax)
		export COMMAND="python ./data-scripts/cdc/getCdcVaccinationData.py"
		;;
	
	hrsa)
		export COMMAND="python ./data-scripts/hrsa/getVaccinationClinics.py"
		;;

	hybridUpdate)
		export COMMAND="python ./data-scripts/cdc/hybrid_update.py"
		;;

	pbf)
		export COMMAND="python ./data-scripts/pbf/CsvToPbf.py"
		;;
		
	testing)
		export COMMAND='bash ./data-scripts/testing/run_testing.sh'

esac


if $COMMAND;
 		then
		if [ "$DATA_SOURCE" = "lisa" ];
	  		then exit 0;
		elif [ "$DATA_SOURCE" = "testing" ];
			then exit 0;
		elif [ "$DATA_SOURCE" = "hybridUpdate" ];
			then git add . && git commit -m "Updated: `date +'%Y-%m-%d %H:%M:%S'`" && git push;
		else
			git add . && git commit -m "Updated: `date +'%Y-%m-%d %H:%M:%S'` [skip ci]" && git push;
		fi
else
	echo "$DATA_SOURCE script failed.";
	exit 1;
fi
