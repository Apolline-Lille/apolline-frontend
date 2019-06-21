# User Guide for the apolline frontend

##How to use the app?

The apolline frontend app allow the user to generate compressed CSV file from the data in InfluxDB.

###Step 1: Choose the Database 

The first step is to choose the database from which you want to get the data: 
* Click on the button "1. Choose Database".
* Click on the dropdown on the left side and choose a database by clicking on it.
* Then click on submit to unlock the next step.

###Step 2: Choose the Measurements

In this second step you have to choose every measurements you need in your file:
* Choose each measurements you need by clicking on the square before the name. 
* Then click on submit to validate your choice, this will unlock the step 3.

###Step 3: Choose the Tags

When you have choosen the measurements, you have to choose the associated tags. By default every Tags are checked. When you have choosen the tags click on submit.

###Step 4: Choose the date

In this section you simply have to click on "Generate CSV" to begin the creation.

###Step 5: Download the file

When you have clicked on "Generate CSV" a download link will appear below. The file won't be ready immediately, you have to wait approximmately 45 seconds per measurements. If you click before the end you will have an alert saying that the file isn't ready. The file won't be accessible with the link after the download. 
