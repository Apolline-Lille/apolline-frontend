# User Guide for the apolline frontend

## How to use the app?

The apolline frontend app allow the user to generate compressed CSV file from the data in InfluxDB.

### Step 1: Choose the Database 

The first step is to choose the database from which you want to get the data: 
* Click on the button "1. Choose Database".
* Click on the dropdown on the left side and choose a database by clicking on it.
* Then click on submit to unlock the next step.

![database](https://user-images.githubusercontent.com/43209797/59904028-cb1c8480-9402-11e9-8f14-ccb24ad094db.png)

### Step 2: Choose the Measurements

In this second step you have to choose every measurements you need in your file:
* Choose each measurements you need by clicking on the square before the name. 
* Then click on submit to validate your choice, this will unlock the step 3.

![measurements](https://user-images.githubusercontent.com/43209797/59904031-cbb51b00-9402-11e9-80ad-fe96119b92c5.png)

### Step 3: Choose the Tags

When you have choosen the measurements, you have to choose the associated tags. By default every Tags are checked. When you have choosen the tags click on submit.

![tags](https://user-images.githubusercontent.com/43209797/59904033-cbb51b00-9402-11e9-9a71-7ee4d140db27.png)

### Step 4: Choose the date

In this section you simply have to click on "Generate CSV" to begin the creation.

![generate](https://user-images.githubusercontent.com/43209797/59904030-cb1c8480-9402-11e9-9f11-f560f60f71aa.png)

### Step 5: Download the file

When you have clicked on "Generate CSV" a download link will appear below. The file won't be ready immediately, you have to wait approximmately 45 seconds per measurements. If you click before the end you will have an alert saying that the file isn't ready. The file won't be accessible with the link after the download. 

![notFinished](https://user-images.githubusercontent.com/43209797/59904032-cbb51b00-9402-11e9-95f9-510f38d6bb3c.png)
