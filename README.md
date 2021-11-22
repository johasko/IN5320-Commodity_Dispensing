# **Case 1: Commodity Dispensing**
## **Group 8**
Group members:
  * Sander Krøglid                |  sandek
  * Martin Alexander Pedersen     |  martiape
  * Marius Nikolaj Pedersen       |  mariunp
  * Johannes Skøien               |  johasko

## **Prerequsites**

_DHIS2 CLI installed_

_DHIS2 Portal installed_

## **First time setup**

Use yarn install command in the project directory to import all the dependencies:

```bash
$ yarn install
```

then run the DHIS2 portal proxy with:

```bash
npx dhis-portal --target=https://verify.dhis2.org/in5320/

```

Lastly run the yarn start command in the project directory:

```bash
$ yarn start
```


## **About app:**
This project is the result of our work in the course IN5320. The app is built on the DHIS2-platform, and utilizes some of its avaliable design-components.
The app consists of the following components available for the user:

#### **Overview** ####
Allows the user to see the stock balance of the different commodities the hospital store has in its system.
The user can also search for commodities, filter out the different categories, and sort after stock balance within each category.
The Overview-component also allows the user to enter other hospitals stock listings, to see whether other hospital stores has remaining stock of commodities, in case of outage in own stock.

#### **Dispensing** ####
Allows the user to dispense the different commodities in stock. The user must enter category, commodity and amount, as well as the recipient name/id and department. All of these fieds are required for the form to be successfully submitted. As the restock only happens at the 14th each month, the "amount"-field displays a warning if there is a long time until next restock, and the amount may cause a risk of stock outage. When successfull, the scheme submits info to dataStore for logging, as well as update the stock in overview.
The  user can also enter a Dispensing History-tab, to see the logging of what commodities have been dispensed, from and to who, and when. This data is fetched from the dataStore-endpoint on entering.

#### **Restock** ####
Allows the user to register restock of items.
When restock is registrered, the changes are logged in a restock-log, which can be viewed by entering the Restock Log-tab. 
The stock in Overview is mutated accordingly to the entered restock.
Like Dispensing History, the data is fetched from dataStore on entering the tab.

#### **Technical** ####
Technical documentation for the components can be found above each function in the project (DOCSTRINGS). The app gathers info from the DHIS2-API, to update the overview. It uses the dataStore-endpoint store log-data from dispensing and restock (in their respective dataStore-files), and gathers data from these to update the log-tabs. Data is modified and posted with the help of dataMutation-queries.

## **Suggested/not-yet-realized future additions/weaknesses:**
 * Possibility for user to adjust stock up and down after ex. an item count, to adjust faulty stock. Disregarded as we haven't yet found sufficient restrictions for this not to be used as another way to dispense commodities. 
 * Fetching of data from the API/endpoint could have been more efficient, as the tables are updated every time the user enters the overview- or log-pages.
 * The "stock outage"-warning (Dispensing Commodity) triggers a bit too easily. Parameters to trigger this more correctly would preferably be based on some statistics of previous dispensing over the span of 1 year ++. Even though we do not have this available, we decided to keep the warning, even as it´s triggered easily, to display the concept and possible usage for this kind of warning.
